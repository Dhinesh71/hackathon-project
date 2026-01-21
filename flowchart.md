START
  |
User sends message
  |
Store User message in Short-Term Memory (STM) database
  |
Load Context Sources:
  1. Global Long-Term Memory (Summaries from other sessions)
  2. Global Recent Activity (Last 10 messages from other sessions)
  3. Current Session Long-Term Memory
  4. Current Session Short-Term Memory
  |
Build System Prompt (Inject ALL loaded context)
  |
AI generates response (Groq - Llama 3.3 70B)
  |
Store AI response in Short-Term Memory (STM) database
  |
Show response to user
  |
Check Short-Term Memory size:
Is STM count >= 10 messages? (5 exchanges)
  |
  |-- YES --> Summarize STM contents (extract facts/decisions)
  |            |
  |            Save summary to Long-Term Memory (LTM) database
  |            |
  |            Clear Short-Term Memory (STM) database
  |
  |-- NO --> Continue
  |
END