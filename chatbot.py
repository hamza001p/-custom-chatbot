from ollama import chat
from knowledge_base import COMPANY_KNOWLEDGE


SYSTEM_PROMPT = f"""
You are a professional AI assistant.

Use the following company information to answer questions.

{COMPANY_KNOWLEDGE}
"""


conversation_history = [
    {
        "role": "system",
        "content": SYSTEM_PROMPT
    }
]


def get_chat_response(question):

    conversation_history.append({
        "role": "user",
        "content": question
    })

    response = chat(
        model="qwen2.5:3b",
        messages=conversation_history
    )

    answer = response["message"]["content"]

    conversation_history.append({
        "role": "assistant",
        "content": answer
    })

    return answer


def reset_conversation():

    global conversation_history

    conversation_history = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT
        }
    ]
    print("Chatbot file is running!")
   
if __name__ == "__main__":
    print("Company Chatbot Started!")
    print("Type 'exit' to quit.")

    while True:
        question = input("\nYou: ")

        if question.lower() == "exit":
            break

        answer = get_chat_response(question)
        print("Bot:", answer)
