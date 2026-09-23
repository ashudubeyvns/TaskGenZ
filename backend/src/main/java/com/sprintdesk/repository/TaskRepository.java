package com.sprintdesk.repository;
import com.sprintdesk.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findAllByOrderByStatusAscTaskOrderAsc();
    long countByStatus(Task.Status status);
    int countByStatusAndSprintId(Task.Status status, Long sprintId);
}
