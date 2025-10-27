# 🤖 AI ChatBot using Groq API

An advanced AI Chatbot built with **React (Frontend)** and **Python (Backend)** powered by the **Groq API**.  
It delivers real-time intelligent responses with a sleek UI and modular architecture for easy scalability.

---

## 🚀 Features
- Smart and fast responses using **Groq API**
- **React frontend** for smooth UI and interaction
- **Python backend** for efficient API handling
- Clean and modular folder structure
- Fully customizable for future AI use cases

---

## 🧰 Tech Stack
**Frontend:** React  
**Backend:** Python (FastAPI or Flask)  
**AI Engine:** Groq API  
**Version Control:** Git & GitHub  

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Mrganga05/AI-ChatBot.git
cd AI-ChatBot
2️⃣ Setup the Backend (Python)
Navigate to the backend folder:

bash
Copy code
cd backend
Create a virtual environment and activate it:

bash
Copy code
python -m venv venv
venv\Scripts\activate   # On Windows
Install dependencies:

bash
Copy code
pip install -r requirements.txt
Add your Groq API key in .env file:

ini
Copy code
GROQ_API_KEY=your_api_key_here
Run the backend:

bash
Copy code
python app.py
The backend will run on http://localhost:5000

3️⃣ Setup the Frontend (React)
Navigate to the frontend folder:

bash
Copy code
cd frontend
Install dependencies:

bash
Copy code
npm install
Start the React app:

bash
Copy code
npm start
The frontend will run on http://localhost:3000

🔗 Connecting Frontend and Backend
The React frontend makes requests to the Python backend API.

Ensure the backend URL (e.g., http://localhost:5000) is set correctly in your frontend .env or API file.

🧠 Future Improvements
Add user authentication

Save chat history

Add voice input/output

Deploy on cloud platforms (e.g., Render, Vercel, or AWS)

🏁 Author
Anupoju Ganga
💻 GitHub: Mrganga05
