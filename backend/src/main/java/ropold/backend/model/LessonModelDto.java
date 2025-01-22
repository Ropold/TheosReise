package ropold.backend.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LessonModelDto(
        int count,

        @NotBlank
        @Size(min = 3, message = "Title must contain at least 3 characters")
        String title,

        @NotBlank
        @Size(min = 3, message = "Description must contain at least 3 characters")
        String description,
        Category category,
        String imageUrl
) {
}
