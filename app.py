from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from typing import Dict, List

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
    processed_funds.clear()  # Reset the processed funds
    current_serial = 1  # Reset serial number

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
                    # Store in processed_funds with serial number as key
                    processed_funds[current_serial] = {
                        "fund_house": current_fund_house,
                        "scheme_name": parts[3],
                        "nav": float(parts[4]) if parts[4] else None,
                        "date": parts[5]
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

@app.route('/nav', methods=['GET'])
def get_nav():
    raw_data = fetch_amfi_data()
    if not raw_data:
        return jsonify({"error": "Failed to fetch data from AMFI"}), 500
    
    funds_data = parse_mutual_fund_data(raw_data)
    return jsonify(funds_data)

@app.route('/nav/<int:serial_number>', methods=['GET'])
def get_nav_by_serial(serial_number):
    """Fetch NAV data for a specific serial number"""
    if not processed_funds:
        # If processed_funds is empty, fetch and process the data
        raw_data = fetch_amfi_data()
        if not raw_data:
            return jsonify({"error": "Failed to fetch data from AMFI"}), 500
        parse_mutual_fund_data(raw_data)
    
    fund_data = processed_funds.get(serial_number)
    if fund_data:
        return jsonify(fund_data)
    return jsonify({"error": "Fund not found"}), 404

@app.route('/search', methods=['GET'])
def search_funds():
    search_term = request.args.get('name', '').lower()
    if not search_term:
        return jsonify({"error": "Search term is required"}), 400

    try:
        raw_data = fetch_amfi_data()
        if not raw_data:
            return jsonify({"error": "Failed to fetch data from AMFI"}), 500
            
        all_funds = parse_mutual_fund_data(raw_data)

        results = []
        for fund in all_funds:
            for scheme in fund['schemes']:
                if search_term in scheme['scheme_name'].lower() or search_term in fund['fund_house'].lower():
                    results.append({
                        "serial_number": scheme['serial_number'],
                        "fund_house": fund['fund_house'],
                        "scheme_name": scheme['scheme_name'],
                        "nav": scheme['nav'],
                        "date": scheme['date']
                    })

        return jsonify(results)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)