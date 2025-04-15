//import { useState } from "react";

import "./App.css";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Auth from "./pages/auth";
//import { Route } from "lucide-react";
//import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import { useAppStore } from "./store";
const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo; // Replace with your authentication logic

  return isAuthenticated ? children : <Navigate to="/auth" />;
};
const AuthRoutes = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo; // Replace with your authentication logic

  return !isAuthenticated ? children : <Navigate to="/chat" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
