
type MyLessonsProps = {
    user: string;
}

export default function MyLessons(props:Readonly<MyLessonsProps>) {
    return (
        <div>
            <h3>My Lessons</h3>
            <p>{props.user}</p>
        </div>
    );
}