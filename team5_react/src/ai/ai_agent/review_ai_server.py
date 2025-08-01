# review_ai_server.py
from flask import Flask, request, jsonify
from flask_cors import CORS # CORS 허용을 위해 필요
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
import os # API 키를 환경 변수에서 로드하기 위해 필요

app = Flask(__name__)
CORS(app) # 모든 Origin 허용 (개발 단계에서만 사용, 실제 운영 시에는 특정 Origin만 허용 권장)

# LangChain 초기화
# API 키를 환경 변수에서 가져오도록 설정 (예: OPENAI_API_KEY)
# 실제 사용 시에는 직접 코드에 넣지 말고 환경 변수에서 로드하는 것이 보안상 안전합니다.
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0) # gpt-4o-mini 모델 사용

# 리뷰 요약 함수
def summarize_reviews(review_texts: list, context_id: str = None, context_type: str = None) -> str:
    """
    주어진 리뷰 텍스트 리스트를 종합하여 핵심 내용을 간결하게 요약합니다.
    context_id와 context_type은 요약 프롬프트에 추가적인 맥락을 제공할 수 있습니다.
    """
    # 각 리뷰 텍스트의 앞뒤 공백을 제거하고, 빈 문자열이 된 리뷰는 제외합니다.
    cleaned_review_texts = [text.strip() for text in review_texts if text and text.strip()]
    
    print(f"summarize_reviews: 전처리 후 남은 리뷰 내용: {cleaned_review_texts}") # ⭐ 디버그 로그 추가 ⭐
    
    if not cleaned_review_texts: # 전처리 후 리스트가 비어있는지 확인
        print("summarize_reviews: 전처리 후 요약할 리뷰가 없습니다.") # ⭐ 디버그 로그 추가 ⭐
        return "요약할 리뷰가 없습니다."
    
    if len(cleaned_review_texts) <= 2: # 리뷰 개수가 너무 적을 때
        print("summarize_reviews: 리뷰 내용이 부족합니다.") # ⭐ 디버그 로그 추가 ⭐
        return "리뷰 내용이 부족해 구체적인 요약을 할 수 없습니다."

    # 모든 리뷰 텍스트를 하나의 큰 문자열로 결합
    combined_reviews = "\n\n".join(cleaned_review_texts)
    
    print(f"summarize_reviews: 요약을 위해 결합된 최종 내용: \n---START---\n{combined_reviews}\n---END---") # ⭐ 디버그 로그 추가 ⭐
    
    # ⭐⭐⭐ 요약 프롬프트에 깔끔하고 자연스러운 출력 지시 추가 ⭐⭐⭐
    base_prompt_instruction = (
        "다음 리뷰 목록을 바탕으로, 해당 재능 게시물에 대한 사용자들의 **전반적인 만족도와 핵심적인 평가**를 "
        "**2~3문장으로 간결하게 요약**해 주세요. "
        "**특정 리뷰 표현('좋아요', '너무 좋다' 등)을 직접 인용하거나 언급하지 마세요.** "
        "요약은 마치 사람이 직접 게시물의 반응을 정리한 것처럼 **자연스럽고 편안한 문체**로 작성하며, "
        "불필요한 서론이나 분석적인 표현 없이 **결론적인 내용만** 담아주세요."
    )


    context_specific_instruction = ""
    if context_type and context_id:
        if context_type == "receiver":
            context_specific_instruction = f"이 요약은 사용자 (ID: {context_id})에게 달린 리뷰에 대한 것입니다."
        elif context_type == "talent":
            context_specific_instruction = f"이 요약은 재능 게시물 (ID: {context_id})에 대한 리뷰에 대한 것입니다."
    
    # 최종 프롬프트 구성
    final_prompt_content = f"{base_prompt_instruction}\n{context_specific_instruction}\n\n리뷰 목록:\n{{content}}"

    # LangChain PromptTemplate을 사용하여 요약 프롬프트 정의
    prompt_template = PromptTemplate.from_template(
        final_prompt_content # ⭐ 변경된 최종 프롬프트 사용
    )
    
    # LangChain 체인 생성: 프롬프트 -> LLM -> 문자열 파서
    chain = prompt_template | llm | StrOutputParser()
    
    # 체인 실행 및 결과 반환
    summary = chain.invoke({"content": combined_reviews})
    
    print(f"summarize_reviews: LLM으로부터 받은 요약 결과: {summary}") # ⭐ 디버그 로그 추가 ⭐
    
    return summary

