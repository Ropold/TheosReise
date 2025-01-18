import {LessonModel} from '../model/LessonModel.ts';

type HomeProps = {
    lessons: LessonModel[];
}

export default function Home(props: Readonly<HomeProps>) {
    return (
        <div>
            <h2>Home</h2>
        </div>
    )
}