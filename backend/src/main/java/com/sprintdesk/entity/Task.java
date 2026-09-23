package com.sprintdesk.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name="tasks")
public class Task {
    public enum Status { backlog, in_progress, review, done }
    public enum Priority { low, medium, high }
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @Column(nullable=false, length=180) private String title;
    @Column(nullable=false, columnDefinition="TEXT") private String description;
    @Enumerated(EnumType.STRING) @Column(nullable=false, length=30) private Status status;
    @Enumerated(EnumType.STRING) @Column(nullable=false, length=20) private Priority priority;
    @ManyToOne(fetch=FetchType.EAGER, optional=false) private User assignee;
    @ManyToOne(fetch=FetchType.EAGER, optional=false) private Sprint sprint;
    @Column(nullable=false) private LocalDate dueDate;
    @Column(nullable=false) private Integer taskOrder;
    @Column(nullable=false) private Instant createdAt;
    private Instant completedAt;
    @Column(nullable=false) private Instant updatedAt;
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getTitle(){return title;} public void setTitle(String title){this.title=title;}
    public String getDescription(){return description;} public void setDescription(String description){this.description=description;}
    public Status getStatus(){return status;} public void setStatus(Status status){this.status=status;}
    public Priority getPriority(){return priority;} public void setPriority(Priority priority){this.priority=priority;}
    public User getAssignee(){return assignee;} public void setAssignee(User assignee){this.assignee=assignee;}
    public Sprint getSprint(){return sprint;} public void setSprint(Sprint sprint){this.sprint=sprint;}
    public LocalDate getDueDate(){return dueDate;} public void setDueDate(LocalDate dueDate){this.dueDate=dueDate;}
    public Integer getTaskOrder(){return taskOrder;} public void setTaskOrder(Integer taskOrder){this.taskOrder=taskOrder;}
    public Instant getCreatedAt(){return createdAt;} public void setCreatedAt(Instant createdAt){this.createdAt=createdAt;}
    public Instant getCompletedAt(){return completedAt;} public void setCompletedAt(Instant completedAt){this.completedAt=completedAt;}
    public Instant getUpdatedAt(){return updatedAt;} public void setUpdatedAt(Instant updatedAt){this.updatedAt=updatedAt;}
}
