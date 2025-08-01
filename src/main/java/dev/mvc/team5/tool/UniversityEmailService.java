package dev.mvc.team5.tool;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class UniversityEmailService {

    private static final Map<String, String> universityEmailDomains = new HashMap<>();

    static {
        universityEmailDomains.put("서울대학교", "snu.ac.kr");
        universityEmailDomains.put("연세대학교", "yonsei.ac.kr");
        universityEmailDomains.put("고려대학교", "korea.ac.kr");
        universityEmailDomains.put("한양대학교", "hanyang.ac.kr");
        universityEmailDomains.put("성균관대학교", "skku.edu");
        universityEmailDomains.put("경희대학교", "khu.ac.kr");
        universityEmailDomains.put("중앙대학교", "cau.ac.kr");
        universityEmailDomains.put("이화여자대학교", "ewha.ac.kr");
        universityEmailDomains.put("서강대학교", "sogang.ac.kr");
        universityEmailDomains.put("건국대학교", "konkuk.ac.kr");
        universityEmailDomains.put("경민대학교", "kyungmin.ac.kr");
        universityEmailDomains.put("테스트대학교", "naver.com");
    }

    public boolean isValidUniversityEmail(String email) {
        return universityEmailDomains.values().stream()
                .anyMatch(domain -> email.endsWith("@" + domain));
    }

    public String getUniversityByEmail(String email) {
        return universityEmailDomains.entrySet().stream()
                .filter(entry -> email.endsWith("@" + entry.getValue()))
                .map(Map.Entry::getKey)
                .findFirst()
                .orElse(null);
    }
}