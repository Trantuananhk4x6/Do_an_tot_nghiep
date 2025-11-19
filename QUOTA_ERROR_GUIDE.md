# ⚠️ Google Gemini API Quota Error - Hướng Dẫn Xử Lý

## 🔴 Lỗi Hiện Tại

```
[GoogleGenerativeAI Error]: Error 429
You exceeded your current quota
```

**Đây KHÔNG phải lỗi code**, mà là **giới hạn API** từ Google Gemini.

---

## 📊 Giới Hạn Free Tier

Google Gemini Free Tier có các giới hạn:

| Loại | Giới Hạn | Reset |
|------|----------|-------|
| **Requests per Minute** | 15 requests | Mỗi phút |
| **Requests per Day** | 1,500 requests | 00:00 UTC mỗi ngày |
| **Tokens per Minute** | 32,000 tokens | Mỗi phút |

---

## ✅ App Đã Xử Lý Tốt

### 1. Rate Limiter
- ✅ Giới hạn 10 requests/minute (an toàn hơn limit 15)
- ✅ Auto-block 30 phút khi exceed
- ✅ Countdown timer hiển thị cho user

### 2. Fallback Mode
- ✅ Khi AI fail → dùng basic parser
- ✅ Vẫn extract được CV data cơ bản
- ✅ App vẫn hoạt động bình thường

### 3. User Experience
- ✅ Quota banner hiển thị ở top
- ✅ Clear error messages
- ✅ Progress indicators
- ✅ Retry options

---

## 🚀 Giải Pháp

### Option 1: Đợi Quota Reset ⏰ (Khuyến Nghị)

**Nếu lỗi rate limit (per minute):**
```
✅ Đợi 1-2 phút
✅ App sẽ tự động unblock
✅ Có thể retry
```

**Nếu lỗi daily quota:**
```
✅ Đợi đến 00:00 UTC (7:00 sáng VN)
✅ Quota sẽ reset
✅ Hoặc dùng fallback mode
```

### Option 2: Tạo API Key Mới 🔑

**Bước 1:** Vào Google AI Studio
```
https://aistudio.google.com/app/apikey
```

**Bước 2:** Create New API Key
```
1. Click "Create API Key"
2. Select "New project" hoặc chọn project có sẵn
3. Copy API key mới
```

**Bước 3:** Update `.env.local`
```bash
# Backup key cũ (comment out)
# GEMINI_API_KEY=AIzaSyBcfe5P0-lRtP5Pajbsp3srLSnHvqOLirA

# Add key mới
GEMINI_API_KEY=YOUR_NEW_API_KEY_HERE
GOOGLE_GENERATIVE_AI_API_KEY=YOUR_NEW_API_KEY_HERE
NEXT_PUBLIC_GEMINI_API_KEY=YOUR_NEW_API_KEY_HERE
```

**Bước 4:** Restart dev server
```bash
# Stop server (Ctrl+C)
npm run dev
```

### Option 3: Upgrade to Paid Tier 💳

**Google AI Studio Paid Plan:**
- ✅ Higher rate limits
- ✅ More daily quota
- ✅ Priority support
- ✅ No daily reset needed

**Pricing:** Check https://ai.google.dev/pricing

### Option 4: Multiple API Keys Rotation 🔄

**Cách làm:**
1. Tạo nhiều API keys (từ nhiều Google accounts)
2. Store trong array
3. Rotate khi hit limit

**Implementation:** (Advanced)
```typescript
// services/ai/gemini.client.ts
const API_KEYS = [
  'KEY_1',
  'KEY_2',
  'KEY_3'
];
let currentKeyIndex = 0;

function getNextKey() {
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return API_KEYS[currentKeyIndex];
}
```

---

## 🧪 Test Sau Khi Fix

### 1. Test Rate Limiter
```bash
# Upload CV nhiều lần liên tục
# Kỳ vọng: Sau 10 requests → block 30 min
```

### 2. Test Fallback
```bash
# Khi AI fail → app vẫn parse CV cơ bản
# Kỳ vọng: Có data + warning message
```

### 3. Test Quota Banner
```bash
# Khi blocked → banner xuất hiện top page
# Kỳ vọng: Countdown timer + clear message
```

---

## 📱 Message Cho User

### Khi Rate Limit:
```
⚠️ AI Service Temporarily Busy

We've hit our rate limit. Please wait 1-2 minutes.

✅ Your data is safe
✅ App still works in basic mode
✅ Try again shortly
```

### Khi Daily Quota:
```
🔴 Daily API Quota Exceeded

Our free tier has reached its daily limit.

Options:
1. ✏️ Use "Start from Blank" to create CV manually
2. ⏰ Try again tomorrow (quota resets at 7am VN time)
3. 📝 Basic parsing still works (no AI suggestions)
```

---

## 🎯 Best Practices

### Development:
```bash
# 1. Giới hạn test calls
# 2. Dùng mock data khi test UI
# 3. Cache AI responses khi possible
# 4. Test fallback mode thường xuyên
```

### Production:
```bash
# 1. Monitor API usage daily
# 2. Set up alerts for 80% quota
# 3. Have multiple API keys ready
# 4. Consider paid tier if traffic cao
```

---

## 🔧 Debug Commands

### Check Current Quota Status:
```typescript
// In browser console
fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro', {
  headers: {
    'x-goog-api-key': 'YOUR_API_KEY'
  }
})
```

### Check Rate Limiter Status:
```typescript
// In browser console
rateLimiter.getStatus()
// Returns: { isBlocked, remainingSeconds, requestsInWindow, maxRequests }
```

### Manual Reset Rate Limiter:
```typescript
// In browser console
rateLimiter.reset()
```

---

## 📞 Support

Nếu vẫn gặp vấn đề:
1. Check console logs
2. Verify API key valid
3. Check network tab (429 errors)
4. Test với API key mới

---

**Tóm lại:** App hoạt động tốt, chỉ cần đợi quota reset hoặc dùng API key mới! 🚀
