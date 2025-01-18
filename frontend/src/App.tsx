import './App.css';
import Navbar from "./components/Navbar.tsx";
import Home from "./components/Home.tsx";
import Footer from "./components/Footer.tsx";
import { Routes, Route } from "react-router-dom";
import Lesson from "./components/Lesson.tsx";
import {useEffect, useState} from "react";
import axios from "axios";
import {LessonModel} from "./model/LessonModel.ts";

export default function App() {

    const [lessons, setLessons] = useState<LessonModel[]>([]);


    const getAllLessons = () => {
        axios
            .get("/api/lesson")
            .then((response) => {
                console.log(response.data);
                setLessons(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        getAllLessons();
    }, []);

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="*" element={<h1>Not Found</h1>} />
                <Route path="/" element={<Home lessons={lessons}/>} />
                <Route path="/lesson/:id" element={<Lesson />} />
            </Routes>
            <Footer />
        </>
    );
}
