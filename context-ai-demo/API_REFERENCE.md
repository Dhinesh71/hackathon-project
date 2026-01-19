# 📡 API Reference

Complete API documentation for the Context AI System backend.

---

## Base URL

**Development:**
```
http://localhost:3000
```

**Production:**
```
https://your-backend.vercel.app
```

---

## Endpoints

### 1. Health Check

Check if the backend server is running.

**Endpoint:** `GET /`

**Headers:** None

**Request:** None

**Response:**
```
Context AI Backend Online
```

**Status Codes:**
- `200 OK` - Server is running

**Example:**
```bash
curl http://localhost:3000/
```

---

### 2. Send Message

Send a message and receive an AI response with memory state.

**Endpoint:** `POST /chat`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "message": "string (required)",
  "sessionId": "string (required)"
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | string | Yes | The user's message to the AI |
| `sessionId` | string | Yes | Unique identifier for the conversation session |

**Response:**
```json
{
  "response": "string",
  "debug": {
    "stmCount": "number",
    "ltm": ["string"],
    "stmContent": [
      {
        "role": "string",
        "content": "string"
      }
    ]
  }
}
```

**Field Descriptions:**

| Field | Type | Description |
|-------|------|-------------|
| `response` | string | AI's response to the message |
| `debug.stmCount` | number | Current number of messages in Short-Term Memory |
| `debug.ltm` | array | Long-Term Memory summaries (bullet points) |
| `debug.stmContent` | array | Full Short-Term Memory messages |
| `debug.stmContent[].role` | string | Either "user" or "ai" |
| `debug.stmContent[].content` | string | The message content |

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Missing required fields
- `500 Internal Server Error` - Server or AI error

**Example Request:**
```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is artificial intelligence?",
    "sessionId": "demo-abc123"
  }'
```

**Example Response:**
```json
{
  "response": "Artificial intelligence (AI) is the simulation of human intelligence processes by machines, especially computer systems. It includes learning, reasoning, and self-correction.",
  "debug": {
    "stmCount": 2,
    "ltm": [],
    "stmContent": [
      {
        "role": "user",
        "content": "What is artificial intelligence?"
      },
      {
        "role": "ai",
        "content": "Artificial intelligence (AI) is the simulation of human intelligence processes by machines, especially computer systems. It includes learning, reasoning, and self-correction."
      }
    ]
  }
}
```

---

## Error Responses

### Missing Fields (400)

```json
{
  "error": "Missing message or sessionId"
}
```

### Internal Server Error (500)

```json
{
  "error": "Internal Server Error"
}
```

**Note:** Check backend console logs for detailed error messages.

---

## Memory System Behavior

### Short-Term Memory (STM)

- **Capacity:** 10 messages (5 user + 5 AI)
- **Behavior:** When full (10 messages), triggers summarization
- **Storage:** Database table `stm_messages`

### Long-Term Memory (LTM)

- **Capacity:** Unlimited
- **Behavior:** Stores summarized bullet points from STM
- **Retrieval:** Activated by recall keywords in user message
- **Storage:** Database table `ltm_memories`

### Recall Keywords

The following keywords in a user message will trigger LTM retrieval:

- "earlier"
- "before"
- "last time"
- "you said"
- "remember"
- "what did we discuss"

**Example:**
```json
{
  "message": "What did we discuss earlier about AI?",
  "sessionId": "demo-abc123"
}
```

This message will include LTM summaries in the AI's context.

---

## Usage Examples

### JavaScript (Fetch API)

```javascript
async function sendMessage(message, sessionId) {
  try {
    const response = await fetch('http://localhost:3000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message, sessionId })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Usage
const result = await sendMessage('Hello!', 'user-session-123');
console.log('AI Response:', result.response);
console.log('STM Count:', result.debug.stmCount);
```

### Python (Requests)

```python
import requests

def send_message(message, session_id):
    url = 'http://localhost:3000/chat'
    headers = {'Content-Type': 'application/json'}
    payload = {
        'message': message,
        'sessionId': session_id
    }
    
    response = requests.post(url, json=payload, headers=headers)
    
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Error: {response.status_code} - {response.text}")

# Usage
result = send_message('What is AI?', 'python-session-456')
print(f"AI Response: {result['response']}")
print(f"STM Count: {result['debug']['stmCount']}")
```

