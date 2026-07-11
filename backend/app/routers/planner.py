from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from app.services.agent import chat_with_agent, PlannerResponse

router = APIRouter(
    prefix="/api/plan",
    tags=["plan"],
)

class ChatRequest(BaseModel):
    messages: List[Dict[str, Any]]

@router.post("/chat", response_model=PlannerResponse)
async def chat_plan(request: ChatRequest):
    """
    Unified endpoint for generating and refining a meal plan.
    Accepts a list of messages (conversation history).
    Returns the updated PlannerResponse (MealPlan, GroceryList, Substitutions, etc.)
    """
    if not request.messages:
        raise HTTPException(status_code=400, detail="Messages list cannot be empty")
        
    try:
        response = await chat_with_agent(request.messages)
        return response
    except Exception as e:
        print(f"Error in chat_plan: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
