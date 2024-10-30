from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from typing import Dict, List
from datetime import datetime
from functools import lru_cache

app = Flask(__name__)
CORS(app)

# Global variables to store processed fund data with serial numbers
processed_funds: Dict[int, dict] = {}
current_serial = 1

def fetch_amfi_data():
    """
    Fetch NAV data from AMFI website
    
    Returns:
        str: Raw NAV data from AMFI website or None if fetch fails
    """
    try:
        url = "https://www.amfiindia.com/spages/NAVAll.txt"
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return response.text
    except requests.RequestException as e:
        print(f"Error fetching data: {str(e)}")
        return None

def parse_date(date_str):
    """
    Parse date string from AMFI format to ISO format
    
    Args:
        date_str (str): Date string in DD-MMM-YYYY format
        
    Returns:
        str: ISO formatted date string or None if parsing fails
    """
    try:
        return datetime.strptime(date_str, '%d-%b-%Y').isoformat()
    except (ValueError, TypeError):
        return None

def determine_scheme_type(scheme_name):
    """
    Determine scheme type based on scheme name
    
    Args:
        scheme_name (str): Name of the mutual fund scheme
        
    Returns:
        str: Scheme type (Direct, Regular, or Unknown)
    """
    scheme_name = scheme_name.upper()
    
    if any(x in scheme_name for x in ['DIRECT', 'DIR.']):
        return 'Direct'
    elif any(x in scheme_name for x in ['REGULAR', 'REG.']):
        return 'Regular'
    else:
        return 'Unknown'

def determine_scheme_category(scheme_name):
    """
    Determine scheme category based on scheme name
    
    Args:
        scheme_name (str): Name of the mutual fund scheme
        
    Returns:
        str: Scheme category
    """
    scheme_name = scheme_name.upper()
    
    categories = {
        'EQUITY': ['EQUITY', 'LARGE CAP', 'MID CAP', 'SMALL CAP', 'MULTICAP', 'FLEXI CAP'],
        'DEBT': ['DEBT', 'GILT', 'INCOME', 'CORPORATE BOND', 'CREDIT RISK'],
        'HYBRID': ['HYBRID', 'BALANCED', 'EQUITY SAVINGS'],
        'LIQUID': ['LIQUID', 'OVERNIGHT', 'MONEY MARKET'],
        'INDEX': ['INDEX', 'ETF', 'NIFTY', 'SENSEX'],
        'ELSS': ['ELSS', 'TAX SAV'],
    }
    
    for category, keywords in categories.items():
        if any(keyword in scheme_name for keyword in keywords):
            return category
            
    return 'Others'

def parse_mutual_fund_data(raw_data):
    """
    Parse AMFI NAV data with improved error handling
    
    Args:
        raw_data (str): Raw NAV data from AMFI website
        
    Returns:
        list: Processed fund data with proper error handling
    """
    global current_serial, processed_funds
    processed_funds.clear()
    current_serial = 1

    if not raw_data:
        return []
        
    lines = raw_data.split('\n')
    funds = []
    current_fund_house = None
    current_schemes = []

    # Skip header line
    header_found = False

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # Skip the header line
        if "Scheme Code;ISIN Div Payout" in line:
            header_found = True
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
                    # Handle NAV parsing with proper error handling
                    try:
                        nav_value = float(parts[4]) if parts[4] and parts[4].strip().upper() != 'N.A.' else None
                    except (ValueError, TypeError):
                        nav_value = None

                    scheme_name = parts[3].strip()
                    scheme_info = {
                        "serial_number": current_serial,
                        "scheme_code": parts[0].strip(),
                        "isin_payout": parts[1].strip() if parts[1].strip() != '-' else None,
                        "isin_reinvest": parts[2].strip() if parts[2].strip() != '-' else None,
                        "scheme_name": scheme_name,
                        "nav": nav_value,
                        "nav_date": parse_date(parts[5].strip()) if len(parts) > 5 else None
                    }
                    
                    processed_funds[current_serial] = {
                        "fund_house": current_fund_house,
                        "scheme_name": scheme_name,
                        "nav": nav_value,
                        "nav_date": scheme_info["nav_date"],
                        "scheme_code": scheme_info["scheme_code"],
                        "isin_payout": scheme_info["isin_payout"],
                        "isin_reinvest": scheme_info["isin_reinvest"],
                        "scheme_type": determine_scheme_type(scheme_name),
                        "scheme_category": determine_scheme_category(scheme_name)
                    }
                    
                    current_serial += 1
                    current_schemes.append(scheme_info)
            except Exception as e:
                # Log the error but continue processing
                print(f"Warning: Error processing line: {line}, Error: {str(e)}")
                continue

    # Add the last fund house if exists
    if current_fund_house and current_schemes:
        funds.append({
            "fund_house": current_fund_house,
            "schemes": current_schemes
        })

    return funds

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
                        "nav_date": scheme['nav_date'],
                        "scheme_type": determine_scheme_type(scheme['scheme_name']),
                        "scheme_category": determine_scheme_category(scheme['scheme_name']),
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

@app.route('/api/v1/nav', methods=['GET'])
def get_nav():
    """
    Get NAV data with optional fund house filter
    Optional parameters:
    - fund_house: Filter by fund house name
    - limit: Limit number of results (default: 100)
    - offset: Offset for pagination (default: 0)
    """
    fund_house = request.args.get('fund_house', '').lower()
    limit = int(request.args.get('limit', 100))
    offset = int(request.args.get('offset', 0))

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
            # Apply fund house filter if provided
            if fund_house and fund_house not in fund['fund_house'].lower():
                continue
                
            for scheme in fund['schemes']:
                results.append({
                    "serial_number": scheme['serial_number'],
                    "fund_house": fund['fund_house'],
                    "scheme_name": scheme['scheme_name'],
                    "scheme_code": scheme['scheme_code'],
                    "nav": scheme['nav'],
                    "nav_date": scheme['nav_date'],
                    "scheme_type": determine_scheme_type(scheme['scheme_name']),
                    "scheme_category": determine_scheme_category(scheme['scheme_name']),
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

@app.route('/api/v1/nav/<int:serial_number>', methods=['GET'])
def get_nav_by_serial(serial_number):
    """
    Get NAV data for a specific fund by serial number
    """
    try:
        if serial_number not in processed_funds:
            raw_data = fetch_amfi_data()
            if not raw_data:
                return jsonify({
                    "status": "error",
                    "message": "Failed to fetch data from AMFI",
                    "timestamp": datetime.now().isoformat()
                }), 500
            parse_mutual_fund_data(raw_data)
            
        if serial_number not in processed_funds:
            return jsonify({
                "status": "error",
                "message": "Fund not found",
                "timestamp": datetime.now().isoformat()
            }), 404
            
        return jsonify({
            "status": "success",
            "timestamp": datetime.now().isoformat(),
            "data": processed_funds[serial_number]
        })
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e),
            "timestamp": datetime.now().isoformat()
        }), 500

if __name__ == '__main__':
    app.run(debug=True)