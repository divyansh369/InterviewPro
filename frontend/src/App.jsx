import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import ProblemsPage from "./pages/ProblemsPage.jsx";
import { useUser } from "@clerk/react";
import {Toaster} from 'react-hot-toast'

function App() {

  const {isSignedIn} = useUser()

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to = "/"/>} />
      </Routes>

      <Toaster position="down-right" toastOptions={{duration:2000}}/>
    </>
  );
}

export default App;

// todo: react-router tanstack react-query axios