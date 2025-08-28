# ⚡️ Online Code Editor

A blazing-fast, AI-integrated web IDE built entirely in the browser using **Next.js App Router**, **WebContainers**, **Monaco Editor**, and **local LLMs via Ollama**. It offers real-time code execution, an AI-powered chat assistant, and support for multiple tech stacks — all wrapped in a stunning developer-first UI.

---

## 🚀 Features

- 🔐 **OAuth Login with NextAuth** – Supports Google & GitHub login  
- 🎨 **Modern UI** – Built with TailwindCSS & ShadCN UI  
- 🌗 **Dark/Light Mode** – Seamlessly toggle between themes  
- 🧱 **Project Templates** – Choose from React, Next.js, Express, Hono, Vue, or Angular  
- 🗂️ **Custom File Explorer** – Create, rename, delete, and manage files/folders easily  
- 🖊️ **Enhanced Monaco Editor** – Syntax highlighting, formatting, keybindings, and AI autocomplete  
- 💡 **AI Suggestions with Ollama** – Local models give you code completion on `Ctrl + Space` or double `Enter`. Accept with `Tab`.  
- ⚙️ **WebContainers Integration** – Instantly run frontend/backend apps right in the browser  
- 💻 **Terminal with xterm.js** – Fully interactive embedded terminal experience  
- 🤖 **AI Chat Assistant** – Share files with the AI and get help, refactors, or explanations  

---

## 🧱 Tech Stack

| Layer         | Technology                    |
|---------------|-------------------------------|
| **Framework** | Next.js 15 (App Router)       |
| **Styling**   | TailwindCSS, ShadCN UI        |
| **Language**  | TypeScript                    |
| **Auth**      | NextAuth (Google + GitHub)    |
| **Editor**    | Monaco Editor                 |
| **AI**        | Ollama (LLMs via Docker)      |
| **Runtime**   | WebContainers                 |
| **Terminal**  | xterm.js                      |
| **Database**  | MongoDB (via `DATABASE_URL`)  |

---

## 🛠️ Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/vibecode-editor.git
cd vibecode-editor
