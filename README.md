# Code Similarity Checker
A web application that compares two code snippets and measures how similar they are using token-based analysis. It supports multiple programming languages and provides a similarity score along with a plagiarism risk level.
## Live Demo
**Frontend:** https://plagiarism-detector-navy.vercel.app/
**Backend:** https://plagiarism-detector-h8dc.onrender.com/api/health
---

## Features
* Compare two code snippets instantly
* Supports Python, Java, C++, JavaScript and C
* Calculates similarity using the Jaccard Similarity algorithm
* Displays similarity percentage and plagiarism risk
* Responsive interface for desktop and mobile
* Separate frontend and backend deployment

---
## Tech Stack

### Frontend
* React
* Vite
* Tailwind CSS
* Axios

### Backend
* Flask
* Gunicorn
* Flask-CORS

### Deployment
* Vercel
* Render

---
## How It Works

The application removes comments from the submitted code and converts it into tokens such as keywords, identifiers, operators and symbols.
The similarity between both token sets is calculated using the Jaccard Similarity formula:

```
Similarity = (Common Tokens / Total Unique Tokens) × 100
```

Based on the result:
* **80% and above** – High similarity
* **50% to 79%** – Medium similarity
* **Below 50%** – Low similarity

---

## Project Structure

```
plagiarism-detector-project/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── app.py
├── requirements.txt
└── README.md
```

---

## Running the Project

### Clone the repository
```bash
git clone <repository-url>
cd plagiarism-detector-project
```

### Backend
```bash
python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt

python app.py
```
The backend runs on:
```
http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend runs on:
```
http://localhost:5173
```
---
## Environment Variables
Create a `.env` file inside the frontend folder.
```
VITE_API_URL=https://your-backend-url.onrender.com
```
---
## Future Improvements
* User authentication
* File upload support
* More programming languages
* Better similarity algorithm
* Comparison history
* Syntax highlighting
* Downloadable reports

---
## What I Learned
* Building REST APIs with Flask
* Working with React Hooks
* Integrating frontend and backend applications
* Making API requests using Axios
* Deploying applications on Vercel and Render
* Managing environment variables
* Handling CORS and production deployment

---
## Author
**Divanshu Sharma**
Computer Science & Engineering
GitHub: https://github.com/Typisch-Div
