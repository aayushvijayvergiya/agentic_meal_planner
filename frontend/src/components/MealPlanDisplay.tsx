import React from 'react';
import { PlannerResponse } from '../types';

interface Props {
  data: PlannerResponse;
}

export const MealPlanDisplay: React.FC<Props> = ({ data }) => {
  return (
    <div className="fade-in">
      <h2>Your Meal Plan</h2>
      
      <div className="meal-grid">
        <div className="glass-panel meal-card breakfast">
          <h3>🌅 Breakfast</h3>
          <p><strong>{data.meal_plan.breakfast.dish}</strong></p>
          <p>{data.meal_plan.breakfast.instructions}</p>
          <p><em>Ingredients: {data.meal_plan.breakfast.ingredients_used.join(', ')}</em></p>
        </div>

        <div className="glass-panel meal-card lunch">
          <h3>☀️ Lunch</h3>
          <p><strong>{data.meal_plan.lunch.dish}</strong></p>
          <p>{data.meal_plan.lunch.instructions}</p>
          <p><em>Ingredients: {data.meal_plan.lunch.ingredients_used.join(', ')}</em></p>
        </div>

        <div className="glass-panel meal-card dinner">
          <h3>🌙 Dinner</h3>
          <p><strong>{data.meal_plan.dinner.dish}</strong></p>
          <p>{data.meal_plan.dinner.instructions}</p>
          <p><em>Ingredients: {data.meal_plan.dinner.ingredients_used.join(', ')}</em></p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
        <div className="glass-panel" style={{ flex: '1', minWidth: '300px' }}>
          <h3>🛒 Grocery List</h3>
          <ul>
            {data.grocery_list.map((item, i) => (
              <li key={i}>
                {item.quantity} {item.name} - <span style={{color: '#cbd5e1'}}>${item.estimated_price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <p style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
            <strong>Total Estimated Cost: </strong> ${data.total_estimated_cost.toFixed(2)}
          </p>
        </div>

        <div className="glass-panel" style={{ flex: '1', minWidth: '300px' }}>
          <h3>🔄 Substitutions</h3>
          {data.substitutions.length > 0 ? (
            <ul>
              {data.substitutions.map((sub, i) => (
                <li key={i}>
                  <strong>{sub.original_item}</strong> &rarr; {sub.suggested_substitute}<br/>
                  <span style={{ fontSize: '0.9em', color: '#cbd5e1' }}>{sub.reason}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No substitutions recommended.</p>
          )}
        </div>
      </div>

      <div className="glass-panel" style={{ marginTop: '2rem' }}>
        <h3>💰 Budget Feasibility</h3>
        <p>{data.budget_feasibility}</p>
      </div>
    </div>
  );
};
