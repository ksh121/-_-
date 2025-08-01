# chatbot.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from ai_agent import apitool
from rag import query_engine
from agent_reservation.agent import reservation_agent

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)


# ✅ RAG 응답 신뢰도 판단
def is_confident(answer: str, query: str) -> bool:
    if not answer or len(answer.strip()) < 30:
        return False

    low_conf_phrases = [
        "정확하지 않을 수 있습니다", "자세한 정보는 없습니다", "일반적으로",
        "도움이 되었으면 좋겠습니다", "확실하지 않습니다", "경우에 따라 다릅니다",
        "저는 알 수 없습니다", "정확한 답변은 어렵습니다", "명확한 정보가 없습니다",
    ]
    if any(phrase in answer for phrase in low_conf_phrases):
        return False

    keywords = [w for w in query.strip().replace("?", "").split() if len(w) >= 2]
    hit_count = sum(1 for w in keywords if w in answer)
    return hit_count >= 3


# ✅ 예약 관련 질문인지 판별
def is_reservation_query(message: str) -> bool:
    keywords = ["예약해", "예약해줘"]
    return any(k in message for k in keywords)


@app.route("/chat", methods=["POST"])
def chat_proc():
    if not request.is_json:
        return jsonify({"error": "Invalid JSON"}), 400

    data = request.json
    message = data.get("message", "")
    userno = data.get("userno")
    source = data.get("source", "user")
    mode = data.get("mode")  # ✅ 여기에 추가
    apitool.CURRENT_MODE = mode

    print("-> 사용자 질문:", message)

    # ✅ 0. 번역 모드인 경우 강제 translate_tool 실행
    if mode == "translate":
        from ai_agent.apitool import translate_tool
        sentence = message
        lang = data.get("lang", "영어")
        age = data.get("age", 20)
        final_input = f"{sentence} {lang} {age}"
        translated = translate_tool(final_input)
        return jsonify({"res": translated, "source": "translate"})

    # 1. 예약 관련이면 예약 에이전트로 분기
    if is_reservation_query(message):
        import agent_reservation.context
        print("✅ CURRENT_USERNO 설정:", userno)
        agent_reservation.context.CURRENT_USERNO = userno  # 이거 필수
        print("🏢 예약 Agent 사용")
        result = reservation_agent.invoke({"input": message})  # input은 문자열만 넘김
        return jsonify({"res": result["output"], "source": "reservation"})



    # 2. FAQ 버튼에서 온 요청은 RAG로 강제 처리
    if source == "faq":
        rag_answer = query_engine.query(message).response
        print("📚 [FAQ] RAG 응답:", rag_answer)
        return jsonify({"res": rag_answer, "source": "rag"})

    # 3. 일반 입력: RAG → 신뢰도 체크
    rag_answer = query_engine.query(message).response
    if is_confident(rag_answer, message):
        print("📚 RAG 응답 사용")
        return jsonify({"res": rag_answer, "source": "rag"})

    # 4. LangChain Agent fallback
    apitool.CURRENT_USERNO = userno
    agent = apitool.get_agent(mode)
    result = agent.invoke({"input": message})
    agent_answer = result["output"]

    if "Agent stopped due to" in agent_answer:
        agent_answer = "죄송해요! 질문을 잘 이해하지 못했어요. 조금 더 자세히 설명해주실 수 있나요?"

    print("🤖 Agent 응답 사용")
    return jsonify({"res": agent_answer, "source": "agent"})




#  예약 전용 엔드포인트 (테스트용 직접 호출 가능)
@app.route("/reservation-chat", methods=["POST"])
def reservation_chat():
    data = request.json
    message = data.get("message", "")
    userno = data.get("userno")
    import agent_reservation.context
    agent_reservation.context.CURRENT_USERNO = userno

    result = reservation_agent.invoke({"input": message})
    return jsonify({"res": result["output"]})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
