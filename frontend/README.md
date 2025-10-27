# 🌱 Agri-Architect: Your Climate-Resilient Farm Planner

Agri-Architect is a full-stack web application designed to empower smallholder farmers in Africa to combat climate change. It provides a personalized, data-driven plan to make their farms drought-proof, turning risky investments into confident decisions.

🔴 Live Application: <https://agri-architect.vercel.app/>
🔵 Live Backend: <https://agri-architect-backend.onrender.com/>

(Replace the imgur URL above with a real screenshot of your app's results page)

🎯 The Problem: The "Confidence Gap"
Smallholder farmers lose 20-50% of their harvests to climate shocks like drought. While solutions exist, farmers can't risk their limited savings on unproven methods. The biggest barrier isn't awareness; it's a lack of personalized, visual proof that a solution will work for their specific land.

Agri-Architect solves this by providing a data-driven simulation that proves the plan's value before the farmer spends a single dollar.

✨ Key Features (30+ Built)
Agri-Architect is more than a calculator; it's a complete resilience toolkit.

Core Planning Tools
Smart Soil Calculator: Calculates precise biochar & hydrogel amounts.
Cost Estimator: Shows investment in 5 local currencies (USD, ZAR, NGN, GHS, KES).
Predictive Simulation: A visual 20-day graph proving soil will stay wet 3-5x longer.
ROI/Payback Calculator: Shows how many harvests until the investment pays for itself.
Watering Schedule: Generates a calendar with exact watering dates (.ics export).
Pest Advisor: Natural, crop-specific pest control strategies.
Accessibility & Sharing
PDF Export: Download a complete plan for offline use or WhatsApp sharing.
Shareable Links: Generate a unique URL to share a plan with anyone.
Multi-Language: Fully functional in English and French.
Unit Conversion: Supports m², hectares, and acres.
Responsive Design: Works on both desktop and mobile devices.
User Experience
Dynamic Sticky Navbar: For easy navigation between results.
Animated Loading Skeletons: A professional, smooth user experience.
Friendly Error Handling: Clear messages with a "Retry" option.
Setting Persistence: Remembers user's language, unit, and currency choices.
🚀 Tech Stack & Architecture
The platform is built with a modern, scalable, full-stack architecture.

Frontend: React.js (with Vite), deployed on Vercel.
Backend: Node.js with Express.js, deployed on Render.
Data Visualization: Chart.js
PDF Generation: html2canvas + jsPDF
Version Control: Git & GitHub
System Architecture
text

[User] --> [React Frontend (Vercel)] <--> [REST API (Node.js/Express on Render)]
🛠️ How to Run Locally
Prerequisites
Node.js (v20.x or later)
Git

1. Clone the Repository
Bash

git clone <https://github.com/Wessypeace/Agri-Architect.git>
cd Agri-Architect
2. Run the Backend
Bash

# In a new terminal

cd backend
npm install
node server.js

# The backend will be running on <http://localhost:5000>

3.Run the Frontend
Bash

# In a second terminal

cd frontend
npm install
npm run dev

# The app will be running on <http://localhost:5173>

🏆 FNB App of the Year Hackathon 2025 Submission
This project was built solo by [Your Name] to address the challenge of creating innovative platforms to prepare for and respond to climate-related disasters while strengthening food systems.
