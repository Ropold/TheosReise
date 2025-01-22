package ropold.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ropold.backend.model.LessonModel;
import ropold.backend.repository.LessonRepository;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class LessonService {

    private final IdService idService;
    private final LessonRepository lessonRepository;

    public List<LessonModel> getAllLessons() {
        return lessonRepository.findAll();
    }

    public LessonModel getLessonById(String id) {
        return lessonRepository.findById(id).orElseThrow(() -> new NoSuchElementException("No Lesson found with Id: " + id));
    }

    public LessonModel addLesson(LessonModel lessonModel) {
        LessonModel newLessonModel = new LessonModel(
                idService.generateRandomId(),
                true,
                lessonModel.count(),
                lessonModel.title(),
                lessonModel.description(),
                lessonModel.category(),
                lessonModel.imageUrl()
        );
        return lessonRepository.save(newLessonModel);
    }

    public LessonModel updateLessonWithPut(String id, LessonModel lessonModel) {
        if(lessonRepository.existsById(id)){
            LessonModel newLessonModel = new LessonModel(
                    id,
                    lessonModel.isActive(),
                    lessonModel.count(),
                    lessonModel.title(),
                    lessonModel.description(),
                    lessonModel.category(),
                    lessonModel.imageUrl()
            );
            return lessonRepository.save(newLessonModel);
        } else {
            throw new NoSuchElementException("No Lesson found with the Put-Id:"+id);
        }
    }

    public void deleteLesson(String id) {
        lessonRepository.deleteById(id);
    }


    public List<LessonModel> getActiveLessons() {
        return lessonRepository.findAll().stream()
                .filter(LessonModel::isActive)
                .toList();
    }
}
