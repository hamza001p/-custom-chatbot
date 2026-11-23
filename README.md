# FlyAwways AI Chatbot 🤖

A custom AI chatbot built for **FlyAwways** using Python, Flask, Ollama, and Llama 3.

The chatbot answers questions based on the company's knowledge base and maintains conversation context while the application is running.

## 🚀 Features

* Llama 3 local AI model
* Custom company knowledge base
* Conversation memory
* Flask REST API
* Frontend chatbot interface
* CORS support
* Clear conversation functionality
* Postman API testing
* Out-of-scope question handling

## 🛠️ Technologies Used

* Python
* Flask
* Flask-CORS
* Ollama
* Llama 3
* HTML
* CSS
* JavaScript
* REST API

## 📁 Project Structure

```text
custom-chatbot/
│
├── app.py
├── chatbot.py
├── knowledge_base.py
├── requirements.txt
├── .gitignore
├── README.md
│
└── frontend/
    ├── index.html
    ├── style.css
    └── script.js
```

## ⚙️ How It Works

The user sends a message through the frontend.

The frontend sends the message to the Flask API:

```text
POST /chat
```

Flask passes the user's question to the chatbot function.

The chatbot sends the conversation and company knowledge to the locally running Llama 3 model through Ollama.

The AI generates a response and Flask sends it back to the frontend.

### Flow

```text
User
 ↓
Frontend
 ↓
Flask API
 ↓
Chatbot Logic
 ↓
Ollama
 ↓
Llama 3
 ↓
AI Response
 ↓
Frontend
```

## 🔌 API Endpoints

### Chat

```text
POST /chat
```

Request:

```json
{
    "message": "What services does FlyAwways provide?"
}
```

Response:

```json
{
    "response": "FlyAwways provides website development, AI chatbots, and accounting services."
}
```

### Clear Conversation

```text
POST /clear
```

This resets the temporary conversation history.

## ▶️ Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Open the project

```bash
cd custom-chatbot
```

### 3. Create virtual environment

```bash
python -m venv .venv
```

### 4. Activate virtual environment

Windows:

```bash
.venv\Scripts\activate
```

### 5. Install dependencies

```bash
pip install -r requirements.txt
```

### 6. Make sure Ollama is installed

The project uses Ollama to run the Llama model locally.

Make sure the required model is available:

```bash
ollama list
```

The project currently uses:

```text
llama3:latest
```

If necessary:

```bash
ollama pull llama3
```

### 7. Run Flask

```bash
python app.py
```

The Flask server will run locally.

### 8. Open the frontend

Open:

```text
frontend/index.html
```

in your browser.

## 🧪 Testing

The API can also be tested using Postman.

Example:

```text
POST http://127.0.0.1:5000/chat
```

Body:

```json
{
    "message": "How much does website development cost?"
}
```

## 🔐 Knowledge Restriction

The chatbot is designed to answer questions related to FlyAwways.

If the requested information is not available in the company's knowledge base, the chatbot should respond:

> I don't have information about that.

## 👨‍💻 Author

Naimat Ullah — GitHub
