const connection = require("../database")
const {promisify} = require("util");

const query = promisify(connection.query).bind(connection);

exports.createInterview = async (req, res) => {
    try {
    const {users, startTime, endTime} = req.body;
    if(!users || !startTime || !endTime)
        throw new Error("All feilds are not available in request body");
    
        if(users.length < 2)
            throw new Error("Interview Should have atleast 2 candidates.");

        const userString = users.join(", ");

        const queryFindCollision = `SELECT * FROM
        user U
        INNER JOIN
        interview INTER ON U.id = INTER.user_id
        INNER JOIN
        interview_scheduled INTERS ON INTER.interview_scheduled_id = INTERS.id
        WHERE U.id in (${userString})
        AND
        (
            (INTERS.start_time <= "${startTime}" AND INTERS.end_time >= "${startTime}")
            OR
            (INTERS.start_time <= "${endTime}" AND INTERS.end_time >= "${endTime}")
        );`;

        const rows = await query(queryFindCollision);

        if(rows.length>0)
        {
           let users = [];
           rows.forEach(element => {
               users.push(element.username);
           });
           
           throw new Error(`${users.join(', ')} Have another interview scheduled between this interview`)
        }

        const queryCreateInterviewSchedule = `INSERT INTO interview_scheduled (start_time, end_time)
        VALUES ("${startTime}", "${endTime}");`
        
        const rowNewInterviewSchedule = await query(queryCreateInterviewSchedule);
       let values = [];
       users.forEach(el => {
            values.push([el, rowNewInterviewSchedule.insertId]);
       });

       const queryInsertInterviews = `INSERT INTO interview (user_id, interview_scheduled_id) VALUES ?`;

       const rowInsertInterviews = await query(queryInsertInterviews, [values]);

       const queryNewinterview = `SELECT * FROM interview_scheduled WHERE ID = ${rowNewInterviewSchedule.insertId}`;
       const queryGetInterviewUsers = `SELECT id, username, email, role FROM user WHERE id IN (SELECT user_id FROM interview WHERE interview_scheduled_id = ${rowNewInterviewSchedule.insertId});`;

       const rowNewinterview = await query(queryNewinterview);
       const rowGetInterviewUsers = await query(queryGetInterviewUsers);

       res.status(201).json({
           status: "success",
           data: {
            interviewScheduled: rowNewinterview[0],
            interviewUsers: rowGetInterviewUsers
           }
       });
    } catch(err)
    {
        res.status(401).json({
            status: "failed",
            message: err.message
        })
    }
}

exports.getAllIncomingInterviews = async (req, res) => {
    try {
    const queryGetIncomingInterview = `SELECT * FROM interview_scheduled WHERE start_time >= NOW()`;

    const rowsGetIncomingInterview = await query(queryGetIncomingInterview);

    res.status(200).json({
        status: "success",
        data: rowsGetIncomingInterview
    })
    } catch(err) {
        res.status(400).json({
            status: "failed",
            message: "Cannot get upcoming interviews."
        })
    }
}

exports.updateInterview = async (req, res) => {
    try {
    const {interviewId, addNewUsers, removeUsers, startTime, endTime} = req.body;

    //Validating
    const queryCurrentInterviews = `SELECT user_id FROM interview WHERE interview_scheduled_id=${interviewId}`;
    const rowCurrentInterviews =await query(queryCurrentInterviews);
    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }
    
      //allNewInterviewUsers will contain all of the users that are going to have this perticular interview
      let allNewInterviewUsers = [];
      rowCurrentInterviews.forEach(el => {
          allNewInterviewUsers.push(el.user_id);
      });

      allNewInterviewUsers = [...allNewInterviewUsers, ...addNewUsers];
      allNewInterviewUsers = allNewInterviewUsers.filter(onlyUnique);
      allNewInterviewUsers = allNewInterviewUsers.filter(el => !removeUsers.includes(`${el}`));

    //   console.log(removeUsers);
    //   console.log(allNewInterviewUsers);

      if(allNewInterviewUsers.length < 2)
        throw new Error('Interview Must have atleast 2 users, Update failed!');

    const userString = addNewUsers.join(", ");

    const queryFindCollision = `SELECT * FROM
    user U
    INNER JOIN
    interview INTER ON U.id = INTER.user_id
    INNER JOIN
    interview_scheduled INTERS ON INTER.interview_scheduled_id = INTERS.id
    WHERE U.id in (${userString})
    AND
    (
        (INTERS.start_time <= "${startTime}" AND INTERS.end_time >= "${startTime}")
        OR
        (INTERS.start_time <= "${endTime}" AND INTERS.end_time >= "${endTime}")
    );`;

    //Updating interview_scheduled
    const queryUpdateInterviewScheduled = `UPDATE interview_scheduled SET start_time="${startTime}",end_time="${endTime}" WHERE id=${interviewId}`;
    const rowUpdatedInterviedScheduled = await query(queryUpdateInterviewScheduled);

    //Adding New users to interview
    let newUsers = [];

    addNewUsers.forEach(el => {
        newUsers.push([el, interviewId]);
    });

    const queryInsertInterView =  `INSERT INTO interview (user_id, interview_scheduled_id) VALUES ?`;
    let rowInsetInterView;
    if(newUsers.length>0)
        rowInsetInterView = await query(queryInsertInterView, [newUsers]);

    //Removing Users
    const queryRemoveInterview = `DELETE FROM interview WHERE user_id IN ?`;
    let rowRemoveInterview;
    if(removeUsers.length>0)
    rowRemoveInterview = await query(queryRemoveInterview, [[removeUsers]])

    const queryNewinterview = `SELECT * FROM interview_scheduled WHERE id = ${interviewId}`;
       const queryGetInterviewUsers = `SELECT id, username, email, role FROM user WHERE id IN (SELECT user_id FROM interview WHERE interview_scheduled_id = ${interviewId});`;

       const rowNewinterview = await query(queryNewinterview);
       const rowGetInterviewUsers = await query(queryGetInterviewUsers);

       res.status(201).json({
           status: "success",
           data: {
            interviewScheduled: rowNewinterview[0],
            interviewUsers: rowGetInterviewUsers
           }
       });
    } catch(err) {
        res.status(400).json({
            status: "failed",
            message: err.message
        });
    }

}

exports.getInterview = async (req, res) => {
    try {
        const queryGetInterview = `SELECT * FROM interview_scheduled WHERE id=${req.params.interviewId}`;
        const rowGetInterview = await query(queryGetInterview);
        if(rowGetInterview.length < 1)
            throw new Error('No Interview exists');

        const queryGetInterviewUser = `SELECT U.username, U.email, U.role, U.id FROM user U INNER JOIN  interview INTER ON U.id=INTER.user_id WHERE INTER.interview_scheduled_id = ${req.params.interviewId} `;
        const rowGetInterviewUser = await query(queryGetInterviewUser);

        res.status(200).json({
            status: "success",
            data:{
                interview: rowGetInterview[0],
                users: rowGetInterviewUser
            }
        })
    } catch(err) {
        res.status(400).json({
            status: "failed",
            message: err.message
        });
    }
}

//Things left
//Update functionality