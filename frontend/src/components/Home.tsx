import { LessonModel } from './model/LessonModel.ts';
import LessonCard from "./LessonCard.tsx";

type HomeProps = {
    lessons: LessonModel[];
}

export default function Home(props: Readonly<HomeProps>) {
    return (
        <div>
            <h2>Home</h2>
            <div className="lesson-card-container">
                {props.lessons.map((lesson) => (
                    <LessonCard key={lesson.id} lesson={lesson} />
                ))}
            </div>
        </div>
    );
}
