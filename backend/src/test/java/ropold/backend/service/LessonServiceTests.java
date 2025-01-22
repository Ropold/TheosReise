package ropold.backend.service;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import ropold.backend.model.Category;
import ropold.backend.model.LessonModel;
import ropold.backend.repository.LessonRepository;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
class LessonServiceTests {

    IdService idService = mock(IdService.class);
    LessonRepository lessonRepository = mock(LessonRepository.class);
    CloudinaryService cloudinaryService = mock(CloudinaryService.class);
    LessonService lessonService = new LessonService(idService, lessonRepository, cloudinaryService );

    // LESSON DATA
    LessonModel lessonModel1 = new LessonModel("1", true, 1, "Testlesson", "test description", Category.BEGINNER, "testImageUrl");
    LessonModel lessonModel2 = new LessonModel("2", true, 2, "Testlesson2", "test description2", Category.INTERMEDIATE, "testImageUrl2");
    List<LessonModel> lessons = List.of(lessonModel1, lessonModel2);


    @Test
    void getActiveRooms() {
        // Given
        when(lessonRepository.findAll()).thenReturn(lessons);
        List<LessonModel> expected = List.of(lessonModel1, lessonModel2);

        // When
        List<LessonModel> actual = lessonService.getActiveLessons();

        // Then
        assertEquals(expected, actual);
    }

    @Test
    void toggleActiveStatus() {
        // Given
        LessonModel existingLesson = new LessonModel(
                "1", true, 1, "Testlesson", "test description", Category.BEGINNER, "testImageUrl"
        );

        LessonModel updatedLesson = new LessonModel(
                "1", false, 1, existingLesson.title(), existingLesson.description(),
                existingLesson.category(), existingLesson.imageUrl()
        );

        when(lessonRepository.findById("1")).thenReturn(Optional.of(existingLesson));
        when(lessonRepository.save(any(LessonModel.class))).thenReturn(updatedLesson);

        // When
        LessonModel result = lessonService.toggleActiveStatus("1");

        // Then
        assertEquals(updatedLesson, result);
        assertEquals(false, result.isActive()); // Verify the active status was toggled
        verify(lessonRepository).findById("1");
        verify(lessonRepository).save(updatedLesson);
    }



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
    void getLessonById() {
        // Given
        when(lessonRepository.findById("1")).thenReturn(java.util.Optional.of(lessonModel1));

        // When
        LessonModel expected = lessonService.getLessonById("1");

        // Then
        assertEquals(expected, lessonModel1);
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

    @Test
    void updateLessonWithPut() {
        // Given
        LessonModel lessonModel4 = new LessonModel("4", true, 4, "Testlesson4", "test description4", Category.ADVANCED, "testImageUrl4");

        LessonModel newLesson = new LessonModel("4", true, 4, "Testlesson4", "test description4", Category.ADVANCED, "testImageUrl4");

        when(lessonRepository.existsById("4")).thenReturn(true);
        when(lessonRepository.save(any(LessonModel.class))).thenReturn(newLesson);

        // When
        LessonModel expected = lessonService.updateLessonWithPut("4", lessonModel4);

        // Then
        assertEquals(newLesson, expected);
        assertEquals(lessonModel4.id(), expected.id());
        assertEquals(lessonModel4.isActive(), expected.isActive());
        assertEquals(lessonModel4.count(), expected.count());
        assertEquals(lessonModel4.title(), expected.title());
        assertEquals(lessonModel4.description(), expected.description());
        assertEquals(lessonModel4.category(), expected.category());
        assertEquals(lessonModel4.imageUrl(), expected.imageUrl());
    }

    @Test
    void deleteRoomWithImage() {
        // Given
        String fixedId = "1";
        when(lessonRepository.findById(fixedId)).thenReturn(Optional.of(lessonModel1));

        // When
        lessonService.deleteLesson(fixedId);

        // Then
        verify(lessonRepository).deleteById(fixedId);
        verify(lessonRepository).findById(fixedId);
        verify(cloudinaryService).deleteImage(lessonModel1.imageUrl());
    }

    @Test
    void deleteRoomWithoutImage() {
        // Given
        LessonModel lessonWithoutImage = new LessonModel(
                "2", true, 2, "Testlesson2", "test description2", Category.INTERMEDIATE, null
        );

        String fixedId = "2";
        when(lessonRepository.findById(fixedId)).thenReturn(Optional.of(lessonWithoutImage));

        // When
        lessonService.deleteLesson(fixedId);

        // Then
        verify(lessonRepository).deleteById(fixedId);
        verify(lessonRepository).findById(fixedId);
        verify(cloudinaryService, never()).deleteImage(any());
    }

}
