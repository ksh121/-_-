package dev.mvc.team5.tool;
import java.io.UnsupportedEncodingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.Key;
import java.security.NoSuchAlgorithmException;
 
import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
 
import org.apache.commons.codec.binary.Base64;
 
public class Security {
  private String iv;
  private Key keySpec;
 
  // 키 생성
  public Security() {
    try {
      // String key = "soldeskAES256KEY"; // key는 16자, 123 -> spyryuhFvhnnv6cD2ROB8g==
      String key = "soldesk5t2e6a5m2";    // key는 16자, 123 -> KUxUbf+4VrlpsFZ3tSAKdw==
      this.iv = key.substring(0, 16);
   
      byte[] keyBytes = new byte[16];
      byte[] b = key.getBytes("UTF-8");
      int len = b.length;
      if (len > keyBytes.length)
        len = keyBytes.length;
      System.arraycopy(b, 0, keyBytes, 0, len);
      SecretKeySpec keySpec = new SecretKeySpec(keyBytes, "AES");
   
      this.keySpec = keySpec;
    } catch (UnsupportedEncodingException e) {
      e.printStackTrace();
    }
  }
 
  // 암호화
  public String aesEncode(String str) {    
    String enStr = "";
    
    try {
      Cipher c = Cipher.getInstance("AES/CBC/PKCS5Padding");
      c.init(Cipher.ENCRYPT_MODE, keySpec, new IvParameterSpec(iv.getBytes()));
   
      byte[] encrypted = c.doFinal(str.getBytes("UTF-8"));
      enStr = new String(Base64.encodeBase64(encrypted));
    } catch(UnsupportedEncodingException e) {
      e.printStackTrace();
    } catch(NoSuchAlgorithmException e) {
      e.printStackTrace();
    } catch(NoSuchPaddingException e) {
      e.printStackTrace();
    } catch(InvalidKeyException e) {
      e.printStackTrace();
    } catch(InvalidAlgorithmParameterException e) {
      e.printStackTrace();
    } catch(IllegalBlockSizeException e) {
      e.printStackTrace();
    } catch(BadPaddingException e) {
      e.printStackTrace();
    }
 
    return enStr;
  }
 
 
}