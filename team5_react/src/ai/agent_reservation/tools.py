# agent_reservation/tools.py
from langchain.agents import Tool
import agent_reservation.context
from agent_reservation.utils import parse_datetime, extract_placename
import requests

BASE_URL = "http://localhost:9093/reservations/api"


def make_reservation(input: dict) -> str:
    message = input.get("message")
    userno = input.get("userno")

    if not userno:
        return "예약 요청에 사용자 정보가 없습니다."
    
    # 장소/시간 파싱
    placename = extract_placename(message)
    start_time, end_time = parse_datetime(message)

    # ✅ 시간 파싱 실패 시 안내
    if not start_time or not end_time:
        return "시간 정보를 이해하지 못했어요. 예: '8월 5일 오후 3시에 공학101호 예약해줘'처럼 입력해 주세요."

    # placeno 조회
    res = requests.get(f"{BASE_URL}/placeno", params={"placename": placename})
    placeno = res.json().get("placeno")
    if placeno is None:
        return f"'{placename}'이라는 장소를 찾을 수 없어요."

    # 시간 중복 체크
    conflict_check = requests.get(f"{BASE_URL}/conflict", params={
        "placeno": placeno,
        "start": start_time.isoformat(),
        "end": end_time.isoformat()
    })
    if conflict_check.json().get("conflict"):
        return f"{placename}은(는) 해당 시간에 이미 예약이 있어요."

    # 예약 생성
    payload = {
        # "userno": userno,
        "userno": userno,
        "placeno": placeno,
        "start_time": start_time.isoformat(),
        "end_time": end_time.isoformat(),
        "purpose": "챗봇예약",
        "status": "예약됨"
    }
    print("[📦 예약 요청 바디]", payload)
    create_res = requests.post(f"{BASE_URL}/create", json=payload)

    if create_res.status_code == 200:
        return f"{placename}를 {start_time.strftime('%m월 %d일 %H시')}부터 {end_time.strftime('%H시')}까지 예약했어요!"
    else:
        print("[🚨 예약 실패 응답]:", create_res.status_code, create_res.text)
        return f"예약에 실패했어요. 서버 응답: {create_res.text}"
    
    
def reservation_func(msg):
    from agent_reservation.context import CURRENT_USERNO  # ✅ 매번 가져오기
    return make_reservation({"message": msg, "userno": CURRENT_USERNO})

reservation_tool = Tool(
    name="예약 생성",
    func=reservation_func,
    description="자연어 메시지를 받아 예약을 생성합니다. 사용자 번호는 전역 상태에서 사용됩니다."
)


tools = [reservation_tool]
