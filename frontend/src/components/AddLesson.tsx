import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {LessonModel} from "./model/LessonModel.ts";
import {UserDetails} from "./model/UserDetails.ts";
import "./styles/LessonCard.css";

interface AddLessonProps {
    user: string;
    handleSubmit: (lesson: LessonModel) => void;
    userDetails: UserDetails;
    lessons: LessonModel[];
}

export default function AddLesson(props: Readonly<AddLessonProps>) {

    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [count, setCount] = useState<number>(0);
    const [image, setImage] = useState<File | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const isCountUnique = !props.lessons.some((lesson) => lesson.count === count);

        if (!isCountUnique) {
            alert("Count value must be unique. Please choose a different value.");
            return;
        }

        const data = new FormData();

        if (image) {
            data.append("image", image);
        }

        const lessonData = {
            title,
            description,
            category: category as any,
            count,
            imageUrl: "",
        };

        data.append("lessonModelDto", new Blob([JSON.stringify(lessonData)], { type: "application/json" }));

        console.log("lessonData:", lessonData);

        axios
            .post("/api/theos-reise", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                console.log("Antwort vom Server:", response.data);
                navigate(`/theos-reise/${response.data.id}`);
                props.handleSubmit(response.data);
            })
            .catch((error) => {
                if (error.response && error.response.status === 400 && error.response.data) {
                    const errorMessages = error.response.data;
                    const errors: string[] = [];
                    Object.keys(errorMessages).forEach((field) => {
                        errors.push(`${field}: ${errorMessages[field]}`);
                    });

                    setErrorMessages(errors);
                    setShowPopup(true);
                } else {
                    alert("An unexpected error occurred. Please try again.");
                }
            });
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImage(e.target.files[0]);
        }
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setErrorMessages([]);
    };

    return (
        <div className="edit-form">
            <h2>Add New Lesson</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Title:
                    <input
                        className="input-small"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Description:
                    <textarea
                        className="textarea-large"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Category:
                    <select
                        className="input-small"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="" disabled>
                            *Choose a category*
                        </option>
                        <option value="BEGINNER">Beginner</option>
                        <option value="INTERMEDIATE">Intermediate</option>
                        <option value="ADVANCED">Advanced</option>
                    </select>
                </label>

                <label>
                    Count:
                    <select
                        className="input-small"
                        value={count || ""}
                        onChange={(e) => setCount(Number(e.target.value))}
                        required
                    >
                        <option value="" disabled>
                            Select Count
                        </option>
                        {[...Array(25).keys()]
                            .map((n) => n + 1) // Erzeuge Zahlen von 1 bis 10
                            .filter(
                                (n) =>
                                    n === count || // Füge den aktuellen Wert von `count` ein
                                    !props.lessons.some((lesson) => lesson.count === n) // Filtere bereits genutzte Zahlen
                            )
                            .map((n) => (
                                <option key={n} value={n}>
                                    {n}
                                </option>
                            ))}
                    </select>
                </label>

                <label>
                    Image:
                    <input type="file" onChange={onFileChange} />
                    {image && <img src={URL.createObjectURL(image)} className="lesson-card-image" />}
                </label>

                <div className="button-group">
                    <button type="submit">Add Lesson</button>
                </div>
            </form>

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Validation Errors</h3>
                        <ul>
                            {errorMessages.map((msg, index) => (
                                <li key={index}>{msg}</li>
                            ))}
                        </ul>
                        <div className="popup-actions">
                            <button className="popup-cancel" onClick={handleClosePopup}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}