import { useNavigate } from "react-router-dom";
import { LessonModel } from "./model/LessonModel.ts";
import "./styles/LessonCard.css";
import "./styles/BarButtons.css";

type LessonCardProps = {
    lesson: LessonModel;
};

export default function LessonCard(props: Readonly<LessonCardProps>) {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/theos-reise/${props.lesson.id}`);
    };

    return (
        <div className="lesson-card" onClick={handleCardClick}>
            <h3>{props.lesson.title}</h3>
            <p>{props.lesson.description}</p>
            <p>Category: {props.lesson.category}</p>
            <p>Count: {props.lesson.count}</p>
            <img
                src={props.lesson.imageUrl}
                alt={props.lesson.title}
                className="lesson-card-image"/>
        </div>
    );
}
