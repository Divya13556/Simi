from flask import Flask, render_template, jsonify
import json
import os

app = Flask(__name__)

with open(os.path.join(os.path.dirname(__file__), "data.json"), encoding="utf-8") as f:
    chatbot_data = json.load(f)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/get-data")
def get_data():
    return jsonify(chatbot_data)

if __name__ == "__main__":
    app.run(debug=True)