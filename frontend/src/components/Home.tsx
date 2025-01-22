import { LessonModel } from './model/LessonModel.ts';
import { useEffect, useState } from "react";
import SearchBar from "./SearchBar.tsx";
import LessonCard from "./LessonCard.tsx";

type HomeProps = {
    activeLessons: LessonModel[];
    showSearch: boolean;
    currentPage: number;
    paginate: (pageNumber: number) => void;
};

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

    useEffect(() => {
        const filtered = filterLessons(props.activeLessons, searchQuery, filterType, selectedCategory);
        setFilteredLessons(filtered);
    }, [props.activeLessons, searchQuery, filterType, selectedCategory]);

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

    const getPaginationData = (lessons: LessonModel[]) => {
        const indexOfLastLesson = props.currentPage * lessonsPerPage;
        const indexOfFirstLesson = indexOfLastLesson - lessonsPerPage;
        const currentLessons = lessons.slice(indexOfFirstLesson, indexOfLastLesson);
        const totalPages = Math.ceil(lessons.length / lessonsPerPage);
        return { currentLessons, totalPages };
    };

    const { currentLessons, totalPages } = getPaginationData(filteredLessons);

    return (
        <>
            {props.showSearch && (
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    lessons={props.activeLessons}
                    setFilteredLessons={setFilteredLessons}
                    filterType={filterType}
                    setFilterType={setFilterType}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                />
            )}

            <div className="lesson-card-container">
                {currentLessons
                    .sort((a, b) => a.count - b.count) // Sortiere `currentLessons` nach `count`
                    .map((lesson) => (
                        <LessonCard key={lesson.id} lesson={lesson}/>
                    ))}
            </div>

            <div className="button-group">
                {Array.from({length: totalPages}, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => props.paginate(index + 1)}
                        className={index + 1 === props.currentPage ? "active" : ""}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </>
    );
}