INSERT INTO interview(user_id, interview_scheduled_id)
VALUES (8, 1);

//8 7 6  start_time=2021-12-17 15:30:00 end_time=2021-12-17 16:30:00

SELECT COUNT(*) FROM
user U
INNER JOIN
interview INTER ON U.id = INTER.user_id
INNER JOIN
interview_scheduled INTERS ON INTER.interview_scheduled_id = INTERS.id
WHERE U.id in (8, 7, 6)
AND
(
    (INTERS.start_time <= "2021-12-17 15:30:00" AND INTERS.end_time >= "2021-12-17 15:30:00")
    OR
    (INTERS.start_time <= "2021-12-17 16:30:00" AND INTERS.end_time >= "2021-12-17 16:30:00")
);