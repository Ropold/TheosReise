import {LessonModel} from "./model/LessonModel.ts";

type MyLessonsProps = {
    user: string;
    lessons: LessonModel[];
    setLessons: (lessons: LessonModel[]) => void;
}

export default function EditLessons(props:Readonly<MyLessonsProps>) {
    return (
        <div>
            <h3>Edit Lessons</h3>
            <p>{props.user}</p>
        </div>
    );
}