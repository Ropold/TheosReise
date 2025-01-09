package ropold.backend.model;

public record LessonModel(
        String id,
        boolean isActive,
        int count,
        String title,
        String description,
        Category category,
        String imageUrl
) {
}
