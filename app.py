from flask import Flask, request, jsonify
from chatbot import get_chat_response, reset_conversation
from flask_cors import CORS

app = Flask(__name__)

CORS(app)
@app.route("/")
def home():
    return jsonify({
        "message": "Chatbot API is running!",
        "endpoints": ["/chat", "/clear"]
    })


@app.route("/chat", methods=["POST"])
def chat():

    data = request.json

    question = data.get("message")

    if not question:
        return jsonify({
            "error": "Message is required"
        }), 400

    answer = get_chat_response(question)

    return jsonify({
        "response": answer
    })
@app.route("/clear", methods=["POST"])
def clear_chat():

    reset_conversation()

    return jsonify({
        "message": "Chat cleared successfully"
    })

if __name__ == "__main__":
    app.run(debug=True)