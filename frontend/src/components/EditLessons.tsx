
type MyLessonsProps = {
    user: string;
}

export default function EditLessons(props:Readonly<MyLessonsProps>) {
    return (
        <div>
            <h3>Edit Lessons</h3>
            <p>{props.user}</p>
        </div>
    );
}