import React, { ChangeEvent, useEffect } from "react";
import { LessonModel } from "./model/LessonModel.ts";
import "./styles/SearchBar.css";

type SearchBarProps = {
    value: string;
    onChange: (value: string) => void;
    lessons: LessonModel[];
    setFilteredLessons: (lessons: LessonModel[]) => void;
    filterType: "title" | "category" | "all";
    setFilterType: (filterType: "title" | "category" | "all") => void;
    selectedCategory: LessonModel["category"] | "";
    setSelectedCategory: (category: LessonModel["category"] | "") => void;
};

const SearchBar: React.FC<SearchBarProps> = ({
                                                 value,
                                                 onChange,
                                                 lessons,
                                                 setFilteredLessons,
                                                 filterType,
                                                 setFilterType,
                                                 selectedCategory,
                                                 setSelectedCategory
                                             }) => {
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };

    const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value as LessonModel["category"] | "";
        setSelectedCategory(selectedValue);
    };

    useEffect(() => {
        const filtered = lessons.filter((lesson) => {
            const lowerQuery = value.toLowerCase();

            const matchesCategory = selectedCategory ? lesson.category === selectedCategory : true;

            const matchesTitle = filterType === "title" && lesson.title.toLowerCase().includes(lowerQuery);

            const matchesAll =
                filterType === "all" &&
                (lesson.title.toLowerCase().includes(lowerQuery) ||
                    lesson.description.toLowerCase().includes(lowerQuery));

            return matchesCategory && (matchesTitle || matchesAll);
        });

        setFilteredLessons(filtered);
    }, [value, filterType, lessons, selectedCategory, setFilteredLessons]);

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search Lessons..."
                value={value}
                onChange={handleInputChange}
            />
            <div className="filter-buttons">
                <button
                    onClick={() => {
                        setFilterType("title");
                    }}
                    className={filterType === "title" ? "active" : ""}
                >
                    Title
                </button>
                <button
                    onClick={() => {
                        setFilterType("all");
                        setSelectedCategory(""); // Setzt die Kategorie zurück, wenn "No Filter" gewählt wird
                        onChange('');
                    }}
                    className={filterType === "all" && selectedCategory === "" ? "active" : ""}
                >
                    No Filter
                </button>
                <label>
                    <select
                        className="input-small"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                    >
                        <option value="">Filter by a category</option>
                        <option value="BEGINNER">Anfänger</option>
                        <option value="INTERMEDIATE">Fortgeschrittener Anfänger</option>
                        <option value="ADVANCED">Fortgeschritten</option>
                    </select>
                </label>
            </div>
        </div>
    );
};

export default SearchBar;