### cURL

```bash
# Send a message
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello AI!","sessionId":"curl-test-789"}'

# Trigger recall
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What did we discuss earlier?","sessionId":"curl-test-789"}'
```

---

## Rate Limiting

**Current:** No rate limiting implemented

**Recommendation for Production:**
- Implement per-session or per-IP rate limiting
- Suggested limit: 30 requests/minute per session
- Use middleware like `express-rate-limit`

---

## CORS Configuration

**Current Configuration:**
```javascript
app.use(cors());
```

**Production Recommendation:**
```javascript
app.use(cors({
  origin: 'https://your-frontend.vercel.app',
  methods: ['GET', 'POST'],
  credentials: true
}));
```

---

## Authentication

**Current:** No authentication

**Future Implementation:**
- Add JWT tokens or session-based auth
- Include `Authorization` header
- Add `/auth/login` and `/auth/register` endpoints

**Example with Auth:**
```javascript
fetch('http://localhost:3000/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: JSON.stringify({ message, sessionId })
});
```

---

## Environment Variables

The backend requires the following environment variables:

```bash
# Required
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional
PORT=3000
```

See [`ENV_SETUP.md`](./ENV_SETUP.md) for detailed configuration.

---

## Testing the API

### Manual Testing

1. **Start the backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Test health check:**
   ```bash
   curl http://localhost:3000/
   ```

3. **Send test message:**
   ```bash
   curl -X POST http://localhost:3000/chat \
     -H "Content-Type: application/json" \
     -d '{"message":"Test message","sessionId":"test-123"}'
   ```

### Automated Testing

Create a test script (`test-api.js`):

```javascript
async function testAPI() {
  const sessionId = 'test-' + Date.now();
  
  // Test 1: Simple message
  console.log('Test 1: Simple message');
  const res1 = await fetch('http://localhost:3000/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Hello!',
      sessionId
    })
  });
  const data1 = await res1.json();
  console.log('✅ Response:', data1.response);
  console.log('✅ STM Count:', data1.debug.stmCount);
  
  // Test 2: Multiple messages to trigger summarization
  console.log('\nTest 2: Trigger summarization');
  for (let i = 1; i <= 5; i++) {
    await fetch('http://localhost:3000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `Message ${i}`,
        sessionId
      })
    });
  }
  
  // Test 3: Recall
  console.log('\nTest 3: Recall keywords');
  const res3 = await fetch('http://localhost:3000/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'What did we discuss earlier?',
      sessionId
    })
  });
  const data3 = await res3.json();
  console.log('✅ LTM included:', data3.debug.ltm.length > 0);
  
  console.log('\n✅ All tests passed!');
}

testAPI().catch(console.error);
```

---

## Troubleshooting

### Issue: "Missing message or sessionId"

**Cause:** Required fields not provided

**Solution:**
```javascript
// ❌ Wrong
{ message: "test" }

// ✅ Correct
{ message: "test", sessionId: "session-123" }
```

### Issue: "Internal Server Error"

**Possible causes:**
1. Gemini API key invalid/revoked
2. Supabase connection failed
3. Database tables not created

**Solutions:**
1. Check backend console logs for detailed error
2. Verify environment variables in `.env`
3. Ensure Supabase tables exist (run `supabase_schema.sql`)

### Issue: CORS errors in browser

**Cause:** Frontend domain not allowed

**Solution:**
```javascript
// In server.js
app.use(cors({
  origin: 'http://localhost:5173'
}));
```

---

## Changelog

### Version 1.0 (Current)
- Initial API implementation
- `/chat` endpoint with memory management
- Debug information in responses
- Supabase integration

### Planned Features
- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `GET /sessions` - List user's sessions
- `GET /sessions/:id` - Get specific session
- `DELETE /sessions/:id` - Delete session
- `GET /sessions/:id/export` - Export conversation

---

**API Version:** 1.0  
**Last Updated:** January 2026  
**Author:** Dhinesh

Need help? See [`README.md`](./README.md) or open an issue on GitHub.
