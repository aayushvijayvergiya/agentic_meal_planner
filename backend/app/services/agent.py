import json
import httpx
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from openai import AsyncOpenAI
from app.config import settings

# --- Pydantic Models for Output ---

class MealInfo(BaseModel):
    dish: str = Field(description="Name of the dish")
    ingredients_used: List[str] = Field(description="List of ingredients used for this meal")
    instructions: str = Field(description="Brief instructions or notes")

class MealPlan(BaseModel):
    breakfast: MealInfo
    lunch: MealInfo
    dinner: MealInfo

class GroceryItem(BaseModel):
    name: str = Field(description="Item name")
    quantity: str = Field(description="Quantity needed")
    estimated_price: float = Field(description="Estimated price in USD")

class Substitution(BaseModel):
    original_item: str
    suggested_substitute: str
    reason: str

class PlannerResponse(BaseModel):
    meal_plan: MealPlan
    grocery_list: List[GroceryItem]
    substitutions: List[Substitution]
    budget_feasibility: str = Field(description="Explanation of whether the plan fits the budget and why")
    total_estimated_cost: float


# --- Agent Setup ---

client = AsyncOpenAI(
    api_key=settings.groq_api_key or "DUMMY_KEY",
    base_url="https://api.groq.com/openai/v1"
)
MODEL_NAME = "openai/gpt-oss-120b"
REQUESTED_MODEL = "openai/gpt-oss-120b" 


from duckduckgo_search import DDGS

async def duckduckgo_search_prices(query: str) -> str:
    """Uses DuckDuckGo Search API to find rough price estimates for ingredients."""
    try:
        # DDGS is synchronous but it's fast enough for our use case, or we run it in a thread pool in a real prod app.
        # Here we just use it directly.
        results = DDGS().text(f"{query} price", max_results=3)
        snippets = [item.get("body", "") for item in results]
        return "\n".join(snippets)
    except Exception as e:
        return f"Error searching for '{query}': {str(e)}"

# Define the tool for OpenAI
tools = [
    {
        "type": "function",
        "function": {
            "name": "duckduckgo_search_prices",
            "description": "Search the web for the latest price of an ingredient or grocery item.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The search query, e.g., 'price of 1 dozen eggs walmart'"
                    }
                },
                "required": ["query"]
            }
        }
    }
]

async def chat_with_agent(messages: List[Dict[str, Any]]) -> PlannerResponse:
    """
    Sends the conversation to the agent, handles tool calls, and returns a structured PlannerResponse.
    The messages list should contain the history.
    """
    system_prompt = {
        "role": "system",
        "content": (
            "You are an expert AI meal planner and budget assistant. "
            "You help users create a daily meal plan (Breakfast, Lunch, Dinner) based on their plan for the day, ingredients at home, and budget. "
            "You must output ONLY valid JSON that matches the following structure:\n"
            "{\n"
            '  "meal_plan": {"breakfast": {"dish": "", "ingredients_used": [], "instructions": ""}, "lunch": {...}, "dinner": {...}},\n'
            '  "grocery_list": [{"name": "", "quantity": "", "estimated_price": 0.0}],\n'
            '  "substitutions": [{"original_item": "", "suggested_substitute": "", "reason": ""}],\n'
            '  "budget_feasibility": "Explanation...",\n'
            '  "total_estimated_cost": 0.0\n'
            "}\n"
            "Use the duckduckgo_search_prices tool to look up estimated prices for items they need to buy to ensure accuracy for the budget. "
            "Do not include ingredients they already have in the grocery list."
        )
    }
    
    current_messages = [system_prompt] + messages

    max_iterations = 5
    for _ in range(max_iterations):
        response = await client.chat.completions.create(
            model=REQUESTED_MODEL,
            messages=current_messages,
            tools=tools,
            tool_choice="auto",
            temperature=0.7,
            max_tokens=4000
        )
        
        response_message = response.choices[0].message

        if response_message.tool_calls:
            current_messages.append(response_message)
            for tool_call in response_message.tool_calls:
                if tool_call.function.name == "duckduckgo_search_prices":
                    try:
                        args = json.loads(tool_call.function.arguments)
                        result = await duckduckgo_search_prices(args.get("query", ""))
                    except Exception as e:
                        result = f"Error executing tool: {e}"
                    
                    current_messages.append({
                        "role": "tool",
                        "tool_call_id": tool_call.id,
                        "name": tool_call.function.name,
                        "content": result
                    })
            # loop continues to next iteration to let model process tool output
        else:
            # No more tool calls, we have our final content
            content = response_message.content
            break
    else:
        # If we hit max iterations
        content = response_message.content or "{}"

    try:
        # Groq might wrap the json in markdown blocks, let's strip it if present
        if content.startswith("```json"):
            content = content.split("```json")[1].split("```")[0].strip()
        elif content.startswith("```"):
            content = content.split("```")[1].split("```")[0].strip()
            
        data = json.loads(content)
        return PlannerResponse(**data)
    except Exception as e:
        print(f"Error parsing JSON: {content}")
        raise ValueError(f"Failed to parse agent response into structured format: {str(e)}")
