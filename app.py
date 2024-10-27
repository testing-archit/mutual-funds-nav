from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from typing import Dict, List
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Global variable to store processed fund data with serial numbers
processed_funds: Dict[int, dict] = {}
current_serial = 1

def fetch_amfi_data():
    """Fetch NAV data from AMFI website"""
    try:
        url = "https://www.amfiindia.com/spages/NAVAll.txt"
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return response.text
    except requests.RequestException as e:
        print(f"Error fetching data: {str(e)}")
        return None

def parse_mutual_fund_data(raw_data):
    global current_serial, processed_funds
    processed_funds.clear()
    current_serial = 1

    if not raw_data:
        return []
        
    lines = raw_data.split('\n')
    funds = []
    current_fund_house = None
    current_schemes = []

    for line in lines:
        line = line.strip()
        if not line:
            continue

        if ';' not in line:
            if current_fund_house and current_schemes:
                funds.append({
                    "fund_house": current_fund_house,
                    "schemes": current_schemes
                })
            current_fund_house = line
            current_schemes = []
        else:
            try:
                parts = line.split(';')
                if len(parts) >= 6:
                    scheme_info = {
                        "serial_number": current_serial,
                        "scheme_code": parts[0],
                        "isin_payout": parts[1],
                        "isin_reinvest": parts[2] if parts[2] != '-' else None,
                        "scheme_name": parts[3],
                        "nav": float(parts[4]) if parts[4] else None,
                        "date": parts[5]
                    }
                    processed_funds[current_serial] = {
                        "fund_house": current_fund_house,
                        "scheme_name": parts[3],
                        "nav": float(parts[4]) if parts[4] else None,
                        "date": parts[5],
                        "scheme_code": parts[0],
                        "isin_payout": parts[1],
                        "isin_reinvest": parts[2] if parts[2] != '-' else None
                    }
                    current_serial += 1
                    current_schemes.append(scheme_info)
            except (IndexError, ValueError) as e:
                print(f"Error parsing line: {line}, Error: {str(e)}")
                continue

    if current_fund_house and current_schemes:
        funds.append({
            "fund_house": current_fund_house,
            "schemes": current_schemes
        })

    return funds

@app.route('/api/v1/nav', methods=['GET'])
def get_all_nav():
    """
    Get all NAV data
    Optional query parameters:
    - fund_house: Filter by fund house name
    - limit: Limit number of results (default: 100)
    - offset: Offset for pagination (default: 0)
    """
    fund_house = request.args.get('fund_house', '').lower()
    limit = int(request.args.get('limit', 100))
    offset = int(request.args.get('offset', 0))
    
    raw_data = fetch_amfi_data()
    if not raw_data:
        return jsonify({
            "status": "error",
            "message": "Failed to fetch data from AMFI",
            "timestamp": datetime.now().isoformat()
        }), 500
    
    funds_data = parse_mutual_fund_data(raw_data)
    
    # Filter and format response
    results = []
    for fund in funds_data:
        if not fund_house or fund_house in fund['fund_house'].lower():
            for scheme in fund['schemes']:
                results.append({
                    "serial_number": scheme['serial_number'],
                    "fund_house": fund['fund_house'],
                    "scheme_name": scheme['scheme_name'],
                    "scheme_code": scheme['scheme_code'],
                    "nav": scheme['nav'],
                    "date": scheme['date'],
                    "isin_payout": scheme['isin_payout'],
                    "isin_reinvest": scheme['isin_reinvest']
                })

    # Apply pagination
    paginated_results = results[offset:offset + limit]
    
    return jsonify({
        "status": "success",
        "timestamp": datetime.now().isoformat(),
        "data": {
            "total_count": len(results),
            "limit": limit,
            "offset": offset,
            "funds": paginated_results
        }
    })

@app.route('/api/v1/nav/<int:serial_number>', methods=['GET'])
def get_nav_by_serial(serial_number):
    """Get NAV data for a specific serial number"""
    if not processed_funds:
        raw_data = fetch_amfi_data()
        if not raw_data:
            return jsonify({
                "status": "error",
                "message": "Failed to fetch data from AMFI",
                "timestamp": datetime.now().isoformat()
            }), 500
        parse_mutual_fund_data(raw_data)
    
    fund_data = processed_funds.get(serial_number)
    if fund_data:
        return jsonify({
            "status": "success",
            "timestamp": datetime.now().isoformat(),
            "data": fund_data
        })
    return jsonify({
        "status": "error",
        "message": "Fund not found",
        "timestamp": datetime.now().isoformat()
    }), 404

@app.route('/api/v1/search', methods=['GET'])
def search_funds():
    """
    Search funds by name or fund house
    Required query parameter:
    - q: Search query
    Optional parameters:
    - limit: Limit number of results (default: 100)
    - offset: Offset for pagination (default: 0)
    """
    search_term = request.args.get('q', '').lower()
    limit = int(request.args.get('limit', 100))
    offset = int(request.args.get('offset', 0))
    
    if not search_term:
        return jsonify({
            "status": "error",
            "message": "Search query is required (use 'q' parameter)",
            "timestamp": datetime.now().isoformat()
        }), 400

    try:
        raw_data = fetch_amfi_data()
        if not raw_data:
            return jsonify({
                "status": "error",
                "message": "Failed to fetch data from AMFI",
                "timestamp": datetime.now().isoformat()
            }), 500
            
        all_funds = parse_mutual_fund_data(raw_data)

        results = []
        for fund in all_funds:
            for scheme in fund['schemes']:
                if search_term in scheme['scheme_name'].lower() or search_term in fund['fund_house'].lower():
                    results.append({
                        "serial_number": scheme['serial_number'],
                        "fund_house": fund['fund_house'],
                        "scheme_name": scheme['scheme_name'],
                        "scheme_code": scheme['scheme_code'],
                        "nav": scheme['nav'],
                        "date": scheme['date'],
                        "isin_payout": scheme['isin_payout'],
                        "isin_reinvest": scheme['isin_reinvest']
                    })

        # Apply pagination
        paginated_results = results[offset:offset + limit]
        
        return jsonify({
            "status": "success",
            "timestamp": datetime.now().isoformat(),
            "data": {
                "total_count": len(results),
                "limit": limit,
                "offset": offset,
                "funds": paginated_results
            }
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e),
            "timestamp": datetime.now().isoformat()
        }), 500

if __name__ == '__main__':
    app.run(debug=True)