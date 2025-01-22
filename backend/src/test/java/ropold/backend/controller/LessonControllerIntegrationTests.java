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
class LessonControllerIntegrationTests {

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
                        MockMvcRequestBuilders.get("/api/theos-reise")
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

    @Test
    void getLessonById_returnLessonWithId1_whenLessonWithId1Saved() throws Exception {
        // WHEN
        mockMvc.perform(
                        MockMvcRequestBuilders.get("/api/theos-reise/1")
                )
                // THEN
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().json("""
                {
                    "id": "1",
                    "isActive": true,
                    "count": 1,
                    "title": "Testlesson",
                    "description": "test description",
                    "category": "BEGINNER",
                    "imageUrl": "testImageUrl"
                }
            """));
    }

    @Test
    void postLesson_expectLessonWithValidId_whenLessonSaved() throws Exception {
        // GIVEN
        lessonRepository.deleteAll();

        // WHEN
        mockMvc.perform(
                        MockMvcRequestBuilders.post("/api/theos-reise")
                                .contentType("application/json")
                                .content("""
                            {
                                "count": 2,
                                "title": "Testlesson2",
                                "description": "test description2",
                                "category": "BEGINNER",
                                "imageUrl": "testImageUrl2"
                            }
                        """)
                )
                // THEN
                .andExpect(status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").isNotEmpty()) // Überprüft, dass `id` existiert
                .andExpect(MockMvcResultMatchers.jsonPath("$.isActive").value(true))
                .andExpect(MockMvcResultMatchers.jsonPath("$.count").value(2))
                .andExpect(MockMvcResultMatchers.jsonPath("$.title").value("Testlesson2"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.description").value("test description2"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.category").value("BEGINNER"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.imageUrl").value("testImageUrl2"));
    }

    @Test
    void putLesson_expectUpdatedLesson_whenLessonExists() throws Exception {
        // WHEN
        mockMvc.perform(
                        MockMvcRequestBuilders.put("/api/theos-reise/1")
                                .contentType("application/json")
                                .content("""
                            {
                                "count": 2,
                                "title": "Testlesson2",
                                "description": "test description2",
                                "category": "BEGINNER",
                                "imageUrl": "testImageUrl2"
                            }
                        """)
                )
                // THEN
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value("1"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.isActive").value(true))
                .andExpect(MockMvcResultMatchers.jsonPath("$.count").value(2))
                .andExpect(MockMvcResultMatchers.jsonPath("$.title").value("Testlesson2"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.description").value("test description2"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.category").value("BEGINNER"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.imageUrl").value("testImageUrl2"));
    }

    @Test
    void deleteLesson_expectNoContent_whenLessonExists() throws Exception {
        // WHEN
        mockMvc.perform(
                        MockMvcRequestBuilders.delete("/api/theos-reise/1")
                )
                // THEN
                .andExpect(status().isNoContent());
    }

}