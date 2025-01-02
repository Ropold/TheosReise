package ropold.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import ropold.backend.model.LessonModel;

public interface LessonRepository extends MongoRepository<LessonModel, String> {
    // add custom search for active lessons here
}
