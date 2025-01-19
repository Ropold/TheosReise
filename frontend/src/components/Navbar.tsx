import axios from "axios";
import {useNavigate} from "react-router-dom";
import {LessonModel} from "./model/LessonModel.ts";

type NavbarProps = {
    getAllLessons: LessonModel[],
    showSearch: boolean;
    currentPage: number;
    toggleSearchBar: boolean;
}


export default function Navbar(props: Readonly<NavbarProps>) {
    const navigate = useNavigate();

    function loginWithGithub() {
        const host = window.location.host === "localhost:5173" ? "http://localhost:8080" : window.location.origin;
        window.open(host + "/oauth2/authorization/github", "_self");
    }

    function logoutFromGithub() {
        axios
            .post("/api/users/logout")
            .then(() => {
                //props.getUser();
                navigate("/");
            })
            .catch((error) => {
                console.error("Logout failed:", error);
            });
    }

    return (
        <div className="navbar">
            <div className="clickable-header">
                <button onClick={()=>{navigate("/")}}>Home</button>
                <button>search</button>
                <button onClick={loginWithGithub}>login with github</button>
                <button onClick={logoutFromGithub}>logout</button>
            </div>

        </div>

    )
}