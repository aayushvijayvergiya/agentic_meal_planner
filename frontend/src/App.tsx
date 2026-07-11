import { useState, useRef, useEffect } from 'react';
import './index.css';
import { MealPlanDisplay } from './components/MealPlanDisplay';
import { PlannerResponse, ChatMessage } from './types';

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentPlan, setCurrentPlan] = useState<PlannerResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initial Form State
  const [dayPlan, setDayPlan] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [budget, setBudget] = useState('');

  // Chat State
  const [chatInput, setChatInput] = useState('');
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessagesToAgent = async (newMessages: ChatMessage[]) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/plan/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      
      if (!response.ok) {
        throw new Error(await response.text());
      }
      
      const data: PlannerResponse = await response.json();
      setCurrentPlan(data);
      setMessages([...newMessages, { role: 'assistant', content: JSON.stringify(data) }]);
    } catch (err: any) {
      setError(err.message || 'Failed to generate plan');
    } finally {
      setLoading(false);
    }
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dayPlan.trim()) return;
    
    const initialMessage = `My plan for the day: ${dayPlan}. Ingredients I have at home: ${ingredients}. My total budget is: $${budget}. Please create a meal plan.`;
    
    const newMessages: ChatMessage[] = [{ role: 'user', content: initialMessage }];
    setMessages(newMessages);
    sendMessagesToAgent(newMessages);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || loading) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: chatInput }];
    setChatInput('');
    setMessages(newMessages);
    sendMessagesToAgent(newMessages);
  };

  return (
    <div className="app-container">
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', margin: 0, color: 'var(--primary-color)' }}>ChefAI</h1>
        <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginTop: '0.5rem' }}>Your personal agentic meal planner</p>
      </header>

      {error && (
        <div style={{ background: '#ef4444', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      {messages.length === 0 ? (
        <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2>Let's plan your meals</h2>
          <form onSubmit={handleInitialSubmit}>
            <div className="input-group">
              <label htmlFor="dayPlan">What's your plan for the day?</label>
              <textarea 
                id="dayPlan"
                rows={3} 
                placeholder="e.g., Working from home, then going to the gym at 6pm..."
                value={dayPlan}
                onChange={(e) => setDayPlan(e.target.value)}
                required
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="ingredients">What ingredients do you already have?</label>
              <textarea 
                id="ingredients"
                rows={2} 
                placeholder="e.g., Rice, some chicken, eggs, onions..."
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="budget">Total Daily Budget ($)</label>
              <input 
                id="budget"
                type="number" 
                min="0"
                step="0.01"
                placeholder="e.g., 25"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%' }}>
              {loading ? <span className="loader"></span> : 'Generate Plan'}
            </button>
          </form>
        </div>
      ) : (
        <>
          {currentPlan && <MealPlanDisplay data={currentPlan} />}
          
          <div className="chat-container glass-panel">
            <h3>Refine your plan</h3>
            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`chat-message ${msg.role}`}>
                  {msg.role === 'user' ? msg.content : (
                    <span style={{ fontStyle: 'italic', color: '#cbd5e1' }}>Updated the meal plan successfully.</span>
                  )}
                </div>
              ))}
              {loading && (
                <div className="chat-message assistant">
                  <span className="loader"></span> Updating plan...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form className="chat-input" onSubmit={handleChatSubmit}>
              <input 
                type="text" 
                placeholder="e.g., I don't like eggs, can we change breakfast?"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={loading}
              />
              <button type="submit" disabled={loading || !chatInput.trim()}>
                Send
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
