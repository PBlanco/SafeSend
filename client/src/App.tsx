import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Download from "./pages/Download";
import Upload from "./pages/Upload";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Upload />} />
        <Route path="/download" element={<Download />} />
      </Routes>
    </Router>
  );
};

export default App;
