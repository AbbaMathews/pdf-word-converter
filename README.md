# PDF to Word, Word to PDF Converter

A file conversion tool counting words and characters, displaying content, and exporting to different formats.

---

## Features

- Upload documents (PDF, DOCX, TXT)
- Display file content in the browser
- Count words and characters
- Convert between formats (PDF ↔ DOCX, DOCX ↔ PDF)
- Export processed files

---

## Technologies Used

- **Frontend**: React with Tailwind CSS
- **Backend**: Python Flask
- **Libraries**:
  - `python-docx` for Word document handling
  - `pdfplumber` or `PyPDF2` for PDF parsing
  - `docx2pdf` for Word to PDF conversion

---

## Folder Structure

```bash
pdf-word-converter/
├── frontend/ # React + Tailwind app
├── backend/ # Flask API
├── README.md
└── .gitignore
```

---

## Getting Started

### Prerequisites

- Node.js and npm
- Python 3.x and pip
- Docker

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
The frontend will run by default on ```http://localhost:5173```.

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Use 'venv\Scripts\activate' on Windows
pip install -r requirements.txt
python app.py
```
The frontend will run by default on ```http://localhost:5000```.

### Docker Setup

```bash
docker compose up --build
```

---

## Git Workflow

We follow a structured branching strategy to keep the codebase organized and collaborative.

### Branches

- **main** – Production-ready code. Only stable, fully tested versions are merged here.
- **dev** – Development integration branch. All features are merged here after review and testing.
- **feature/your-feature-name** – Individual feature or task branches created from `dev`.

### Workflow Steps

1. Pull the latest changes from `dev`:
   ```bash
   git checkout dev
   git pull origin dev
   ```
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make changes and commit:
   ```bash
   git add .
   git commit -m "Your descriptive message"
   ```
4. Push your branch to GitHub:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request (PR) from your branch into ```dev```, not ```main```.
6. After review, the feature branch is merged into ```dev```. Later, a tested version of ```dev``` is merged into ```main```.

### Example Branch Names

- ```feature/frontend-setup```

- ```feature/backend-file-parser```

- ```feature/devops-docker-setup```

- ```feature/pdf-to-word```

- ```feature/text-analysis-module```