# 프로필용 리뷰 요약
def summarize_reviews_profile(review_texts: list, context_id: str = None, context_type: str = None) -> str:
    """
    주어진 리뷰 텍스트 리스트를 종합하여 핵심 내용을 간결하게 요약합니다.
    context_id와 context_type은 요약 프롬프트에 추가적인 맥락을 제공할 수 있습니다.
    """
    # 각 리뷰 텍스트의 앞뒤 공백을 제거하고, 빈 문자열이 된 리뷰는 제외합니다.
    cleaned_review_profile_texts = [text.strip() for text in review_texts if text and text.strip()]
    
    print(f"summarize_reviews: 전처리 후 남은 리뷰 내용: {cleaned_review_profile_texts}") # ⭐ 디버그 로그 추가 ⭐
    
    if not cleaned_review_profile_texts: # 전처리 후 리스트가 비어있는지 확인
        print("summarize_reviews: 전처리 후 요약할 리뷰가 없습니다.") # ⭐ 디버그 로그 추가 ⭐
        return "요약할 리뷰가 없습니다."
    
    if len(cleaned_review_profile_texts) <= 2: # 리뷰 개수가 너무 적을 때
        print("summarize_reviews: 리뷰 내용이 부족합니다.") # ⭐ 디버그 로그 추가 ⭐
        return "리뷰 내용이 부족해 구체적인 요약을 할 수 없습니다."

    # 모든 리뷰 텍스트를 하나의 큰 문자열로 결합
    combined_reviews = "\n\n".join(cleaned_review_profile_texts)
    
    print(f"summarize_reviews: 요약을 위해 결합된 최종 내용: \n---START---\n{combined_reviews}\n---END---") # ⭐ 디버그 로그 추가 ⭐
    
    # ⭐⭐⭐ 요약 프롬프트에 깔끔하고 자연스러운 출력 지시 추가 ⭐⭐⭐
    base_prompt_instruction = (
        "다음 리뷰 목록을 바탕으로, 해당 재능 게시물에 대한 사용자들의 **전반적인 만족도와 핵심적인 평가**를 "
        "**50글자 내외로 간결하게 요약**해 주세요. "
        "**특정 리뷰 표현('좋아요', '너무 좋다' 등)을 직접 인용하거나 언급하지 마세요.** "
        "요약은 마치 사람이 직접 게시물의 반응을 정리한 것처럼 **자연스럽고 편안한 문체**로 작성하며, "
        "불필요한 서론이나 분석적인 표현 없이 **결론적인 내용만** 담아주세요."
    )


    context_specific_instruction = ""
    if context_type and context_id:
        if context_type == "receiver":
            context_specific_instruction = f"이 요약은 사용자 (ID: {context_id})에게 달린 리뷰에 대한 것입니다."
        elif context_type == "talent":
            context_specific_instruction = f"이 요약은 재능 게시물 (ID: {context_id})에 대한 리뷰에 대한 것입니다."
    
    # 최종 프롬프트 구성
    final_prompt_content = f"{base_prompt_instruction}\n{context_specific_instruction}\n\n리뷰 목록:\n{{content}}"

    # LangChain PromptTemplate을 사용하여 요약 프롬프트 정의
    prompt_template = PromptTemplate.from_template(
        final_prompt_content # ⭐ 변경된 최종 프롬프트 사용
    )
    
    # LangChain 체인 생성: 프롬프트 -> LLM -> 문자열 파서
    chain = prompt_template | llm | StrOutputParser()
    
    # 체인 실행 및 결과 반환
    summary = chain.invoke({"content": combined_reviews})
    
    print(f"summarize_reviews: LLM으로부터 받은 요약 결과: {summary}") # ⭐ 디버그 로그 추가 ⭐
    
    return summary

