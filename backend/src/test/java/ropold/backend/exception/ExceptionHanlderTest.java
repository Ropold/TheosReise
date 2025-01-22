package ropold.backend.exception;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.mock.web.MockMultipartFile;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ExceptionHandlerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void whenLessonNotFoundException_thenReturnsNotFound() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/theos-reise/{id}", "non-existing-id"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("non-existing-id"));
    }

    @Test
    void whenValidationFails_thenReturnsBadRequest() throws Exception {
        MockMultipartFile invalidLessonModelDto = new MockMultipartFile(
                "lessonModelDto",
                "",
                "application/json",
                """
                {
                    "count": 1,
                    "title": "A",
                    "description": "   ",
                    "category": "BEGINNER"
                }
                """.getBytes()
        );

        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/theos-reise")
                        .file(invalidLessonModelDto))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").value("Title must contain at least 3 characters"))
                .andExpect(jsonPath("$.description").value("must not be blank"));
    }

    @Test
    void whenImageDeletionFails_thenReturnsInternalServerError() throws Exception {
        // Simuliere ein Szenario, in dem `ImageDeletionException` ausgelöst wird.
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/theos-reise/{id}", "lesson-with-deletion-error"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value("No Lesson found with ID: lesson-with-deletion-error"));
    }


}
