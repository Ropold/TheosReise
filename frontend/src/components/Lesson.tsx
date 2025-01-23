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

// Map aller Komponenten basierend auf Count-Zahlen
const lessonComponents: Record<number, React.FC> = {
    1: Lesson1,
    2: Lesson2,
    3: Lesson3,
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

    // Dynamische Komponente auswählen
    const DynamicLessonComponent = lessonComponents[lesson.count] || null;

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
                    <p>Keine zusätzliche Komponente für Count: {lesson.count}</p>
                )}
            </div>
        </>
    );
}
