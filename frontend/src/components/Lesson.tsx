import {useEffect, useState} from "react";
import {LessonModel} from "./model/LessonModel.ts";
import {useParams} from "react-router-dom";
import axios from "axios";
import "./styles/LessonCard.css";

const defaultLesson: LessonModel = {
    id: "",
    isActive: true,
    count: 0,
    title: "Loading.....",
    description: "",
    category: "BEGINNER",
    imageUrl: "",
}


export default function Lesson() {
    const [lesson, setLesson] = useState<LessonModel>(defaultLesson);
    const {id} = useParams<{id: string}>();

    const fetchLessonDetails = () => {
        if (!id) return;
        axios
            .get(`/api/theos-reise/${id}`)
            .then((response) => {
                console.log(response.data);
                setLesson(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        fetchLessonDetails();
    }, [id]);

    return (
        <div className="lesson-details">
            <h2>Titel: {lesson.title}</h2>
            <p><strong>Category:</strong>{lesson.category}</p>
            <p><strong>Description: </strong>{lesson.description}</p>
            <p><strong>Count: </strong>{lesson.count}</p>
            {lesson.imageUrl && (
                <img src={lesson.imageUrl} alt={lesson.title} className="lesson-card-image"/>
            )}
        </div>
    )
}