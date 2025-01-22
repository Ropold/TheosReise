package ropold.backend.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.Uploader;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import ropold.backend.model.Category;
import ropold.backend.model.LessonModel;
import ropold.backend.repository.LessonRepository;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class LessonControllerIntegrationTests {

    static LessonModel lessonModel;

    @MockBean
    private Cloudinary cloudinary;

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
    void postLesson_shouldReturnSavedLesson() throws Exception {
        // GIVEN: Leere Datenbank
        lessonRepository.deleteAll();

        Uploader mockUploader = mock(Uploader.class);
        when(mockUploader.upload(any(), anyMap())).thenReturn(Map.of("secure_url", "https://www.test.de/test-image.jpg"));
        when(cloudinary.uploader()).thenReturn(mockUploader);

        // WHEN: Eine POST-Anfrage wird ausgeführt
        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/theos-reise")
                        .file(new MockMultipartFile("image", "lesson.jpg", "image/jpeg", "test image".getBytes()))
                        .file(new MockMultipartFile("lessonModelDto", "", "application/json", """
                {
                    "count": 5,
                    "title": "Neue Lektion",
                    "description": "Dies ist eine neue Lektion.",
                    "category": "INTERMEDIATE",
                    "imageUrl": "https://www.test.de/test-image.jpg"
                }
                """.getBytes())))
                // THEN: Es wird erwartet, dass der Status 201 (Created) zurückgegeben wird
                .andExpect(status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(org.hamcrest.Matchers.matchesPattern("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$")))
                .andExpect(MockMvcResultMatchers.jsonPath("$.isActive").value(true))
                .andExpect(MockMvcResultMatchers.jsonPath("$.count").value(5))
                .andExpect(MockMvcResultMatchers.jsonPath("$.title").value("Neue Lektion"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.description").value("Dies ist eine neue Lektion."))
                .andExpect(MockMvcResultMatchers.jsonPath("$.category").value("INTERMEDIATE"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.imageUrl").value("https://www.test.de/test-image.jpg"));

        // THEN: Verifizieren, dass die Lektion in der Datenbank gespeichert wurde
        List<LessonModel> allLessons = lessonRepository.findAll();
        Assertions.assertEquals(1, allLessons.size());

        LessonModel savedLesson = allLessons.get(0);
        org.assertj.core.api.Assertions.assertThat(savedLesson)
                .usingRecursiveComparison()
                .ignoringFields("id") // Ignoriert das generierte ID-Feld
                .isEqualTo(new LessonModel(
                        null,  // ID wird automatisch generiert
                        true,
                        5,
                        "Neue Lektion",
                        "Dies ist eine neue Lektion.",
                        Category.INTERMEDIATE,
                        "https://www.test.de/test-image.jpg"
                ));
    }

    @Test
    void putLesson_shouldUpdateLessonDetails() throws Exception {
        // GIVEN
        Uploader mockUploader = mock(Uploader.class);
        when(mockUploader.upload(any(), anyMap())).thenReturn(Map.of("secure_url", "https://www.updated-image.com/"));
        when(cloudinary.uploader()).thenReturn(mockUploader);

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/theos-reise/1")
                        .file(new MockMultipartFile("image", "lesson.jpg", "image/jpeg", "updated image".getBytes()))
                        .file(new MockMultipartFile("lessonModelDto", "", "application/json", """
                {
                    "count": 2,
                    "title": "Updated Lesson",
                    "description": "This is an updated description.",
                    "category": "INTERMEDIATE"
                }
                """.getBytes()))
                        .contentType("multipart/form-data")
                        .with(request -> {
                            request.setMethod("PUT");
                            return request;
                        }))
                // THEN
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value("1"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.isActive").value(true))
                .andExpect(MockMvcResultMatchers.jsonPath("$.count").value(2))
                .andExpect(MockMvcResultMatchers.jsonPath("$.title").value("Updated Lesson"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.description").value("This is an updated description."))
                .andExpect(MockMvcResultMatchers.jsonPath("$.category").value("INTERMEDIATE"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.imageUrl").value("https://www.updated-image.com/"));

        // Verify database state
        LessonModel updatedLesson = lessonRepository.findById("1").orElseThrow();
        Assertions.assertEquals("Updated Lesson", updatedLesson.title());
        Assertions.assertEquals("https://www.updated-image.com/", updatedLesson.imageUrl());
        Assertions.assertEquals("This is an updated description.", updatedLesson.description());
        Assertions.assertEquals(Category.INTERMEDIATE, updatedLesson.category());
    }

    @Test
    void deleteLesson_shouldRemoveLessonFromRepository() throws Exception {
        // GIVEN
        Uploader mockUploader = mock(Uploader.class);
        when(mockUploader.destroy(any(), anyMap())).thenReturn(Map.of("result", "ok"));
        when(cloudinary.uploader()).thenReturn(mockUploader);

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/theos-reise/{id}", "1"))
                .andExpect(status().isNoContent());

        // THEN
        Assertions.assertFalse(lessonRepository.existsById("1"));

        // Verify image deletion from Cloudinary
        verify(mockUploader).destroy(eq("testImageUrl"), anyMap());
    }




}