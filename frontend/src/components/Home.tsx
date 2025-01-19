import { LessonModel } from './model/LessonModel.ts';
import LessonCard from "./LessonCard.tsx";
import {useEffect, useState} from "react";

type HomeProps = {
    lessons: LessonModel[];
    showSearch: boolean;
    currentPage: number;
    paginate: (pageNumber: number) => void;
}

export default function Home(props: Readonly<HomeProps>) {

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredLessons, setFilteredLessons] = useState<LessonModel[]>([]);
    const [filterType, setFilterType] = useState<"title" | "category" | "all">("title");
    const [selectedCategory, setSelectedCategory] = useState<LessonModel["category"] | "">("");
    const lessonsPerPage = 9;

    useEffect(() => {
        if (!props.showSearch) {
            setSearchQuery("");
        }
    }, [props.showSearch]);

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
