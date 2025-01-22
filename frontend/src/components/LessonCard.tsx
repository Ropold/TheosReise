import { useNavigate } from "react-router-dom";
import { LessonModel } from "./model/LessonModel.ts";
import "./styles/LessonCard.css";
import "./styles/BarButtons.css";
import {getCategoryDisplayName} from "../utils/GetCategoryDisyplayName.ts";

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
            <div className={`lesson-card-text ${!props.lesson.imageUrl ? 'no-image' : ''}`}>
                <h3>{props.lesson.title}</h3>
                <p><strong>Category: </strong>{getCategoryDisplayName(props.lesson.category)}</p>
                <p><strong>Count: </strong>{props.lesson.count}</p>
            </div>

            <div>
                {props.lesson.imageUrl ? (
                    <img
                        src={props.lesson.imageUrl}
                        alt={props.lesson.title}
                        className="lesson-card-image"
                    />
                ) : null}
            </div>
        </div>
    );
}