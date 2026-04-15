import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 3000;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

// Security and CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:8081', 'http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json({ limit: '5kb' }));

// Rate limiter
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,     // 1 minute
  max: 5,                      // 5 requests per minute per IP
  message: { error: 'Слишком много обращений подряд, пожалуйста, подождите минуту.' }
});

app.use('/api/chat', limiter);

const SYSTEM_PROMPT = `Ты роль: IT-специалист компании AzurSysTech из Ниццы (Франция). 
Твоя задача помочь пользователю сформулировать его проблему перед тем, как он отправит заявку. Будь кратким, доброжелательным и компетентным.

ПРИНЦИПЫ ОТВЕТА:
1. Кратко, 1-2 предложения, максимум 3.
2. Не обещай точных цен, сроков, выезда или начала работ. Если нужно, говори, что после заявки мы посмотрим описание и уточним детали вручную.
3. В конце предлагай перейти к форме на сайте или написать в WhatsApp, чтобы передать контакты и описание задачи.
4. Отвечай только на русском языке.`;

app.post('/api/chat', async (req, res) => {
  try {
    // Safety: reject unknown fields
    const keys = Object.keys(req.body);
    if (keys.length > 1 || keys[0] !== 'message') {
      return res.status(400).json({ error: 'Bad Request: invalid payload' });
    }

    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!DEEPSEEK_API_KEY) {
      console.error('DEEPSEEK_API_KEY is missing');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const payload = {
      model: "deepseek-chat",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message }
      ],
      max_tokens: 200,
      temperature: 0.3
    };

    // Timeout control
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 15000); // 15 seconds

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      if (response.status === 402) {
        return res.json({ reply: 'Извините, сервис временно недоступен. Пожалуйста, отправьте заявку через форму на сайте или напишите в WhatsApp.' });
      }
      // Log status code only, avoiding leaky full error body
      console.error('DeepSeek API error. Status:', response.status);
      return res.status(500).json({ error: 'Failed to communicate with AI provider' });
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || 'К сожалению, не удалось получить ответ.';

    res.json({ reply });
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('DeepSeek API timed out (AbortError)');
      return res.status(504).json({ error: 'AI request timeout' });
    }
    console.error('Chat endpoint error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Healthcheck
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Chat service running on port ${PORT}`);
});
