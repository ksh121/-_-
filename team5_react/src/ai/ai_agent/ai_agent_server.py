# ai_agent_server.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import apitool  # agent 정의된 모듈

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

@app.route("/chat", methods=["POST"])
def chat_proc():
    if not request.is_json:
        return jsonify({"error": "Invalid JSON: Content-Type must be application/json"}), 400
    data = request.json
    print("✅ 받은 요청:", data)
    message = data.get("message", "")
    userno = data.get("userno")
    print("userno", userno)

    apitool.CURRENT_USERNO = userno
    result = apitool.agent.invoke({"input": message, "userno": userno})
    output = result["output"]

    if "Agent stopped due to" in output:
        output = "죄송해요! 제가 질문을 잘 이해하지 못했어요. 궁금한 점을 조금 더 자세히 알려주실 수 있을까요?"

    return jsonify({"res": output})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
