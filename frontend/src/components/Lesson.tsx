import {useEffect, useState} from "react";
import {LessonModel} from "./model/LessonModel.ts";
import {useParams} from "react-router-dom";
import axios from "axios";

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
            .get(`/api/lesson/${id}`)
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
        <div>
            <h2>Titel: {lesson.title}</h2>
            <p><strong>Category:</strong>{lesson.category}</p>
            <p><strong>Description: </strong>{lesson.description}</p>
        </div>
    )
}