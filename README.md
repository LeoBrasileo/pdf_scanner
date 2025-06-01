# PDF Text Extractor
A simple service and web to convert any pdf to text.

## Video Demo
[![video](https://img.youtube.com/vi/F8zwCKWGeJQ/maxresdefault.jpg)](https://www.youtube.com/watch?v=F8zwCKWGeJQ)

## Installation

Make sure you have the following packages installed:

```bash
# Required:
python3
node
tesseract
```

On Debian you can install Tesseract with:

```bash
sudo apt install tesseract-ocr
```

## Run Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

uvicorn app.main:app --reload
```

## Run Frontend

```bash
cd frontend
npm install
npm run start
```

