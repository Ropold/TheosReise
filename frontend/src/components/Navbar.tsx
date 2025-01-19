import axios from "axios";
import { useNavigate } from "react-router-dom";

type NavbarProps = {
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
                <button onClick={() => navigate("/")}>Home</button>
                <button
                    onClick={() => {
                        props.toggleSearchBar();
                        navigate("/");
                    }}
                    className={props.showSearch ? "toggle-search-on" : "toggle-search-off"}
                >
                    {props.showSearch ? "Hide Search" : "Search"}
                </button>
                <button onClick={loginWithGithub}>Login with GitHub</button>
                <button onClick={logoutFromGithub}>Logout</button>
            </div>
        </div>
    );
}