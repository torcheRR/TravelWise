// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import PostDetail from "./pages/PostDetail";
import SavedPosts from "./pages/SavedPosts";
import CreatePost from "./pages/CreatePost";
import Settings from "./pages/Settings";
import LoginRegister from "./pages/LoginRegister";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <div className="min-h-screen w-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-16">
      <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<LoginRegister />} />
  <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
  <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
  <Route path="/post/:id" element={<PrivateRoute><PostDetail /></PrivateRoute>} />
  <Route path="/saved" element={<PrivateRoute><SavedPosts /></PrivateRoute>} />
  <Route path="/create" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
  <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
</Routes>
      </main>
    </div>
  );
}

export default App;
