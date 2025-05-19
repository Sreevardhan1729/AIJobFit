# AIJobFit

# 💼 JobMatch – Smart Resume & Job Description Analyzer

**JobMatch** is an AI-powered web application designed to help job seekers analyze how well their resume aligns with a job description. It extracts relevant skills from both documents, compares them, and highlights which skills match and which are missing. This enables users to tailor their resumes more effectively and apply to roles with higher confidence.

---

## 🚀 Features

- 📝 **Job Requirements Extractor**  
  Paste any job description and get a list of key skills, qualifications, and keywords extracted using NLP.

- 📄 **Resume vs JD Comparison**  
  Upload your resume (PDF) and paste the job description to:
  - ✅ View skills you already have
  - ❌ Identify missing skills to improve your resume

- 🔍 **Job Suggestions Based on Resume (Coming Soon)**  
  Automatically recommend jobs that fit your resume’s skillset.

---

## 🛠️ Tech Stack

| Frontend         | Backend         | ML & Utilities             |
|------------------|------------------|-----------------------------|
| React.js         | Flask (Python)   | scikit-learn, spaCy, PDFMiner |
| Tailwind CSS     | REST API         | Natural Language Processing |

---

## 📦 Installation

### 🔹 1. Clone the Repository

```bash
git clone https://github.com/yourusername/jobmatch.git
cd jobmatch
```


# Resume Skill Matcher 🚀

An AI-powered web app that helps job seekers match their resumes with job descriptions to improve compatibility and get better job opportunities.

---

## 🔧 Backend Setup (Flask + Python)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

## 🌐 Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to use the application.

---

## 💡 How It Works

1. User uploads a resume and pastes a job description.
2. The NLP pipeline extracts relevant skills from both documents.
3. A comparison engine classifies skills into:
   - ✅ Skills in common
   - ❌ Skills to add
4. (Coming Soon) A feature to recommend job roles based on resume skills.

---

## 📸 Screenshots



---

## 🙌 Acknowledgements

Built using open-source libraries:
- [spaCy](https://spacy.io/)
- [PDFMiner](https://pdfminersix.readthedocs.io/)
- [scikit-learn](https://scikit-learn.org/)

Inspired by the real-world challenge of tailoring resumes for different job descriptions.

Created as a full-stack personal project integrating React, Flask, and NLP.

---

## 👨‍💻 Author

**Your Name**  
[GitHub]([https://github.com/your-profile](https://github.com/Sreevardhan1729)) • [LinkedIn]([https://linkedin.com/in/your-profile](https://www.linkedin.com/in/sreevardhanreddy/))

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
