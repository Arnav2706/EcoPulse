from typing import Dict, TypedDict, Any
from langgraph.graph import StateGraph, END
from langchain_google_vertexai import ChatVertexAI
import os
from dotenv import load_dotenv
import json

load_dotenv()

# Initialize Gemini 2.5 Flash via Vertex AI
try:
    llm = ChatVertexAI(
        model_name="gemini-2.5-flash",
        project=os.environ.get("GCP_PROJECT_ID", "apikey2-494409"),
        location=os.environ.get("GCP_LOCATION", "us-central1")
    )
except Exception as e:
    print(f"Warning: Could not initialize VertexAI: {e}")
    llm = None

# Define State
class SpaceMissionState(TypedDict):
    input_query: str
    sensor_data: Dict[str, Any]
    analysis_report: str
    final_recommendation: str

# Define Nodes (Agents)
def monitoring_agent(state: SpaceMissionState):
    """Fetches NASA API data and attaches to state."""
    print("-> Monitoring Agent active...")
    from space_apis import get_near_earth_objects, get_space_weather
    
    # In a real scenario, this would use tool calling.
    # For now, we inject live data directly into the state.
    state["sensor_data"] = {
        "neos": get_near_earth_objects(days_ahead=1),
        "space_weather": get_space_weather()
    }
    return state

def prediction_agent(state: SpaceMissionState):
    """Analyzes the data for threats using Gemini 2.5 Flash."""
    print("-> Prediction Agent active...")
    if not llm:
        state["analysis_report"] = "AI unavailable. Data raw."
        return state
        
    prompt = f"User Query: {state['input_query']}\nAnalyze this live space data specifically to answer the user's query: {json.dumps(state['sensor_data'])[:1500]}..."
    response = llm.invoke(prompt)
    state["analysis_report"] = response.content
    return state

def commander_agent(state: SpaceMissionState):
    """Formulates final response to the user based on agent analysis."""
    print("-> Commander Agent active...")
    if not llm:
        state["final_recommendation"] = "System offline."
        return state
        
    prompt = f"User asked: {state['input_query']}. Analysis: {state['analysis_report']}. Give a highly professional, space-themed mission control response (max 3 sentences)."
    response = llm.invoke(prompt)
    state["final_recommendation"] = response.content
    return state

# Build the Graph
workflow = StateGraph(SpaceMissionState)

workflow.add_node("monitor", monitoring_agent)
workflow.add_node("predict", prediction_agent)
workflow.add_node("commander", commander_agent)

workflow.set_entry_point("monitor")
workflow.add_edge("monitor", "predict")
workflow.add_edge("predict", "commander")
workflow.add_edge("commander", END)

mission_control_app = workflow.compile()

if __name__ == "__main__":
    print("Running Mission Control Swarm Test...")
    initial_state = {
        "input_query": "Are there any immediate threats from space weather or asteroids today?",
        "sensor_data": {},
        "analysis_report": "",
        "final_recommendation": ""
    }
    result = mission_control_app.invoke(initial_state)
    print("\n--- FINAL COMMANDER REPORT ---")
    print(result.get("final_recommendation"))
