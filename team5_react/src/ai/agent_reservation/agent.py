# agent_reservation/agent.py
from langchain_openai import ChatOpenAI
from langchain.agents import initialize_agent
from agent_reservation.tools import tools

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

reservation_agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent_type="openai-functions",
    verbose=True,
    max_iterations=2,
    early_stopping_method="generate"
)
