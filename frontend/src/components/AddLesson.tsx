import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {LessonModel} from "./model/LessonModel.ts";
import "./styles/LessonCard.css";

interface AddLessonProps {
    user: string;
    handleSubmit: (lesson: LessonModel) => void;
    userDetails: any;
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

        data.append("lessonModelDto", new Blob([JSON.stringify(lessonData)], {type: "application/json"}));

        console.log("lessonData:", lessonData);

        axios
            .post("/api/lesson", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                console.log("Antwort vom Server:", response.data);
                navigate(`/lesson/${response.data.id}`);
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
                <label>Title: <input className="input-small" type="text" value={title}
                                     onChange={(e) => setTitle(e.target.value)} required/></label>
                <label>Description: <textarea className="textarea-large" value={description}
                                              onChange={(e) => setDescription(e.target.value)} required/></label>
                <label>Category: <select className="input-small" value={category}
                                         onChange={(e) => setCategory(e.target.value)} required>
                    <option value="" disabled>*Choose a category*</option>
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                </select>
                </label>
                <label>Count: <input className="input-small" type="number" value={count}
                                     onChange={(e) => setCount(Number(e.target.value))} min={0} required/></label>
                <input type={"file"} onChange={onFileChange}/>
                {image && <img src={URL.createObjectURL(image)} className={"lesson-card-image"}/>}
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
                            <button className="popup-cancel" onClick={handleClosePopup}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
