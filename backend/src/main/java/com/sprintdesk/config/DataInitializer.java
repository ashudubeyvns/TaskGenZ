package com.sprintdesk.config;

import com.sprintdesk.entity.Sprint;
import com.sprintdesk.entity.Task;
import com.sprintdesk.entity.User;
import com.sprintdesk.repository.SprintRepository;
import com.sprintdesk.repository.TaskRepository;
import com.sprintdesk.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Configuration
public class DataInitializer {
    @Bean CommandLineRunner seed(UserRepository users,SprintRepository sprints,TaskRepository tasks,PasswordEncoder encoder){
        return args->{
            User admin=users.findByUsername("admin").orElseGet(()->{User u=new User();u.setUsername("admin");u.setEmail("admin@sprintdesk.local");u.setPasswordHash(encoder.encode("admin123"));u.setName("SprintDesk Admin");u.setAvatar("https://i.pravatar.cc/150?img=12");return users.save(u);});
            User ash=users.findByUsername("ashutosh").orElseGet(()->{User u=new User();u.setUsername("ashutosh");u.setEmail("ashutosh@sprintdesk.local");u.setPasswordHash(encoder.encode("ashutosh123"));u.setName("Ashutosh Dubey");u.setAvatar("https://i.pravatar.cc/150?img=11");return users.save(u);});
            if(sprints.count()==0){for(int i=1;i<=3;i++){Sprint s=new Sprint();s.setName("Sprint "+i);s.setStartDate(LocalDate.now().minusDays(21L-(i-1)*7));s.setEndDate(LocalDate.now().plusDays(i==3?7:0));sprints.save(s);}}
            if(tasks.count()==0){Sprint sprint=sprints.findById(3L).orElse(sprints.findAll().getFirst()); Instant now=Instant.now(); tasks.saveAll(List.of(
                make("Design dashboard wireframes","Prepare responsive dashboard layout and information hierarchy.",Task.Status.done,Task.Priority.high,admin,sprint,LocalDate.now().minusDays(2),1,now),
                make("Implement authentication","Connect login, refresh token and protected routes.",Task.Status.in_progress,Task.Priority.high,ash,sprint,LocalDate.now().plusDays(2),1,now),
                make("Create Kanban interactions","Enable drag and drop between workflow columns.",Task.Status.review,Task.Priority.medium,admin,sprint,LocalDate.now().plusDays(4),1,now),
                make("Build analytics widgets","Add status, priority and sprint velocity charts.",Task.Status.backlog,Task.Priority.medium,ash,sprint,LocalDate.now().plusDays(6),1,now),
                make("Add task comments","Persist task comments in MongoDB.",Task.Status.backlog,Task.Priority.low,admin,sprint,LocalDate.now().plusDays(8),2,now)
            ));}
        };
    }
    private Task make(String title,String desc,Task.Status status,Task.Priority priority,User user,Sprint sprint,LocalDate due,int order,Instant now){Task t=new Task();t.setTitle(title);t.setDescription(desc);t.setStatus(status);t.setPriority(priority);t.setAssignee(user);t.setSprint(sprint);t.setDueDate(due);t.setTaskOrder(order);t.setCreatedAt(now);t.setUpdatedAt(now);t.setCompletedAt(status==Task.Status.done?now:null);return t;}
}
