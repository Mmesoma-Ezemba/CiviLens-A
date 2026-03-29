# Product Requirements Document (PRD): CiviLens AI

## 1. Introduction
CiviLens AI is an intelligent application designed to help ordinary people understand complex real-world documents such as contracts, policies, agreements, and official notices. By leveraging the power of Gemini AI, it simplifies difficult language into clear, easy-to-understand explanations while preserving the original meaning.

## 2. Target Audience
- Individuals needing to understand legal, financial, or official documents without professional assistance.
- Small business owners reviewing contracts or policies.
- Students or employees trying to grasp the terms of agreements.
- Anyone looking for a quick and reliable way to identify risks or important clauses in documents.

## 3. Product Features

### 3.1 Authentication
- Secure user registration and login using Supabase.
- Role-based access control (only authenticated users can save analyses or upload avatars).

### 3.2 Document Input
- Support for pasting raw text.
- File upload support for `.txt`, `.md`, `.pdf`, `.docx`, and image files.
- Maximum file size limit (currently enforced at 5MB, though UI mentions 25MB).

### 3.3 AI-Powered Analysis (Powered by Gemini)
- Automated classification of document category (e.g., Legal, Financial, Government, Educational, Employment, General).
- Extraction of a simplified explanation of the document's contents.
- Identification of 3-6 key points.
- Highlighting of potential risks, with an assigned risk level (None, Low, Medium, High).
- Generation of actionable, practical advice.

### 3.4 Analysis Results View
- Intuitive and visually appealing dashboard to present the AI's findings.
- Clear indicators for risk levels using color-coded badges.
- Formatted text output handling AI-generated markdown.

### 3.5 PDF Export
- Capability to export the analysis results as a well-formatted PDF document for offline viewing or sharing.
- Utilizes `html-to-image` and `jspdf` for robust client-side PDF generation.

### 3.6 History and Saving
- Automatic saving of analysis results to the user's account via Supabase.
- A view to browse past analyses.

### 3.7 User Profile
- Ability to upload and update a custom avatar image.

## 4. Non-Functional Requirements

### 4.1 Performance
- Fast response times for UI interactions.
- Optimized AI processing, with reasonable feedback (loading states, estimated time) provided to the user during analysis.

### 4.2 Security
- Secure storage of user data and analysis history using Supabase Row Level Security (RLS).
- API keys (like `GEMINI_API_KEY`) must be kept secure on the server/build side.

### 4.3 Usability
- Mobile-responsive design built with Tailwind CSS.
- Accessible and clear UI using standard icons (Lucide React) and clear typography.

## 5. Technical Stack
- **Frontend Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Authentication & Database:** Supabase
- **AI Integration:** Google GenAI (Gemini 2.5 Flash)
- **PDF Generation:** html2canvas, jspdf, html-to-image
- **Document Parsing:** mammoth (DOCX), pdfjs-dist (PDF)
