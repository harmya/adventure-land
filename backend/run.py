from flask import Flask, request, jsonify
import json
from flask_cors import CORS
from google.cloud.sql.connector import Connector
import sqlalchemy
import pymysql
import hashlib
import dotenv
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

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
        cursor = conn.cursor()
        if not isNewUser:
            cursor.callproc('check_user_credentials', [username, encrypted_password])
            result = cursor.fetchall()
            cursor.close()
   
            if len(result) == 0:
                return jsonify({"login": False}), 200
            else:
                return jsonify({"login": True, "username": username}), 200
        
        if isNewUser:
            print("Creating new user")
            cursor.callproc('insert_new_user', [username, encrypted_password])
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
        username = request.args.get('username')
        if username is not None:
            timestamp = datetime.datetime.now()
            cursor.execute("INSERT INTO userHistory (username, location, timestamp) VALUES (%s, %s, %s)", (username, location, timestamp))
            conn.commit()
        
        cursor.close()
        return jsonify(response), 200

    return "success", 200

@app.route('/api/changepassword', methods=['GET', 'POST'])
def change_password():
    if request.method == 'POST':
        cursor = conn.cursor()
        item = request.get_json()
        username = item['username']
        old_password = item['oldPassword']
        new_password = item['newPassword']
        old_password = hashlib.sha256(old_password.encode()).hexdigest()
        new_password = hashlib.sha256(new_password.encode()).hexdigest()
        cursor.execute("SELECT * FROM users WHERE username = %s AND password = %s", (username, old_password))
        result = cursor.fetchall()
        if len(result) == 0:
            return jsonify({"success": False}), 200
        else:
            cursor.execute("UPDATE users SET password = %s WHERE username = %s", (new_password, username))
            conn.commit()
            cursor.close()
            return jsonify({"success": True}), 200

    return "success", 200

@app.route('/api/deleteaccount', methods=['GET', 'POST'])
def delete_account():
    if request.method == 'POST':
        cursor = conn.cursor()
        item = request.get_json()
        username = item['username']
        
        cursor.execute("DELETE FROM users WHERE username = %s", (username))
        conn.commit()
        cursor.close()
        return jsonify({"success": True}), 200

@app.route('/api/history', methods=['GET', 'POST'])
def get_history():
    if request.method == 'POST':
        cursor = conn.cursor()
        username = request.args.get('username')
        range_start = request.args.get('rangeStart')
        range_end = request.args.get('rangeEnd')
        range_start = range_start + " 00:00:00"
        range_end = range_end + " 23:59:59"
        range_start = datetime.strptime(range_start, "%Y-%m-%d %H:%M:%S")
        range_end = datetime.strptime(range_end, "%Y-%m-%d %H:%M:%S")

        cursor.execute("SELECT location, timestamp FROM userHistory WHERE username = %s AND timestamp BETWEEN %s AND %s", (username, range_start, range_end))
        result = cursor.fetchall()
        result = [{"location": location, "timestamp": timestamp} for location, timestamp in result]
        return jsonify(result), 200

@app.route('/api/story/choices', methods=['GET', 'POST'])
def get_choices():
    if request.method == 'GET':
        cursor = conn.cursor()
        choice = request.args.get('choice')
        cursor.execute("SELECT nextChoies FROM choiceMap WHERE choice = \"{}\";".format(choice))
        result = cursor.fetchall()
        choice = result[0][0]
        choice = choice.split(' ')
        choices = []
        for c in choice:
            cursor.execute("SELECT text FROM choices WHERE id = {};".format(c))
            result = cursor.fetchall()
            choices.append(result[0][0])
        response = {"choices": choices}
        cursor.close()
        return jsonify(response), 200

    return "success", 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)