const getIP = () => {
  //return "http://localhost:9093";
  return "http://3.39.121.202:9093";
  //return "/api";
}
const getCopyright = () => {
  return "TEAM 5";
}

const getChatbotAPI = () => {
  return "http://121.78.128.146:5000"; // chatbot.py (ai폴더 플라스크 실행)
};

const getLlmAPI = () => {
  return "http://121.78.128.146:8000"; // llm.py(메일번역전송)
};

export {getIP, getCopyright, getChatbotAPI, getLlmAPI}; // import {getIP, getCopyright} from 'Tool';
