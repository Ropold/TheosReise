
type AddLessonProps = {
    user: string;
}

export default function AddLesson(props: Readonly<AddLessonProps>){
    return(
        <div>
            <h3>Add Lesson</h3>
            <p>{props.user}</p>
        </div>
    )
}