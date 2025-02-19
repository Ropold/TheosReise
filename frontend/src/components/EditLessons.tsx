import { useEffect, useState } from "react";
import axios from "axios";
import { LessonModel } from "./model/LessonModel.ts";
import "./styles/LessonCard.css";
import "./styles/BarButtons.css";
import { getCategoryDisplayName } from "../utils/GetCategoryDisyplayName.ts";
import LessonCard from "./LessonCard.tsx";
import {Category} from "./model/Category.ts";

type EditLessonsProps = {
    user: string;
    lessons: LessonModel[];
    setLessons: React.Dispatch<React.SetStateAction<LessonModel[]>>;
};

export default function EditLessons(props: Readonly<EditLessonsProps>) {
    const [userLessons, setUserLessons] = useState<LessonModel[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editData, setEditData] = useState<LessonModel | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [lessonToDelete, setLessonToDelete] = useState<string | null>(null);
    const [category, setCategory] = useState<string>("");

    useEffect(() => {
        setUserLessons(props.lessons);
    }, [props.lessons]);

    const handleEditToggle = (lessonId: string) => {
        const lessonToEdit = props.lessons.find((lesson) => lesson.id === lessonId);
        if (lessonToEdit) {
            setEditData(lessonToEdit);
            setIsEditing(true);
            setImage(null);
            setCategory(lessonToEdit.category || ""); // Wenn die Kategorie nicht definiert ist, bleibt sie leer
        }
    };

    const handleSaveEdit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editData) return;

        const data = new FormData();
        if (image) {
            data.append("image", image);
        }

        const updatedLessonData = {
            ...editData,
            category, // Füge die Kategorie zum `updatedLessonData` hinzu
        };

        data.append("lessonModelDto", new Blob([JSON.stringify(updatedLessonData)], { type: "application/json" }));

        axios
            .put(`/api/theos-reise/${editData.id}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                props.setLessons((prevLessons) =>
                    prevLessons.map((lesson) =>
                        lesson.id === editData.id ? { ...lesson, ...response.data } : lesson
                    )
                );
                setIsEditing(false);
            })
            .catch((error) => {
                console.error("Error saving lesson edits:", error);
                alert("An unexpected error occurred.");
            });
    };

    const handleToggleActiveStatus = (lessonId: string) => {
        axios
            .put(`/api/theos-reise/${lessonId}/toggle-active`)
            .then(() => {
                props.setLessons((prevLessons) =>
                    prevLessons.map((lesson) =>
                        lesson.id === lessonId ? { ...lesson, isActive: !lesson.isActive } : lesson
                    )
                );
            })
            .catch((error) => {
                console.error("Error toggling lesson status:", error);
                alert("An error occurred while toggling active status.");
            });
    };

    const handleDeleteClick = (id: string) => {
        setLessonToDelete(id);
        setShowPopup(true);
    };

    const handleConfirmDelete = () => {
        if (lessonToDelete) {
            axios
                .delete(`/api/theos-reise/${lessonToDelete}`)
                .then(() => {
                    props.setLessons((prevLessons) =>
                        prevLessons.filter((lesson) => lesson.id !== lessonToDelete)
                    );
                })
                .catch((error) => {
                    console.error("Error deleting lesson:", error);
                    alert("An error occurred while deleting the lesson.");
                });
        }
        setShowPopup(false);
        setLessonToDelete(null);
    };

    const handleCancel = () => {
        setShowPopup(false);
        setLessonToDelete(null);
    };

    const handleCountChange = (newCount: number) => {
        setEditData({ ...editData!, count: newCount });
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImage(e.target.files[0]);
        }
    };

    return (
        <div>
            {isEditing ? (
                <div className="edit-form">
                    <h2>Edit Lesson</h2>
                    <form onSubmit={handleSaveEdit}>
                        <label>
                            Title:
                            <input
                                className="input-small"
                                type="text"
                                value={editData?.title || ""}
                                onChange={(e) => setEditData({...editData!, title: e.target.value})}
                            />
                        </label>

                        <label>
                            Description:
                            <textarea
                                className="textarea-large"
                                value={editData?.description || ""}
                                onChange={(e) => setEditData({...editData!, description: e.target.value})}
                            />
                        </label>

                        <label>
                            Count:
                            <select
                                className="input-small"
                                value={editData?.count || ""}
                                onChange={(e) => handleCountChange(Number(e.target.value))}
                            >
                                <option value="" disabled>
                                    Select Count
                                </option>
                                {[...Array(25).keys()]
                                    .map((n) => n + 1) // Erzeuge Zahlen von 1 bis 10
                                    .filter(
                                        (n) =>
                                            n === editData?.count || // Füge den aktuellen Wert von `editData.count` ein
                                            !props.lessons.some((lesson) => lesson.count === n) // Filtere bereits genutzte Zahlen
                                    )
                                    .map((n) => (
                                        <option key={n} value={n}>
                                            {n}
                                        </option>
                                    ))}
                            </select>
                        </label>

                        {/* Kategorie Auswahl */}
                        <label>
                            Category:
                            <select
                                className="input-small"
                                value={category}
                                onChange={(e) => setCategory(e.target.value as Category)}
                                required
                            >
                                <option value="" disabled>
                                    *Choose a category*
                                </option>
                                <option value="BEGINNER">{getCategoryDisplayName("BEGINNER")}</option>
                                <option value="INTERMEDIATE">{getCategoryDisplayName("INTERMEDIATE")}</option>
                                <option value="ADVANCED">{getCategoryDisplayName("ADVANCED")}</option>
                            </select>
                        </label>


                        <label>
                            Visibility:
                            <select
                                className="input-small"
                                value={editData?.isActive ? "true" : "false"}
                                onChange={(e) =>
                                    setEditData({...editData!, isActive: e.target.value === "true"})
                                }
                            >
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </label>

                        <label>
                            Image:
                            <input type="file" onChange={onFileChange}/>
                            {image && <img src={URL.createObjectURL(image)} className="lesson-card-image"/>}
                        </label>

                        <div className="button-group">
                            <button type="submit">Save Changes</button>
                            <button type="button" onClick={() => setIsEditing(false)}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="lesson-card-container">
                    {userLessons
                        .sort((a, b) => a.count - b.count) // Sortiere `currentLessons` nach `count`
                        .map((lesson) => (
                            <div key={lesson.id} className="lesson-card-wrapper">
                                <LessonCard key={lesson.id} lesson={lesson}/>
                                <div className="button-group">
                                <button
                                        id={lesson.isActive ? "active-button" : "inactive-button"}
                                        onClick={() => handleToggleActiveStatus(lesson.id)}
                                    >
                                        {lesson.isActive ? "Active" : "Offline"}
                                    </button>
                                    <button onClick={() => handleEditToggle(lesson.id)}>Edit</button>
                                    <button
                                        id="button-delete"
                                        onClick={() => handleDeleteClick(lesson.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>
            )}

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to delete this lesson?</p>
                        <div className="popup-actions">
                            <button onClick={handleConfirmDelete} className="popup-confirm">
                                Yes, Delete
                            </button>
                            <button onClick={handleCancel} className="popup-cancel">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
