package com.sprintdesk.repository;
import com.sprintdesk.entity.Sprint;
import org.springframework.data.jpa.repository.JpaRepository;
public interface SprintRepository extends JpaRepository<Sprint, Long> {}
