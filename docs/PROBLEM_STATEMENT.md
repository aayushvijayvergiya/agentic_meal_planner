# Problem Statement

> A cooking to-do list

Build a simple AI micro-app that helps a user generate a personal cooking to-do list based on their day.

A structured meal planning flow that produces:
Breakfast/Lunch/Dinner plan
grocery list
Substitutions
budget feasibility logic

## Goal, Scope & Success Criteria

<!-- What should the solution do? Who uses it? What's explicitly out of scope? How will you know it's working? -->

User should land on the page and see a text box to enter thier plan for the day and ingredients they have at home. 
User should be able to set their total budget for the day. 


Based on the user's input, the agent should generate a cooking to-do list that includes: 
- Breakfast/Lunch/Dinner plan
- grocery list
- Substitutions
- budget feasibility logic


## Architecture Preferences/Constraints

<!-- Do you already have opinions on LLM provider (Anthropic, OpenAI, etc.), agent framework (LangGraph, Pydantic AI, plain loop), or deployment constraints? If not, leave blank and let the coding agent propose options. -->

For architecture use the basic structure already in the repository.
Frontend: React with Vite
Backend: Fastapi server 
DB: SQLIte
Deployment: Render
Agent: openai-sdk
Model: openai/gpt-oss-120b
Provider: Groq


## Tools/Capabilities Needed

<!-- What actions does the agent need to take? e.g. web search, code execution, file access, database queries, calling other APIs. -->

- Agent should be able to access the internet to get the latest prices of the ingredients.
- Agent should be able to parse the user's input to extract the meal plan and the ingredients they have at home.
- Agent should be able to use the extracted information to generate a grocery list.
- Agent should be able to use the extracted information to generate a list of substitutions.
- Agent should be able to use the extracted information to generate a list of budget feasibility.

Data Sources:
- Google Search API for latest prices of the ingredients

## Inputs/Outputs & Data Sources

<!-- What data goes in (user messages, uploaded files, API payloads)? What comes out? Where does persistent data live, if any? -->

Input: User query in natural language
Output: 
    A structured meal plan for breakfast, lunch, and dinner.
    A grocery list of items needed for the meal plan.
    A list of substitutions for the meal plan.
    A list of budget feasibility.

    User should be able to chat and refine the meal plan.