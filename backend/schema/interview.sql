CREATE TABLE interview(
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    interview_scheduled_id INT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY(interview_scheduled_id) REFERENCES interview_scheduled(id) ON DELETE CASCADE
);