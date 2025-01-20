import './App.css';
import Navbar from "./components/Navbar.tsx";
import Home from "./components/Home.tsx";
import Footer from "./components/Footer.tsx";
import {Routes, Route, useLocation} from "react-router-dom";
import Lesson from "./components/Lesson.tsx";
import {useEffect, useState} from "react";
import axios from "axios";
import {LessonModel} from "./components/model/LessonModel.ts";
import NotFound from "./components/NotFound.tsx";

export default function App() {

    const [lessons, setLessons] = useState<LessonModel[]>([]);
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const location = useLocation();

    const resetCurrentPage = () => {
        setCurrentPage(1);
    };

    const toggleSearchBar = () => {
        setShowSearch((prevState) => !prevState);
    };

    const getAllLessons = () => {
        axios
            .get("/api/lesson")
            .then((response) => {
                setLessons(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        getAllLessons();
    }, []);

    useEffect(() => {
        window.scroll(0, 0);
    }, [location]);

    return (
        <>
            <Navbar
                getAllLessons={getAllLessons}
                showSearch={showSearch}
                resetCurrentPage={resetCurrentPage}
                toggleSearchBar={toggleSearchBar}
            />
            <Routes>
                <Route path="*" element={<NotFound />} />
                <Route path="/" element={<Home
                    lessons={lessons}
                    showSearch={showSearch}
                    currentPage={currentPage}
                    paginate={setCurrentPage}
                />}/>
                <Route path="/lesson/:id" element={<Lesson />} />
            </Routes>
            <Footer />
        </>
    );
}
