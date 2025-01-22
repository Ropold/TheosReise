package ropold.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ropold.backend.model.LessonModel;
import ropold.backend.model.LessonModelDto;
import ropold.backend.service.CloudinaryService;
import ropold.backend.service.LessonService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/theos-reise")
@RequiredArgsConstructor
public class LessonController {

    private final LessonService lessonService;
    private final CloudinaryService cloudinaryService;

    @GetMapping()
    public List<LessonModel> getAllLessons() {
        return lessonService.getAllLessons();
    }

    @GetMapping("/{id}")
    public LessonModel getLessonById(@PathVariable String id) {
        return lessonService.getLessonById(id);
    }

    @GetMapping("/active")
    public List<LessonModel> getActiveLessons() {
        return lessonService.getActiveLessons();
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public LessonModel postRoom(
            @RequestPart("lessonModelDto") @Valid LessonModelDto lessonModelDto,
            @RequestPart(value = "image", required = false) MultipartFile image) throws IOException {

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = cloudinaryService.uploadImage(image);
        }

        return lessonService.addLesson(
                new LessonModel(
                        null,
                        true,
                        lessonModelDto.count(),
                        lessonModelDto.title(),
                        lessonModelDto.description(),
                        lessonModelDto.category(),
                        imageUrl
                )
        );
    }

    @PutMapping("/{id}")
    public LessonModel updateLesson(
            @PathVariable String id,
            @RequestPart("lessonModelDto") @Valid LessonModelDto lessonModelDto,
            @RequestPart(value = "image", required = false) MultipartFile image) throws IOException {

        LessonModel existingLesson = lessonService.getLessonById(id);

        String newImageUrl;
        if (image != null && !image.isEmpty()) {
            if (existingLesson.imageUrl() != null) {
                cloudinaryService.deleteImage(existingLesson.imageUrl());
            }
            newImageUrl = cloudinaryService.uploadImage(image);
        } else {
            newImageUrl = existingLesson.imageUrl();
        }

        LessonModel updatedLesson = new LessonModel(
                id,
                existingLesson.isActive(),
                lessonModelDto.count(),
                lessonModelDto.title(),
                lessonModelDto.description(),
                lessonModelDto.category(),
                newImageUrl
        );

        return lessonService.updateLessonWithPut(id, updatedLesson);
    }



    @PutMapping("/{id}/toggle-active")
    public LessonModel toggleActiveStatus(@PathVariable String id) {
        return lessonService.toggleActiveStatus(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteLesson(@PathVariable String id){
        lessonService.deleteLesson(id);
    }

}
