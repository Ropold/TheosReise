import { useNavigate } from "react-router-dom";
import { LessonModel } from "./model/LessonModel.ts";
import "./styles/LessonCard.css";

type LessonCardProps = {
    lesson: LessonModel;
};

export default function LessonCard(props: Readonly<LessonCardProps>) {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/lesson/${props.lesson.id}`);
    };

    return (
        <div className="lesson-card" onClick={handleCardClick}>
            <h3>{props.lesson.title}</h3>
            <p>{props.lesson.description}</p>
            <p>Category: {props.lesson.category}</p>
            <p>Count: {props.lesson.count}</p>
        </div>
    );
}
