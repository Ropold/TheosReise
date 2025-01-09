import './App.css';
import Navbar from "./components/Navbar.tsx";
import Home from "./components/Home.tsx";
import Footer from "./components/Footer.tsx";
import { Routes, Route } from "react-router-dom";
import Lesson from "./components/Lesson.tsx";

export default function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/lesson/:id" element={<Lesson />} />
            </Routes>
            <Footer />
        </>
    );
}
