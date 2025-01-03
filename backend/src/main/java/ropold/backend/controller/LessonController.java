package ropold.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import ropold.backend.model.LessonModel;
import ropold.backend.service.LessonService;

import java.util.List;

@RestController
@RequestMapping("/api/lesson")
@RequiredArgsConstructor
public class LessonController {

    private final LessonService lessonService;

    @GetMapping()
    public List<LessonModel> getAllLessons() {
        return lessonService.getAllLessons();
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public LessonModel addLesson(@RequestBody LessonModel lessonModel) {
        return lessonService.addLesson(
                new LessonModel(
                        null,
                        true,
                        lessonModel.count(),
                        lessonModel.title(),
                        lessonModel.description(),
                        lessonModel.category(),
                        lessonModel.imageUrl()
                )
        );
    }

    @PutMapping("/{id}")
    public LessonModel putLesson(@PathVariable String id, @RequestBody LessonModel lessonModel){
        return lessonService.updateLessonWithPut(id,
                new LessonModel(
                        id,
                        lessonModel.isActive(),
                        lessonModel.count(),
                        lessonModel.title(),
                        lessonModel.description(),
                        lessonModel.category(),
                        lessonModel.imageUrl()
                ));
    }

    @DeleteMapping("/{id}")
    public void deleteLesson(@PathVariable String id){
        lessonService.deleteLesson(id);
    }

}
