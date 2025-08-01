# agent_reservation/utils.py
import re
from datetime import datetime
import dateparser

def parse_datetime(text: str) -> tuple[datetime, datetime] | tuple[None, None]:

    pattern = r'\d{1,2}월\s?\d{1,2}일\s?(?:오전|오후)?\s?\d{1,2}시'
    matches = re.findall(pattern, text)
    print(f"[🔍 추출된 시간 문자열]: {matches}")

    parsed_times = []
    for t in matches:
        try:
            t_eng = t.replace("오전", "AM").replace("오후", "PM")
            dt = datetime.strptime(t_eng.strip(), "%m월 %d일 %p %I시")
            parsed_times.append(dt)
        except ValueError as e:
            print(f"[❌ 파싱 실패] '{t}' → '{t_eng}': {e}")
            parsed_times.append(None)

    if len(parsed_times) == 1 and parsed_times[0]:
        start = parsed_times[0]
        end = start.replace(hour=start.hour + 2)
    elif len(parsed_times) >= 2 and parsed_times[0] and parsed_times[1]:
        start, end = parsed_times[:2]
    else:
        print(f"[⚠️ 최종 파싱 실패] 입력: '{text}' / 결과: {parsed_times}")
        return None, None

    # ✅ 연도 보정: 현재 연도로 설정
    now = datetime.now()
    start = start.replace(year=now.year)
    end = end.replace(year=now.year)

    print(f"[⏰ 최종 결과] 입력: '{text}' → start: {start}, end: {end}")
    return start, end






def extract_placename(text: str) -> str:
    import re
    # 숫자 포함, "호", "실", "강의실" 같은 키워드로 끝나는 단어만 추출
    match = re.search(r'([가-힣A-Za-z0-9]{2,}\s?\d{1,3}호)', text)
    if match:
        placename = match.group(1).strip()
        print(f"[-> 장소 추출] 입력: '{text}' → placename: '{placename}'")
        return placename
    else:
        print(f"[-> 장소 추출] 입력: '{text}' → placename: 없음")
        return ""

