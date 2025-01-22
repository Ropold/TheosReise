import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/BarButtons.css"

type NavbarProps = {
    user: string;
    getUser: () => void;
    getAllLessons: () => void;
    showSearch: boolean;
    resetCurrentPage: () => void;
    toggleSearchBar: () => void;
};

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
                props.getUser();
                navigate("/");
            })
            .catch((error) => {
                console.error("Logout failed:", error);
            });
    }

    return (
        <nav className="navbar">
            <div
                className="clickable-header"
                onClick={() => {
                    props.getAllLessons();
                    props.resetCurrentPage();
                    navigate("/");
                }}>
                <h2 className="header-title">TheosReise</h2>
                <img src="/TheosReise.png" alt="TheosReise Logo" className="logo-image"/>
            </div>
            <button
                onClick={() => {
                    props.toggleSearchBar();
                    navigate("/");
                }}
                className={props.showSearch ? "toggle-search-on" : "toggle-search-off"}
            >
                {props.showSearch ? "Hide Search" : "Search"}
            </button>

            {props.user !== "anonymousUser" ? (
                <>
                    <button onClick={() => navigate(`/add-lesson`)}>Add Lesson</button>
                    <button
                        onClick={() => {
                            props.getAllLessons();
                            navigate(`/edit-lessons`);
                        }}
                    >
                        Edit Lessons
                    </button>
                    <button onClick={() => navigate(`/profile`)}>Profile</button>
                    <button onClick={logoutFromGithub}>Logout</button>
                </>
            ) : (
                <button onClick={loginWithGithub}>Login with GitHub</button>
            )}

        </nav>
    );
}