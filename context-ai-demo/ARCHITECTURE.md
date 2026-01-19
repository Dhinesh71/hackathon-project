# 🏗️ Technical Architecture

## System Design Overview

This document provides an in-depth technical explanation of the Context AI System's architecture, design decisions, and implementation details.

---

## Table of Contents

1. [Architecture Diagram](#architecture-diagram)
2. [Component Breakdown](#component-breakdown)
3. [Memory Management System](#memory-management-system)
4. [Database Schema](#database-schema)
5. [API Flow](#api-flow)
6. [Design Decisions](#design-decisions)
7. [Performance Considerations](#performance-considerations)
8. [Scalability](#scalability)

---

## Architecture Diagram

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  React Frontend (Vite)                                 │ │
│  │  - ChatInterface.jsx    - DebugPanel.jsx               │ │
│  │  - Session Management   - Real-time UI Updates         │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/REST
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                       API LAYER                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Express.js Server                                     │ │
│  │  - /chat endpoint      - Session handling              │ │
│  │  - Error handling      - CORS configuration            │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   BUSINESS LOGIC LAYER                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Context Manager                                       │ │
│  │  - Message routing      - Recall detection             │ │
│  │  - Prompt construction  - Summarization trigger        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Memory Store                                          │ │
│  │  - Session CRUD         - STM operations               │ │
│  │  - LTM operations       - Message persistence          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Summarizer                                            │ │
│  │  - Conversation analysis  - Bullet extraction          │ │
│  │  - Prompt engineering     - Quality filtering          │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────┬────────────────────┬─────────────────────┘
                   │                    │
                   ▼                    ▼
┌──────────────────────────┐  ┌────────────────────────────┐
│   EXTERNAL SERVICES      │  │   DATA LAYER               │
│                          │  │                            │
│  ┌────────────────────┐ │  │  ┌──────────────────────┐ │
│  │  Gemini AI 2.5     │ │  │  │  Supabase/PostgreSQL │ │
│  │  - Chat responses  │ │  │  │  - sessions          │ │
│  │  - Summarization   │ │  │  │  - stm_messages      │ │
│  └────────────────────┘ │  │  │  - ltm_memories      │ │
└──────────────────────────┘  │  └──────────────────────┘ │
                              └────────────────────────────┘
```

---

## Component Breakdown

### Frontend Components

#### 1. **App.jsx**
**Responsibility:** Root application component

```javascript
- State Management:
  • messages (array) - Chat history for UI
  • stmCount (number) - Current STM size
  • ltm (array) - Long-term memories
  • loading (boolean) - Request state

- Functions:
  • handleSendMessage() - API communication
  • Session ID generation
  • Error handling
```

#### 2. **ChatInterface.jsx**
**Responsibility:** Main chat UI

```javascript
- Features:
  • Message display (user/AI bubbles)
  • Input field with submit
  • Auto-scroll to bottom
  • Loading indicator
  • Empty state

- Styling:
  • Glassmorphism effects
  • Neon gradient text
  • Responsive layout
```

#### 3. **DebugPanel.jsx**
**Responsibility:** Memory state visualization

```javascript
- Real-time displays:
  • STM count with progress bar
  • LTM bullet list
  • Architecture stats
  • Visual indicators

- Design:
  • Neon color coding
  • Animated progress bars
  • Scrollable memory list
```

---

### Backend Components

#### 1. **server.js**
**Responsibility:** Express application entry point

```javascript
Endpoints:
  POST /chat
  - Accepts: { message, sessionId }
  - Returns: { response, debug }

  GET /
  - Health check

Middleware:
  - cors()
  - express.json()
  - Error handlers
```

#### 2. **contextManager.js**
**Responsibility:** Core conversation logic

```javascript
Flow:
1. Load session from database
2. Save user message to STM
3. Detect recall keywords
4. Build AI prompt with context
5. Get AI response
6. Save AI message to STM
7. Check summarization trigger
8. Return response + debug data

Key Functions:
  - handleMessage(sessionId, text)
  - shouldTriggerRecall(message)
```

#### 3. **memoryStore.js**
**Responsibility:** Database operations

```javascript
Functions:
  - getSession(id) - Load/create session
  - saveToSTM(id, role, content) - Add message
  - saveToLTM(id, memories[]) - Store summaries
  - clearSTM(id) - Empty STM after summarization
  - updateMessageCount(id, count) - Track messages

All operations are async (Promises)
```

#### 4. **summarizer.js**
**Responsibility:** Conversation summarization

```javascript
Process:
1. Format conversation for AI
2. Use Gemini to extract key points
3. Parse bullet points
4. Filter out meta-text
5. Return clean array of facts

Prompt Engineering:
  - Specific instructions
  - Focus on facts/decisions
  - Ignore small talk
```

#### 5. **geminiClient.js**
**Responsibility:** AI model connection

```javascript
Configuration:
  - Model: gemini-2.5-flash
  - API key from env
  - Exported singleton instance
```

#### 6. **supabaseClient.js**
**Responsibility:** Database connection

```javascript
Configuration:
  - Project URL from env
  - Anon key from env
  - Exported singleton instance
```

---

## Memory Management System

### Three-Layer Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     USER MESSAGE                          │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   SHORT-TERM MEMORY   │
         │   (Recent Context)    │
         │                       │
         │  Capacity: 10 msgs    │
         │  Lifespan: Until full │
         │  Storage: Database    │
         └───────────┬───────────┘
                     │
                     │ Trigger: >= 10 messages
                     ▼
         ┌───────────────────────┐
         │    SUMMARIZATION      │
         │   (Gemini AI)         │
         │                       │
         │  Extract key facts    │
         │  Ignore redundancy    │
         │  Bullet point format  │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  LONG-TERM MEMORY     │
         │  (Persistent Facts)   │
         │                       │
         │  Capacity: Unlimited  │
         │  Lifespan: Forever    │
         │  Storage: Database    │
         └───────────────────────┘
                     │
                     │ Trigger: Recall keywords
                     ▼
         ┌───────────────────────┐
         │   CONTEXT INJECTION   │
         │   (AI Prompt)         │
         └───────────────────────┘
```

### Recall System

**Keywords that trigger LTM retrieval:**
- "earlier"
- "before"
- "last time"
- "you said"
- "remember"
- "what did we discuss"

**Implementation:**
```javascript
const shouldTriggerRecall = (message) => {
    const lower = message.toLowerCase();
    return RECALL_KEYWORDS.some(keyword => lower.includes(keyword));
};
```

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────────────┐
│     sessions        │
├─────────────────────┤
│ id (PK, TEXT)       │
│ created_at          │
│ updated_at          │
│ message_count       │
└──────────┬──────────┘
           │
           │ 1:N
           ├──────────────────────────┐
           │                          │
           ▼                          ▼
┌─────────────────────┐    ┌─────────────────────┐
│   stm_messages      │    │   ltm_memories      │
├─────────────────────┤    ├─────────────────────┤
│ id (PK, BIGSERIAL)  │    │ id (PK, BIGSERIAL)  │
│ session_id (FK)     │    │ session_id (FK)     │
│ role (TEXT)         │    │ memory_text (TEXT)  │
│ content (TEXT)      │    │ created_at          │
│ created_at          │    └─────────────────────┘
└─────────────────────┘
```

### Table Details

#### `sessions`
```sql
Purpose: Track conversation sessions
Columns:
  - id: Unique session identifier
  - created_at: Session creation timestamp
  - updated_at: Last activity timestamp
  - message_count: Total messages in session
Indexes: Primary key (id)
```

#### `stm_messages`
```sql
Purpose: Store recent messages (Short-Term Memory)
Columns:
  - id: Auto-incrementing message ID
  - session_id: Foreign key to sessions
  - role: 'user' or 'ai'
  - content: Message text
  - created_at: Message timestamp
Indexes:
  - Primary key (id)
  - session_id (foreign key + index)
  - created_at (for ordering)
Constraints:
  - role CHECK (role IN ('user', 'ai'))
  - CASCADE DELETE on session deletion
```

#### `ltm_memories`
```sql
Purpose: Store summarized facts (Long-Term Memory)
Columns:
  - id: Auto-incrementing memory ID
  - session_id: Foreign key to sessions
  - memory_text: Summarized bullet point
  - created_at: Memory timestamp
Indexes:
  - Primary key (id)
  - session_id (foreign key + index)
Constraints:
  - CASCADE DELETE on session deletion
```

---

## API Flow

### Complete Request-Response Cycle

```
1. User sends message
   │
   ▼
2. Frontend: POST /chat
   {
     message: "What is AI?",
     sessionId: "demo-abc123"
   }
   │
   ▼
3. Backend: contextManager.handleMessage()
   │
   ├──> Supabase: Load session
   │
   ├──> Supabase: Save user message to STM
   │
   ├──> Check recall keywords
   │
   ├──> Build prompt:
   │    - User message
   │    - Recent messages (STM)
   │    - LTM (if recall triggered)
   │
   ├──> Gemini AI: generateContent()
   │
   ├──> Supabase: Save AI response to STM
   │
   ├──> Check: STM.length >= 10?
   │    │
   │    YES──> Summarize (Gemini AI)
   │         │
   │         ├──> Supabase: Save to LTM
   │         │
   │         └──> Supabase: Clear STM
   │
   └──> Return:
        {
          response: "AI is...",
          debug: {
            stmCount: 2,
            ltm: [...],
            stmContent: [...]
          }
        }
   │
   ▼
4. Frontend: Update UI
   - Add messages to chat
   - Update debug panel
```

---

## Design Decisions

### 1. **Why Gemini 2.5 Flash?**
- **Speed:** Faster than Pro models
- **Cost:** Lower token costs
- **Context:** 1M token window (plenty for our use case)
- **Quality:** Sufficient for chat + summarization

### 2. **Why Supabase?**
- **PostgreSQL:** Robust relational database
- **Real-time:** Future potential for live updates
- **Auth:** Built-in authentication (future)
- **Serverless:** Auto-scaling, no server management
- **Free Tier:** Generous limits for development

### 3. **Why 10-Message Threshold?**
- **Balance:** Not too frequent, not too rare
- **Context:** ~5 exchanges provide enough context
- **Cost:** Limits AI calls for summarization
- **UX:** User sees summarization in action

### 4. **Why Keyword-Based Recall?**
- **Simplicity:** Easy to implement
- **Accuracy:** Users naturally use these phrases
- **Performance:** No vector search overhead
- **Cost:** No embedding API calls

**Future:** Could upgrade to semantic similarity search

### 5. **Why Separate STM/LTM Tables?**
- **Query Performance:** Efficient STM clearing
- **Data Lifecycle:** Different retention policies
- **Indexing:** Optimized for different access patterns
- **Scalability:** Independent table growth

---

## Performance Considerations

### Optimization Strategies

1. **Database Queries**
   - Indexed foreign keys
   - Batch operations where possible
   - Limit result sets
   - Use `.single()` for known single results

2. **AI API Calls**
   - Only call when necessary
   - Use Flash model (faster)
   - Optimize prompt length
   - Handle errors gracefully

3. **Frontend Rendering**
   - React virtual DOM optimization
   - Minimize re-renders
   - Lazy load components (future)
   - Efficient state updates

4. **Network**
   - CORS properly configured
   - Minimal payload size
   - Error handling with retries

### Bottlenecks to Watch

| Component | Potential Issue | Mitigation |
|-----------|----------------|------------|
| Gemini API | Rate limits | Implement queue/retry |
| Supabase | Connection limits | Connection pooling |
| Session state | Memory leaks | Proper cleanup |
| Large LTM | Slow retrieval | Pagination/limits |

---

## Scalability

### Current Limitations

- **Single-user:** No authentication yet
- **No caching:** Every request hits DB
- **Synchronous:** No background jobs
- **No CDN:** Frontend served directly

### Scaling Path

#### Phase 1: Multi-User (100s)
```
- Add authentication (Supabase Auth)
- Add user_id to sessions table
- Row-level security policies
- Rate limiting per user
```

#### Phase 2: Optimization (1,000s)
```
- Redis caching for active sessions
- Background job queue (BullMQ)
- Async summarization
- CDN for frontend assets
```

#### Phase 3: Horizontal Scaling (10,000s+)
```
- Load balancer (Vercel Edge)
- Read replicas for Supabase
- Sharding by user_id
- Microservices architecture
```

### Database Growth

**Estimates:**
- Average session: 100 messages
- Average message: 200 bytes
- 1,000 users × 10 sessions = 10,000 sessions
- 10,000 × 100 messages = 1M messages
- 1M × 200 bytes = **200 MB**

**Supabase Free Tier:** 500 MB database  
**Conclusion:** Can support ~2,500 active users on free tier

---

## Error Handling

### Strategies

1. **Graceful Degradation**
   ```javascript
   // If AI fails, return friendly error
   aiResponseText = "Sorry, I encountered an error...";
   ```

2. **Database Fallbacks**
   ```javascript
   // If DB fails, log error but don't crash
   console.error('DB Error:', error);
   throw error; // Let Express handle
   ```

3. **Retry Logic** (future)
   ```javascript
   // Exponential backoff for transient errors
   ```

4. **User Feedback**
   - Clear error messages
   - Debug panel for developers
   - Console logs for troubleshooting

---

## Security Considerations

### Current Implementation

✅ **Environment Variables:** All secrets in `.env`  
✅ **CORS:** Configured for specific origins  
✅ **Input Validation:** Basic checks on message/sessionId  
✅ **Git Security:** `.gitignore` prevents secret commits

### Recommendations for Production

- [ ] **Authentication:** Add JWT or session-based auth
- [ ] **Rate Limiting:** Prevent API abuse
- [ ] **Input Sanitization:** Prevent XSS/injection
- [ ] **Row-Level Security:** Supabase RLS policies
- [ ] **API Key Rotation:** Regular Gemini key updates
- [ ] **HTTPS Only:** Enforce secure connections
- [ ] **CSP Headers:** Content Security Policy

---

## Monitoring & Observability

### Current Logging

```javascript
console.log('[Context] Recall triggered...')
console.log('[Context] Summarization triggered...')
console.error('Gemini Error', e)
```

### Future Enhancements

- **Application Monitoring:** Sentry, LogRocket
- **Performance Metrics:** Response times, AI latency
- **Database Metrics:** Query performance, connection pool
- **User Analytics:** Session duration, message count
- **Error Tracking:** Fail rates, error categories

---

## Testing Strategy

### Current State
- Manual testing via UI
- Database verification via Supabase dashboard
- API testing via backend console

### Recommended Additions

```
Unit Tests:
  - memoryStore functions
  - contextManager logic
  - summarizer parsing

Integration Tests:
  - /chat endpoint
  - Database operations
  - AI API calls (mocked)

E2E Tests:
  - Full conversation flow
  - Recall functionality
  - Summarization trigger
```

---

## Conclusion

This architecture prioritizes:
1. **Simplicity** - Easy to understand and maintain
2. **Reliability** - Persistent storage, error handling
3. **Extensibility** - Easy to add features
4. **Performance** - Optimized for common use cases

**Trade-offs:**
- Keyword-based recall vs semantic search
- Synchronous processing vs background jobs
- Simple auth vs complex permissions

These decisions align with the hackathon timeframe while maintaining production-ready foundations.

---

**Document Version:** 1.0  
**Last Updated:** January 2026  
**Author:** Dhinesh
