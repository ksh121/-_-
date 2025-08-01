# build_rag_index.py
from llama_index.core import SimpleDirectoryReader, VectorStoreIndex, Settings
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.openai import OpenAI
from llama_index.core.node_parser import SimpleNodeParser

node_parser = SimpleNodeParser()
Settings.llm = OpenAI(model="gpt-4o-mini")
Settings.embed_model = OpenAIEmbedding()
Settings.node_parser = node_parser

documents = SimpleDirectoryReader("../data").load_data()
index = VectorStoreIndex.from_documents(documents)
index.storage_context.persist("../storage")
print("✅ 벡터 인덱스 빌드 완료! ./storage 폴더에 저장됐습니다.")
