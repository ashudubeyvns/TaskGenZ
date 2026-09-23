package com.sprintdesk.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document(collection="notifications")
public class NotificationDocument {
    @Id private Long id;
    private Long userId;
    private String type;
    private String title;
    private String message;
    private Instant createdAt;
    private boolean read;
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public Long getUserId(){return userId;} public void setUserId(Long userId){this.userId=userId;}
    public String getType(){return type;} public void setType(String type){this.type=type;}
    public String getTitle(){return title;} public void setTitle(String title){this.title=title;}
    public String getMessage(){return message;} public void setMessage(String message){this.message=message;}
    public Instant getCreatedAt(){return createdAt;} public void setCreatedAt(Instant createdAt){this.createdAt=createdAt;}
    public boolean isRead(){return read;} public void setRead(boolean read){this.read=read;}
}
