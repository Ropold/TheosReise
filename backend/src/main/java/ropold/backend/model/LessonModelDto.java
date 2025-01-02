package ropold.backend.model;

public record LessonModelDto(
        int count,
        String title,
        String description,
        Category category,
        String imageUrl
) {
}
