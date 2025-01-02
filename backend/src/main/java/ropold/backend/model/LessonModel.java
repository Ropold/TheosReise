package ropold.backend.model;

import java.util.List;

public record LessonModel(
        String id,
        int count,
        String title,
        String description,
        Category category,
        boolean isActive,
        String imageUrl
) {
}
