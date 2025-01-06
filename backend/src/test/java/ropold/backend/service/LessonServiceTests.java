package ropold.backend.service;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import ropold.backend.model.Category;
import ropold.backend.model.LessonModel;
import ropold.backend.repository.LessonRepository;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@SpringBootTest
class LessonServiceTests {

    IdService idService = mock(IdService.class);
    LessonRepository lessonRepository = mock(LessonRepository.class);
    LessonService lessonService = new LessonService(idService, lessonRepository);

    // LESSON DATA
    LessonModel lessonModel1 = new LessonModel("1", true, 1, "Testlesson", "test description", Category.BEGINNER, "testImageUrl");
    LessonModel lessonModel2 = new LessonModel("2", true, 2, "Testlesson2", "test description2", Category.INTERMEDIATE, "testImageUrl2");
    List<LessonModel> lessons = List.of(lessonModel1, lessonModel2);

    @Test
    void getAllLessons() {
        // Given
        when(lessonRepository.findAll()).thenReturn(lessons);

        // When
        List<LessonModel> expected = lessonService.getAllLessons();

        // Then
        assertEquals(expected, lessons);
    }

    @Test
    void addLesson() {
        // Given
        LessonModel lessonModel3 = new LessonModel("3", true, 3, "Testlesson3", "test description3", Category.ADVANCED, "testImageUrl3");

        LessonModel newLesson = new LessonModel("3", true, 3, "Testlesson3", "test description3", Category.ADVANCED, "testImageUrl3");

        when(idService.generateRandomId()).thenReturn("3");
        when(lessonRepository.save(any(LessonModel.class))).thenReturn(newLesson);

        // When
        LessonModel expected = lessonService.addLesson(lessonModel3);

        // Then
        assertEquals(newLesson, expected);
        assertEquals(lessonModel3.id(), expected.id());
        assertEquals(lessonModel3.isActive(), expected.isActive());
        assertEquals(lessonModel3.count(), expected.count());
        assertEquals(lessonModel3.title(), expected.title());
        assertEquals(lessonModel3.description(), expected.description());
        assertEquals(lessonModel3.category(), expected.category());
        assertEquals(lessonModel3.imageUrl(), expected.imageUrl());

    }

}
