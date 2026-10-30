# Mersad | مرصاد 🛡️

An AI-powered cybersecurity threat analysis platform built for **Cyberthon 2026** under the **AI & Cybersecurity Track**.

**Mersad (مرصاد)** is designed specifically to protect everyday citizens—especially non-technical users and older adults—from digital scams, phishing attempts, and social engineering attacks. By translating complex threat intelligence into clear, plain-language Arabic advice, Mersad makes online security accessible to everyone.

---

## 🌟 Key Features

- **Localized Arabic UI:** Fully RTL-optimized interface built with Cairo typography for maximum readability.
- **Instant Risk Detection:** Fast paste-and-analyze workflow for suspicious SMS messages, WhatsApp copy, emails, and links.
- **Explainable Threat Indicators:** Explains *why* a message is dangerous in simple terms without overwhelming users with technical jargon.
- **Actionable Guidance:** Provides clear, step-by-step instructions to prevent financial fraud and account compromise.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** Built with **React** + **Vite**, featuring clean inline RTL CSS layouts and responsive design.
- **Backend:** High-performance **FastAPI** pipeline designed for low-latency API handling and high availability.
- **AI Engine:** Integrated Large Language Models (LLMs) fine-tuned for Arabic NLP, dialect contextualization, and phishing classification.

---

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js:** v18 or higher
- **Python:** 3.10 or higher

---

### Step 1: Clone the Repository

git clone <repository-url>
cd mersad


### Step 2: Backend Setup

#### Navigate to backend folder
cd backend

#### Create and activate virtual environment
python -m venv venv

#### On Windows (PowerShell):
.\venv\Scripts\activate
#### On Linux/macOS:
source venv/bin/activate

#### Install dependencies
pip install -r requirements.txt

#### Start FastAPI server
uvicorn main:app --reload


### Step 3: Frontend Setup

#### Navigate to frontend folder from the project root
cd frontend

#### Install frontend dependencies
npm install

#### Start the Vite development server
npm run dev
