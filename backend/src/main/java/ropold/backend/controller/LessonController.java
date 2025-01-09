package ropold.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import ropold.backend.model.LessonModel;
import ropold.backend.model.LessonModelDto;
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

    @GetMapping("/{id}")
    public LessonModel getLessonById(@PathVariable String id) {
        return lessonService.getLessonById(id);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public LessonModel addLesson(@RequestBody LessonModelDto lessonModelDto) {
        return lessonService.addLesson(
                new LessonModel(
                        null,
                        true,
                        lessonModelDto.count(),
                        lessonModelDto.title(),
                        lessonModelDto.description(),
                        lessonModelDto.category(),
                        lessonModelDto.imageUrl()
                )
        );
    }


    @PutMapping("/{id}")
    public LessonModel putLesson(@PathVariable String id, @RequestBody LessonModelDto lessonModelDto){
        return lessonService.updateLessonWithPut(id,
                new LessonModel(
                        id,
                        true,
                        lessonModelDto.count(),
                        lessonModelDto.title(),
                        lessonModelDto.description(),
                        lessonModelDto.category(),
                        lessonModelDto.imageUrl()
                ));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteLesson(@PathVariable String id){
        lessonService.deleteLesson(id);
    }

}
