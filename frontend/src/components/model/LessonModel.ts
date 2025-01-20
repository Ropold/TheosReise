import { Category } from "./Category.ts";

export type LessonModel = {
    id: string;
    isActive: boolean;
    count: number;
    title: string;
    description: string;
    category: Category;
    imageUrl: string;
}

