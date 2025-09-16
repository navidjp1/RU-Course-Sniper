# RU Course Sniper

An automated course registration system for Rutgers University students that helps you secure spots in high-demand courses by continuously monitoring availability and automatically registering you when spots open up.

## 🎯 Features

-   **Automated Course Registration**: Continuously monitors course availability and automatically registers you when spots become available
-   **Multi-Course Support**: Add multiple courses to your sniper queue with priority ordering
-   **Drop/Add Functionality**: Automatically drop specified courses when adding new ones
-   **Real-time Dashboard**: Monitor your sniping status, course queue, and account balance
-   **Secure Authentication**: Firebase-based authentication with Google Sign-In support
-   **Dark/Light Mode**: Toggle between light and dark themes for better user experience
-   **Token-based System**: Credit-based system to manage usage
-   **Credential Management**: Securely store and encrypt your Rutgers login credentials

## 🛠️ Tech Stack

### Frontend

-   **React 18** with Vite
-   **Tailwind CSS** for styling
-   **Firebase Authentication**
-   **React Router** for navigation
-   **Axios** for API calls
-   **Sonner** for toast notifications

### Backend

-   **Node.js** with Express
-   **MongoDB** with Mongoose
-   **Puppeteer** for web automation
-   **Firebase Admin** for authentication
-   **Python** web scraper for course data

### Infrastructure

-   **Docker** containerization
-   **Docker Compose** for orchestration
-   **Vercel** for frontend deployment

## 📱 Usage

1. **Visit Website**: ru-autosnipe.vercel.app
2. **Sign Up/Login**: Create an account or sign in with Google
3. **Configure Credentials**: Go to Settings and enter your Rutgers RUID and PAC (should be your birthday as a 4-digit code in 'MMDD' format)
4. **Add Courses**: Use the Dashboard to add courses you want to snipe
5. **Set Priority**: Arrange courses in order of priority
6. **Start Sniping**: Click the "Start Sniper" button to begin monitoring
7. **Monitor Progress**: Watch real-time updates on your dashboard

## 🔒 Security

-   All user credentials are encrypted before storage
-   Firebase handles authentication securely
-   CORS protection for API endpoints

## ⚠️ Disclaimer

This tool is for educational purposes only. Users are responsible for complying with Rutgers University's terms of service and academic policies. Use at your own risk.

---
