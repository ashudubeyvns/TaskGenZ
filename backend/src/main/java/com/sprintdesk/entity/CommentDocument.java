package com.sprintdesk.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document(collection="comments")
public class CommentDocument {
    @Id private Long id;
    private Long taskId;
    private Long authorId;
    private String text;
    private Instant createdAt;
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public Long getTaskId(){return taskId;} public void setTaskId(Long taskId){this.taskId=taskId;}
    public Long getAuthorId(){return authorId;} public void setAuthorId(Long authorId){this.authorId=authorId;}
    public String getText(){return text;} public void setText(String text){this.text=text;}
    public Instant getCreatedAt(){return createdAt;} public void setCreatedAt(Instant createdAt){this.createdAt=createdAt;}
}
