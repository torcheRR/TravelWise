import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import PostDetail from "./pages/PostDetail";
import SavedPosts from "./pages/SavedPosts";
import CreatePost from "./pages/CreatePost";
import Settings from "./pages/Settings";

function App() {
  return (
    <Router>
      <div className="min-h-screen w-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 md:px-8 pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/saved" element={<SavedPosts />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/settings" element={<Settings />} />
            {/* Diğer sayfalar buraya eklenecek */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
