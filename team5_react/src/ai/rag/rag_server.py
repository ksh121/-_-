# rag_server.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from llama_index.core import StorageContext, load_index_from_storage

app = Flask(__name__)
CORS(app)

# ✅ 저장된 인덱스 로드
storage_context = StorageContext.from_defaults(persist_dir="./storage")
index = load_index_from_storage(storage_context)
query_engine = index.as_query_engine()
print("✅ RAG 인덱스 로드 완료!")

@app.route("/rag-query", methods=["POST"])
def rag_query():
    if not request.is_json:
        return jsonify({"error": "Invalid JSON"}), 400

    message = request.json.get("message", "")
    response = query_engine.query(message).response
    return jsonify({"res": response})

if __name__ == "__main__":
    app.run(port=5001)
