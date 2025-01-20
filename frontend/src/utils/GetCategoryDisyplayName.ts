type Category = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export function getCategoryDisplayName(category: Category): string {
    const categoryDisplayNames: Record<Category, string> = {
        BEGINNER: "Anfänger",
        INTERMEDIATE: "Mittelstufe",
        ADVANCED: "Fortgeschritten",
    };
    return categoryDisplayNames[category];
}