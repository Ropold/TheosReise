package ropold.backend.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import ropold.backend.model.Category;
import ropold.backend.model.LessonModel;
import ropold.backend.repository.LessonRepository;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class LessonControllerIntegrationTests {

    static LessonModel lessonModel;

    @Autowired
    MockMvc mockMvc;

    @Autowired
    LessonRepository lessonRepository;

    @BeforeEach
    void setup() {
        lessonRepository.deleteAll();

        lessonModel = new LessonModel(
                "1",
                true,
                1,
                "Testlesson",
                "test description",
                Category.BEGINNER,
                "testImageUrl"
        );

        lessonRepository.save(lessonModel);
    }

    @Test
    void getAllLessons_expectListWithOneLesson_whenOneLessonSaved() throws Exception {
        // WHEN
        mockMvc.perform(
                        MockMvcRequestBuilders.get("/api/lesson")
                )
                // THEN
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().json("""
                [
                    {
                        "id": "1",
                        "isActive": true,
                        "count": 1,
                        "title": "Testlesson",
                        "description": "test description",
                        "category": "BEGINNER",
                        "imageUrl": "testImageUrl"
                    }
                ]
            """));
    }


}