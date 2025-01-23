import { useEffect, useState } from "react";
import { LessonModel } from "./model/LessonModel.ts";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./styles/LessonCard.css";
import { getCategoryDisplayName } from "../utils/GetCategoryDisyplayName.ts";
import { DefaultLesson } from "./model/DefaultLesson.ts";
import Lesson1 from "./lesson-content/Lesson1.tsx";
import Lesson2 from "./lesson-content/Lesson2.tsx";
import Lesson3 from "./lesson-content/Lesson3.tsx";
// Weitere Komponenten bei Bedarf importieren

// Map der Komponenten basierend auf IDs
const lessonComponents: Record<string, React.FC> = {
    "e99aaad9-0b9e-45ee-9816-5c067b856ac1": Lesson1,
    "576229fb-e210-490f-a637-9bdef55c15cd": Lesson2,
    "36d91ddc-680b-4704-81b9-201154d611eb": Lesson3,
    // Weitere Komponenten hinzufügen
};

export default function Lesson() {
    const [lesson, setLesson] = useState<LessonModel>(DefaultLesson);
    const { id } = useParams<{ id: string }>();

    const fetchLessonDetails = () => {
        if (!id) return;
        axios
            .get(`/api/theos-reise/${id}`)
            .then((response) => {
                setLesson(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        fetchLessonDetails();
    }, [id]);

    // Dynamische Komponente auswählen basierend auf der ID
    const DynamicLessonComponent = lessonComponents[lesson.id] || null;

    return (
        <>
            <div className="lesson-details">
                <h2>Titel: {lesson.title}</h2>
                <p>
                    <strong>Category: </strong>
                    {getCategoryDisplayName(lesson.category)}
                </p>
                <p>
                    <strong>Description: </strong>
                    {lesson.description}
                </p>
                <p>
                    <strong>Count: </strong>
                    {lesson.count}
                </p>
                {lesson.imageUrl && (
                    <img
                        src={lesson.imageUrl}
                        alt={lesson.title}
                        className="lesson-card-image"
                    />
                )}
            </div>
            <div>
                {/* Dynamische Komponente rendern */}
                {DynamicLessonComponent ? (
                    <DynamicLessonComponent />
                ) : (
                    <p>Keine zusätzliche Komponente für die ID: {lesson.id}</p>
                )}
            </div>
        </>
    );
}
