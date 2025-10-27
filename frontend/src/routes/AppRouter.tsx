// src/routes/AppRouter.tsx

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ChatLayout from "../pages/ChatLayout"; // Assuming this is the renamed file
import ProtectedRoute from "../components/ProtectedRoute";
import { AuthProvider } from "../contexts/AuthContext"; // 🚨 ADDED
import { ChatProvider } from "../contexts/ChatContext"; // 🚨 ADDED

const AppRouter: React.FC = () => {
  return (
    <Router>
      {/* 🚨 Providers wrap the entire application so context is available everywhere */}
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                {/* 🚨 ChatProvider wraps the protected content */}
                <ChatProvider>
                  <Routes>
                    {/* The root path renders the main chat interface/welcome screen */}
                    <Route path="/" element={<ChatLayout />} />
                    {/* Chat specific route uses URL param to load specific messages */}
                    <Route path="/chat/:chatId" element={<ChatLayout />} /> 
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </ChatProvider>
              </ProtectedRoute>
            } 
          />

          {/* Final fallback route (Unauthenticated users go to /login) */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default AppRouter;