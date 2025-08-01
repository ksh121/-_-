# rag/__init__.py
from llama_index.core import StorageContext, load_index_from_storage
from llama_index.llms.openai import OpenAI
from llama_index.core import Settings

# 한국어 응답을 위한 system_prompt 설정
Settings.llm = OpenAI(
    model="gpt-4o-mini",
    system_prompt="항상 한국어로 답변해 주세요."
)
storage_context = StorageContext.from_defaults(persist_dir="./storage")
index = load_index_from_storage(storage_context)
query_engine = index.as_query_engine()

__all__ = ["query_engine"]
