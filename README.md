# EmotionAI 😌📱

A mobile-first mood tracking and emotional wellness app powered by AI. Built using **React Native (Expo)** for cross-platform mobile UX and **FastAPI** for backend services, EmotionAI helps users understand and reflect on their emotional trends — privately and anonymously.

---

## ✨ Features

- 📊 **Mood Tracking**: Log emotions daily through color-coded mood bubbles
- 🤖 **AI Reflections**: Generate personalized reflections using the Google Gemini API *(coming soon)*
- 🧠 **Anonymous Sessions**: Tracks mood trends per session using locally stored `session_id`
- 📈 **Emotion Insights**: Visualize emotional history over time with clean, intuitive UI
- 🗃️ **MongoDB Atlas** integration for storing mood entries and user metadata
- 🧬 Built-in support for journaling, demographic inputs, and adaptive AI feedback

---

## ⚙️ Tech Stack

| Frontend             | Backend           | Database       | AI/ML              |
|----------------------|-------------------|----------------|--------------------|
| React Native (Expo)  | FastAPI (Python)  | MongoDB Atlas  | Google Gemini API  |

---

## 🎥 Demo

[Watch a quick demo](https://www.youtube.com/shorts/7bOOyXLMkdc) showing EmotionAI in action.

---

## 🚀 Getting Started

### Prerequisites

- Node.js + Expo CLI
- Python 3.10+
- MongoDB Atlas Account
- `.env` file with the following keys:
  - `MONGO_URI`
  - `GEMINI_API_KEY`

### Installation

```bash
# 1. Frontend (Expo)
cd app
npm install
npx expo start

# 2. Backend (FastAPI)
cd ../api
pip install -r requirements.txt
uvicorn sentiment_api:app --reload
```

---

## 🔐 Example `.env` File (`api/.env.example`)

```bash
MONGO_URI=your_mongodb_connection_uri_here
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 📁 Repository Structure

```
EmotionAI/
├── api/                  # FastAPI backend
│   ├── sentiment_api.py
│   ├── requirements.txt
│   └── .env.example
├── app/                  # Expo frontend
│   ├── App.js
│   ├── screens/
│   ├── BASE_URL.js
│   └── package.json
├── .gitignore
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or create a pull request. Please ensure your code follows standard best practices and includes clear commit messages.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