# ⭐ Flask API 엔드포인트 정의 ⭐
@app.route('/summarize-reviews', methods=['POST'])
def summarize_reviews_api():
    """
    POST 요청으로 리뷰 텍스트 리스트와 (선택적으로) receiverNo 또는 talentNo를 받아
    AI로 요약한 후 반환하는 API 엔드포인트.
    요청 JSON 형식: {"reviewComments": ["리뷰1 내용", ...], "receiverNo": 123} 또는 {"reviewComments": [...], "talentNo": 456}
    응답 JSON 형식: {"summary": "요약된 내용"}
    """
    data = request.json # 요청 바디에서 JSON 데이터 파싱
    print(f"Python AI Server - 요청 받은 원본 데이터: {data}")

    # 'reviewComments' 키가 없거나 데이터가 비어있으면 에러 반환
    if not data or 'reviewComments' not in data or not isinstance(data['reviewComments'], list):
        return jsonify({"error": "유효한 리뷰 데이터(reviewComments 리스트)가 제공되지 않았습니다."}), 400

    review_comments = data['reviewComments'] # 프런트에서 넘어온 리뷰 텍스트 리스트
    
    # ⭐ receiverNo 또는 talentNo를 추출 (둘 중 하나만 존재할 수 있음)
    receiver_no = data.get('receiverNo') 
    talent_no = data.get('talentNo')

    context_id = None
    context_type = None

    if receiver_no is not None:
        context_id = receiver_no
        context_type = "receiver"
    elif talent_no is not None:
        context_id = talent_no
        context_type = "talent"

    try:
        # summarize_reviews 함수 호출 시 context_id와 context_type 전달
        summary = summarize_reviews(review_comments, context_id=context_id, context_type=context_type)
        return jsonify({"summary": summary}) # 요약 결과를 JSON으로 반환
    except Exception as e:
        # 요약 중 예외 발생 시 에러 응답 반환
        print(f"리뷰 요약 중 오류 발생: {e}")
        return jsonify({"error": f"리뷰 요약 처리 중 서버 오류가 발생했습니다: {str(e)}"}), 500
    
@app.route('/summarize-reviews-profile', methods=['POST'])
def summarize_reviews_profile_api():
    """
    POST 요청으로 리뷰 텍스트 리스트와 (선택적으로) receiverNo 또는 talentNo를 받아
    프로필 카드용으로 짧게 AI로 요약한 후 반환하는 API 엔드포인트.
    요청 JSON 형식: {"reviewComments": ["리뷰1", ...], "receiverNo": 123}
    응답 JSON 형식: {"summary": "50자 내외 요약"}
    """
    data = request.json
    print(f"Python AI Server - 프로필 요약용 요청 데이터: {data}")

    if not data or 'reviewComments' not in data or not isinstance(data['reviewComments'], list):
        return jsonify({"error": "유효한 리뷰 데이터(reviewComments 리스트)가 제공되지 않았습니다."}), 400

    review_comments = data['reviewComments']
    receiver_no = data.get('receiverNo') 
    talent_no = data.get('talentNo')

    context_id = None
    context_type = None

    if receiver_no is not None:
        context_id = receiver_no
        context_type = "receiver"
    elif talent_no is not None:
        context_id = talent_no
        context_type = "talent"

    try:
        summary = summarize_reviews_profile(review_comments, context_id=context_id, context_type=context_type)
        return jsonify({"summary": summary})
    except Exception as e:
        print(f"프로필용 리뷰 요약 중 오류 발생: {e}")
        return jsonify({"error": f"요약 처리 중 서버 오류가 발생했습니다: {str(e)}"}), 500


if __name__ == '__main__':
    # Flask 앱 실행
    # 기본적으로 5000번 포트에서 실행됩니다.
    # debug=True는 개발 중에는 유용하지만, 실제 운영 환경에서는 False로 설정해야 합니다.
    app.run(port=5001, debug=True)