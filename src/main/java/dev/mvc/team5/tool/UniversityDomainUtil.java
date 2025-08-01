package dev.mvc.team5.tool;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

public class UniversityDomainUtil {
    private static final Set<String> UNIVERSITY_DOMAINS = new HashSet<>(Arrays.asList(
        "snu.ac.kr", "korea.ac.kr", "yonsei.ac.kr", "postech.ac.kr", 
        "kaist.ac.kr", "unist.ac.kr", "inha.ac.kr", "hanyang.ac.kr", 
        "khu.ac.kr", "ewha.ac.kr", "skku.edu" // 등등 직접 수집
    ));

    public static boolean isUniversityEmail(String email) {
        if (email == null || !email.contains("@")) return false;
        String domain = email.substring(email.indexOf("@") + 1).toLowerCase();
        return UNIVERSITY_DOMAINS.contains(domain);
    }
}