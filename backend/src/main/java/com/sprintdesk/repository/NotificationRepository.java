package com.sprintdesk.repository;
import com.sprintdesk.entity.NotificationDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
public interface NotificationRepository extends MongoRepository<NotificationDocument, Long> {
    List<NotificationDocument> findTop50ByUserIdOrderByCreatedAtDesc(Long userId);
}
