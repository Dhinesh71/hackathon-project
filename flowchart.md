START
  |
User sends message
  |
Store message in Short-Term Memory (last 5 messages)
  |
Is message count = 5?
  |
  |-- YES --> Summarize important points
  |            |
  |            Save summary in Long-Term Memory (notes)
  |            |
  |            Clear old messages
  |
  |-- NO --> Skip summarizing
  |
Check user message:
Does user ask about past?
(words like: earlier / before / remember)
  |
  |-- YES --> Send:
  |           - Recent messages
  |           - Important notes (Long-Term Memory)
  |
  |-- NO --> Send:
              - Recent messages only
  |
AI generates response
  |
Show response to user
  |
END