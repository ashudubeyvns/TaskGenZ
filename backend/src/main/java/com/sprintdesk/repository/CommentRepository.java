package com.sprintdesk.repository;
import com.sprintdesk.entity.CommentDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
public interface CommentRepository extends MongoRepository<CommentDocument, Long> {
    List<CommentDocument> findByTaskIdOrderByCreatedAtAsc(Long taskId);
    void deleteByTaskId(Long taskId);
}
