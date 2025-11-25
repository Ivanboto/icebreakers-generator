# LinkedIn Icebreakers Generator

A fullstack application that generates personalized **cold messages** (icebreakers) for LinkedIn connections. The app creates natural, human-like opening messages tailored to your writing style and aligned with the recipient's profile.

## 🚀 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd icebreakers-generator
```

### 2. Install dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd backend
npm install
```

### 3. Configure environment variables

**Backend** (`backend/.env`):
```env
PORT=3000
OPENAI_API_KEY=your_openai_api_key_here
RAPIDAPI_API_KEY=your_rapidapi_key_here
```

**Frontend** (`frontend/.env`):
```env
VITE_API_BASE_URL=http://localhost:3000
```

## ▶️ Running the Application

### Docker

This is the easiest way to run the application. Docker will handle all dependencies and configuration.

```bash
# From the root directory
docker compose up
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

To stop execution, press `CTRL + C` in the terminal.

To stop the application:
```bash
docker compose down
```

## 📖 How to Use

1. **Enter Your LinkedIn Profile URL**: Your profile helps the AI understand your writing style
2. **Describe the Problem You Solve**: What challenge do you help others overcome?
3. **Describe Your Solution**: What product, service, or expertise do you offer?
4. **Enter Recipient's LinkedIn Profile URL**: The person you want to reach out to
5. **Generate**: Click the button and wait for AI to create 3 personalized icebreakers
6. **Copy & Use**: Click the copy icon to save any message to your clipboard

## 🔑 API Endpoints

### `POST /icebreakers/generate`

Generate personalized icebreakers.

**Request Body:**
```json
{
  "senderUrl": "https://linkedin.com/in/your-profile",
  "problemDescription": "Help B2B SaaS companies reduce churn",
  "solutionDescription": "AI-powered customer analytics platform",
  "recipientUrl": "https://linkedin.com/in/recipient-profile"
}
```

**Response:**
```json
{
  "icebreakers": [
    "Message 1...",
    "Message 2...",
    "Message 3..."
  ],
  "metadata": {
    "senderUrl": "...",
    "recipientUrl": "...",
    "timestamp": "2025-11-25T10:30:00.000Z"
  }
}
```
