import { LessonModel } from '../model/LessonModel.ts';

type HomeProps = {
    lessons: LessonModel[];
}

export default function Home(props: Readonly<HomeProps>) {
    return (
        <div>
            <h2>Home</h2>
            <div>
                {props.lessons.map((lesson) => (
                    <div key={lesson.id}>
                        <h3>{lesson.title}</h3>
                        <img src={lesson.imageUrl} alt={lesson.title} />
                    </div>
                ))}
            </div>
        </div>
    );
}
