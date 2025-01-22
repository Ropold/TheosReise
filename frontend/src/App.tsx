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
import Profile from "./components/Profile.tsx";
import AddLesson from "./components/AddLesson.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import EditLessons from "./components/EditLessons.tsx";

export default function App() {

    const [user, setUser] = useState<string>("anonymousUser");
    const [userDetails, setUserDetails] = useState<any>(null);
    const [lessons, setLessons] = useState<LessonModel[]>([]);
    const [activeLessons, setActiveLessons] = useState<LessonModel[]>([]);
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

    const getActiveLessons = () => {
        axios
            .get("/api/lesson/active")
            .then((response) => {
                setActiveLessons(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function getUser() {
        axios.get("/api/users/me")
            .then((response) => {
                setUser(response.data.toString());
            })
            .catch((error) => {
                console.error(error);
                setUser("anonymousUser");
            });
    }

    function getUserDetails() {
        axios.get("/api/users/me/details")
            .then((response) => {
                setUserDetails(response.data);
            })
            .catch((error) => {
                console.error(error);
                setUserDetails(null);
            });
    }

    useEffect(() => {
        getUser();
        getActiveLessons()
    }, []);

    useEffect(() => {
        if (user !== "anonymousUser") {
            getUserDetails();
            getAllLessons();
        }
    }, [user]);

    useEffect(() => {
        window.scroll(0, 0);
    }, [location]);

    const handleNewLessonSubmit = (newLesson: LessonModel) => {
        setLessons((prevLessons) => [...prevLessons, newLesson]);
    }


    return (
        <>
            <Navbar
                user={user}
                getUser={getUser}
                getAllLessons={getAllLessons}
                showSearch={showSearch}
                resetCurrentPage={resetCurrentPage}
                toggleSearchBar={toggleSearchBar}
            />
            <Routes>
                <Route path="*" element={<NotFound />} />
                <Route path="/" element={<Home
                    activeLessons={activeLessons}
                    showSearch={showSearch}
                    currentPage={currentPage}
                    paginate={setCurrentPage}
                />}/>
                <Route path="/lesson/:id" element={<Lesson />} />
                <Route element={<ProtectedRoute user={user}/>}>
                    <Route path="/add-lesson" element={<AddLesson user={user} handleSubmit={handleNewLessonSubmit} userDetails={userDetails}/>} />
                    <Route path="/edit-lessons" element={<EditLessons user={user} lessons={lessons} setLessons={setLessons}/>} />
                    <Route path="/profile" element={<Profile userDetails={userDetails} />} />
                </Route>
            </Routes>
            <Footer />
        </>
    );
}
