from flask import Flask, request, jsonify
import json
from flask_cors import CORS
from google.cloud.sql.connector import Connector
import sqlalchemy
import pymysql
import hashlib
import dotenv

dotenv.load_dotenv()
config = dotenv.dotenv_values()
DB_CONNECTION_NAME = config['DB_CONNECTION_NAME']
DB_USER = config['DB_USER']
DB_PASSWORD = config['DB_PASSWORD']
DB_NAME = config['DB_NAME']

connector = Connector()

conn = connector.connect(DB_CONNECTION_NAME, "pymysql", user=DB_USER, password=DB_PASSWORD, db=DB_NAME)
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

@app.route('/api/login', methods=['POST'])
def items_endpoint():
    if request.method == 'GET':
        return json.dumps(logins)
    elif request.method == 'POST':
        item = request.get_json()
        
        if item is None or item['username'] is None or item['password'] is None:
            return jsonify({"error": "No item provided"}), 400

        isNewUser = item['newUser'] == 'yes'
        username = str(item['username'])
        password = str(item['password'])
        encrypted_password = hashlib.sha256(password.encode()).hexdigest()
        encrypted_password = bytes(encrypted_password, 'utf-8')
        print(encrypted_password)
        cursor = conn.cursor()
        if not isNewUser:
            cursor.execute("SELECT * FROM users WHERE username = %s AND password = %s", (username, encrypted_password))
            result = cursor.fetchall()
            cursor.close()
            print(result)
            if len(result) == 0:
                return jsonify({"login": False}), 200
            else:
                return jsonify({"login": True, "username": username}), 200
        
        if isNewUser:
            print("Creating new user")
            cursor.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (username, encrypted_password))
            conn.commit()
            cursor.close()
            return jsonify({"login": True, "username": username}), 200
        
        return "success", 200

@app.route('/api/stories', methods=['GET', 'POST'])
def stories_endpoint():
    print("Getting stories")
    if request.method == 'GET':
        cursor = conn.cursor()
        # get all unique stories
        cursor.execute("SELECT location FROM stories GROUP BY location")
        result = cursor.fetchall()
        result = [location[0] for location in result]
        print(result)
        cursor.close()
        return jsonify(result), 200
    
    return "success", 200

@app.route('/api/story/first', methods=['GET', 'POST'])
def story_endpoint():
    if request.method == 'GET':
        cursor = conn.cursor()
        location = request.args.get('location')
        cursor.execute("SELECT story FROM stories WHERE id = (SELECT MIN(id) FROM stories WHERE location= \"{}\");".format(location))
        result = cursor.fetchall()
        response = {"prompt": result[0][0]}
        cursor.close()
        return jsonify(response), 200

    return "success", 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)