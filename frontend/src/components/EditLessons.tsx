import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { LessonModel } from "./model/LessonModel.ts";
import { getCategoryDisplayName } from "../utils/GetCategoryDisyplayName.ts";
import "./styles/LessonCard.css";
import "./styles/BarButtons.css";

type EditLessonsProps = {
    user: string;
    lessons: LessonModel[];
    setLessons: (lessons: LessonModel[]) => void;
};

const defaultLesson: LessonModel = {
    id: "",
    isActive: true,
    count: 0,
    title: "Loading...",
    description: "",
    category: "BEGINNER",
    imageUrl: "",
};

export default function EditLessons(props: Readonly<EditLessonsProps>) {
    const [lesson, setLesson] = useState<LessonModel>(defaultLesson);
    const [isEditing, setIsEditing] = useState(false);
    const [editedLesson, setEditedLesson] = useState<LessonModel | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const { id } = useParams<{ id: string }>();

    const fetchLessonDetails = () => {
        if (!id) return;
        axios
            .get(`/api/theos-reise/${id}`)
            .then((response) => setLesson(response.data))
            .catch((error) => console.error("Error fetching lesson details", error));
    };

    useEffect(() => {
        fetchLessonDetails();
    }, [id]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setEditedLesson(lesson);
    };

    const handleSaveEdit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editedLesson) return;

        const data = new FormData();
        if (image) {
            data.append("image", image);
        }

        const updatedLessonData = {
            ...editedLesson,
            imageUrl: lesson.imageUrl, // Keep the existing image URL if no new image is provided
        };

        data.append("lessonModelDto", new Blob([JSON.stringify(updatedLessonData)], { type: "application/json" }));

        axios
            .put(`/api/theos-reise/${lesson.id}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                console.log("Lesson updated successfully", response.data);
                props.setLessons((prevLessons) =>
                    prevLessons.map((l) => (l.id === lesson.id ? { ...l, ...response.data } : l))
                );
                setIsEditing(false);
            })
            .catch((error) => {
                console.error("Error updating lesson", error);
                alert("An error occurred while saving the lesson.");
            });
    };

    const handleInputChange = (field: keyof LessonModel, value: any) => {
        setEditedLesson((prev) => (prev ? { ...prev, [field]: value } : null));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImage(e.target.files[0]);
        }
    };

    return (
        <div className="lesson-card-container">
            {props.lessons.length > 0 ? (
                props.lessons.map((lesson) => (
                    <div key={lesson.id} className="lesson-card">
                        <h2>{lesson.title}</h2>
                        <p><strong>Description:</strong> {lesson.description}</p>
                        <p><strong>Count:</strong> {lesson.count}</p>
                        <p><strong>Category:</strong> {lesson.category}</p>
                        <p>
                            <strong>Visibility:</strong> {lesson.isActive ? "Active" : "Inactive"}
                        </p>
                        {lesson.imageUrl && (
                            <img
                                src={lesson.imageUrl}
                                alt={lesson.title}
                                className="lesson-card-image"
                            />
                        )}
                        <div className="button-group">
                            <button
                                id={lesson.isActive ? "active-button" : "inactive-button"}
                                onClick={() => handleToggleActiveStatus(lesson.id)}
                            >
                                {lesson.isActive ? "Active" : "Offline"}
                            </button>
                            <button onClick={() => handleEditToggle(lesson.id)}>Edit</button>
                            <button id="button-delete" onClick={() => handleDeleteClick(lesson.id)}>Delete</button>
                        </div>
                    </div>
                ))
            ) : (
                <p>No lessons found</p>
            )}
        </div>
    );
}