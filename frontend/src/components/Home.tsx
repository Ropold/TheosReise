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

    const filterLessons = (lessons: LessonModel[], query: string, filterType: string, category: string | "") => {
        const lowerQuery = query.toLowerCase();

        return lessons.filter((lesson) => {
            const matchesCategory = category ? lesson.category === category : true;
            const matchesTitle = filterType === "title" && lesson.title.toLowerCase().includes(lowerQuery);
            const matchesAll =
                filterType === "all" &&
                (lesson.title.toLowerCase().includes(lowerQuery) ||
                    lesson.description.toLowerCase().includes(lowerQuery));

            return matchesCategory && (matchesTitle || matchesAll);
        });
    };

    useEffect(() => {
        const filtered = filterLessons(props.lessons, searchQuery, filterType, selectedCategory);
        setFilteredLessons(filtered);
    }, [props.lessons, searchQuery, filterType, selectedCategory]);

    return (
        <div>
            <h2>Theos Reise</h2>
            <div className="lesson-card-container">
                {props.lessons.map((lesson) => (
                    <LessonCard key={lesson.id} lesson={lesson} />
                ))}
            </div>
        </div>
    );
}
