# 🏦 India's Trusted Bank Ifsc Code Finder

A comprehensive, fast, and user-friendly web application for finding Indian Financial System Codes (IFSC) for all banks across India. Built with modern web technologies, this project ensures accuracy, speed, and a premium user experience.

## ✨ Features

-   **🔍 Advanced Search**: Find IFSC codes by filtering through Bank, State, District, and Branch.
-   **⚡ Quick Lookup**: Directly search using a known IFSC code.
-   **🏦 Extensive Database**: Covers major banks including SBI, HDFC, ICICI, PNB, and hundreds more.
-   **📱 Fully Responsive**: Optimized for Desktops, Tablets, and Mobile devices with a "Middle Round" aesthetic.
-   **📝 Educational Blogs**: Integrated section for banking and finance-related articles and FAQs.
-   **📞 Contact Support**: Video-background enabled contact page with direct email integration via EmailJS.
-   **🛠️ Financial Tools**: Useful calculators and banking utilities.
-   **🏎️ High Performance**: Utilizes Web Workers for non-blocking CSV data parsing and optimized searching.

## 🛠️ Tech Stack

-   **Frontend Framework**: [React](https://reactjs.org/) (Vite)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [Shadcn/ui](https://ui.shadcn.com/) & [Radix UI](https://www.radix-ui.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **State Management & Data Fetching**: [TanStack Query](https://tanstack.com/query)
-   **Routing**: [React Router DOM](https://reactrouter.com/)
-   **Data Parsing**: [PapaParse](https://www.papaparse.com/)
-   **Email Service**: [EmailJS](https://www.emailjs.com/)

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

-   Node.js (v18 or higher)
-   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone (https://github.com/Pawan8655/bankifsccode.git)
cd ifsc-finder
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory and add your EmailJS credentials:
    ```env
    VITE_EMAILJS_SERVICE_ID=your_service_id
    VITE_EMAILJS_TEMPLATE_ID=your_template_id
    VITE_EMAILJS_PUBLIC_KEY=your_public_key
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  **Build for production**
    ```bash
    npm run build
    ```

## 📂 Project Structure

```
src/
├── assets/         # Static assets (images, videos)
├── components/     # Reusable UI components (Header, Footer, SearchFilters)
├── hooks/          # Custom React hooks (useIFSCData, etc.)
├── lib/            # Utilities and helper functions (csvParser)
├── pages/          # Page components (Index, About, Contact, Blogs, etc.)
├── worker/         # Web workers for heavy data processing
└── App.tsx         # Main application entry point
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Pawan Yadav**
-   📍 Siddharth Nagar, Uttar Pradesh, India
