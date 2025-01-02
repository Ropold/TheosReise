package ropold.backend.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
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
    @GetMapping
    public LessonModel addLesson(LessonModel lessonModel) {
        return lessonService.addLesson(lessonModel);
    }


}
