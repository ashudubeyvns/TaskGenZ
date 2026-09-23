package com.sprintdesk.service;

import com.sprintdesk.dto.CommonDtos;
import com.sprintdesk.entity.NotificationDocument;
import com.sprintdesk.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;

@Service
public class NotificationService {
    private final NotificationRepository repository;
    public NotificationService(NotificationRepository repository){this.repository=repository;}
    public NotificationDocument create(Long userId,String type,String title,String message){
        NotificationDocument n=new NotificationDocument();
        n.setId(System.currentTimeMillis()*1000 + (long)(Math.random()*1000)); n.setUserId(userId); n.setType(type); n.setTitle(title); n.setMessage(message); n.setCreatedAt(Instant.now()); n.setRead(false); return repository.save(n);
    }
    public List<CommonDtos.NotificationResponse> list(Long userId){
        return repository.findTop50ByUserIdOrderByCreatedAtDesc(userId).stream().map(this::toDto).toList();
    }
    public void markRead(Long userId,Long id){ repository.findById(id).filter(n->n.getUserId().equals(userId)).ifPresent(n->{n.setRead(true); repository.save(n);}); }
    public void markAllRead(Long userId){ repository.findTop50ByUserIdOrderByCreatedAtDesc(userId).forEach(n->{n.setRead(true); repository.save(n);}); }
    public void remove(Long userId,Long id){ repository.findById(id).filter(n->n.getUserId().equals(userId)).ifPresent(repository::delete); }
    private CommonDtos.NotificationResponse toDto(NotificationDocument n){return new CommonDtos.NotificationResponse(n.getId(),n.getType(),n.getTitle(),n.getMessage(),n.getCreatedAt(),n.isRead());}
}
