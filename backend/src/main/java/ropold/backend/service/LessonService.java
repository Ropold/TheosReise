package ropold.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ropold.backend.model.LessonModel;
import ropold.backend.repository.LessonRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LessonService {

    private final IdService idService;
    private final LessonRepository lessonRepository;

    public List<LessonModel> getAllLessons() {
        return lessonRepository.findAll();
    }

    public LessonModel addLesson(LessonModel lessonModel) {
        LessonModel newLessonModel = new LessonModel(
                idService.generateRandomId(),
                lessonModel.count(),
                lessonModel.title(),
                lessonModel.description(),
                lessonModel.category(),
                lessonModel.isActive(),
                lessonModel.imageUrl()
        );
        return lessonRepository.save(newLessonModel);
    }

}
