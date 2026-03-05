# 📚 Bookified – AI Voice Book Companion

![Project Status](https://img.shields.io/badge/status-in--progress-yellow)

This project is currently **in progress** and is being built while following the **JavaScript Mastery Next.js 16 course**.

The goal of this project is to create an **AI-powered platform that enables real-time voice conversations with books**, allowing users to upload PDFs and interact with them using natural voice dialogue.

The system transforms static text into an **interactive conversational experience**, combining AI voice synthesis, authentication, and real-time transcripts in a modern full-stack architecture.

![Next.js](https://img.shields.io/badge/-Next.js-000000?style=flat-square&logo=next.js) ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) ![MongoDB](https://img.shields.io/badge/-MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white) ![Tailwind](https://img.shields.io/badge/-TailwindCSS-38BDF8?style=flat-square&logo=tailwind-css&logoColor=white) ![Clerk](https://img.shields.io/badge/-Clerk-6C47FF?style=flat-square) ![Vapi](https://img.shields.io/badge/-Vapi-111111?style=flat-square) ![ElevenLabs](https://img.shields.io/badge/-ElevenLabs-000000?style=flat-square)

---

# 📌 Project Overview

Bookified is designed to demonstrate how modern AI tools can be integrated into a full-stack web application.

The platform allows users to:

- Upload PDF books
- Extract and process text from documents
- Interact with books through **voice conversations**
- Generate **AI-powered summaries**
- Maintain **conversation transcripts**
- Manage a personal library of uploaded content

The project explores how to build **AI-powered interactive knowledge systems** using modern web technologies.

---

## 📌 Project Retrospective

- 📄 [View the Project Retrospective](./PROJECT_RETROSPECTIVE.md)

Outlines key technical learnings, challenges faced, and how this project maps to industry practices.

---

# 🎯 Learning Goals

This project focuses on learning and implementing:

- AI voice interfaces
- Full-stack Next.js application architecture
- Document ingestion pipelines
- AI embeddings and context retrieval
- Secure authentication systems
- Scalable database design
- Modern UI systems using reusable components

---

# ⚙️ Tech Stack

**Next.js 16** – Full-stack React framework for building the application  
**TypeScript** – Static typing for maintainable and scalable code  
**MongoDB & Mongoose** – Database for storing users, books, and transcripts  
**Vapi** – Real-time voice AI conversation engine  
**ElevenLabs** – Natural AI voice synthesis and persona previews  
**Clerk** – Authentication and user management  
**Tailwind CSS** – Utility-first styling framework  
**shadcn/ui** – Accessible component system built on Tailwind and Radix UI

---

# 🔋 Features

👉 **PDF Upload & Processing**  
Upload books as PDFs and automatically extract text for AI interaction.

👉 **Voice Conversations with Books**  
Speak directly to your uploaded content and receive real-time AI responses.

👉 **AI Voice Personas**  
Preview and select natural-sounding AI voices powered by ElevenLabs.

👉 **Real-Time Transcripts**  
Automatically capture conversation transcripts for later reference.

👉 **Library Management**  
Manage uploaded books and browse your personal reading library.

👉 **Secure Authentication**  
Sign in and manage accounts using Clerk authentication.

👉 **AI-Powered Summaries**  
Generate quick summaries and insights from long documents.

👉 **Modern UI System**  
Built with reusable components using **shadcn/ui** and **Tailwind CSS**.

---

# 🧠 Architecture Goals

- Modular full-stack Next.js architecture
- Clean separation of UI, API routes, and services
- Efficient document ingestion and processing
- Real-time AI conversation handling
- Secure authentication and user sessions
- Scalable data storage with MongoDB

---

# 🤸 Quick Start

## ✅ Prerequisites

Make sure you have the following installed:

- Git
- Node.js
- npm

---

## 📦 Install Dependencies

```bash
npm install
```

---

## 🔐 Set Up Environment Variables

Create a `.env` file in the root of your project and add the following:

```
NODE_ENV=development
NEXT_PUBLIC_BASE_URL=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# MongoDB
MONGODB_URI=

# Vapi
NEXT_PUBLIC_VAPI_API_KEY=
VAPI_SERVER_SECRET=

# Google Gemini
GOOGLE_GEMINI_API_KEY=

# ElevenLabs
ELEVENLABS_API_KEY=
```

Replace the placeholder values with your own credentials.

---

## 🚀 Run the Project Locally

```bash
npm run dev
```

Then open:

```
http://localhost:3000
```

---

# 📺 Course Link

This project is being built while following the **JavaScript Mastery Next.js 16 course**.

Watch the full tutorial:

https://www.youtube.com/watch?v=pbOXOY78dNA

---

# 📄 License

This project is licensed under the **MIT License**.

---

# ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.

You can also explore more resources from JavaScript Mastery:

- https://jsmastery.pro
- https://discord.gg/jsmastery
