export interface MealInfo {
  dish: string;
  ingredients_used: string[];
  instructions: string;
}

export interface MealPlan {
  breakfast: MealInfo;
  lunch: MealInfo;
  dinner: MealInfo;
}

export interface GroceryItem {
  name: string;
  quantity: string;
  estimated_price: number;
}

export interface Substitution {
  original_item: string;
  suggested_substitute: string;
  reason: string;
}

export interface PlannerResponse {
  meal_plan: MealPlan;
  grocery_list: GroceryItem[];
  substitutions: Substitution[];
  budget_feasibility: string;
  total_estimated_cost: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}
