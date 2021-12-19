import React from 'react'
import axios from 'axios'
import User from "../User/User"
import "./EditPage.css"

function EditPage({match}) {
    const [interview, setInterview] = React.useState({});
    const [startTime, setStartTime] = React.useState('');
    const [endTime, setEndTime] = React.useState('');
    const [users, setUsers] = React.useState([]);
    const [allUser, setAllUser] = React.useState([]);
    const [addUser, setAddUser] = React.useState([]);
    const [removeUser, setRemoveUser] = React.useState([]);


    React.useEffect(function() {        
        async function getInterviewInfo()
        {
            try {
            const res = await axios.get("/interview/"+match.params.id);
            console.log(res.data)
            setInterview(res.data.data)
            setStartTime(res.data.data.interview.start_time.substring(0, res.data.data.interview.start_time.length - 1));
            setEndTime(res.data.data.interview.end_time.substring(0, res.data.data.interview.end_time.length - 1));
            setUsers(res.data.data.users);
            console.log({startTime, endTime});

            const getAllUser = await axios.get("/user");
            console.log(users)
            setAllUser(getAllUser.data.data)
            console.log(allUser.filter(el => !users.some(ele => ele.id === el.id)))
            } catch (error) {
                console.log(error);
                if (error.response) {
                console.log("hello");
                console.log(error.response);
                alert(`Failed ${error.response.data.message}`)
        
                // Request made and server responded
                // console.log(error.response.data);
                // console.log(error.response.status);
                // console.log(error.response.headers);
                alert(
                    `Error (${error.response.status}):\n${error.response.data.error}`
                );
                } else if (error.request) {
                // The request was made but no response was received
                alert("response not recieved from server");
                console.log(error.request);
                } else {
                // Something happened in setting up the request that triggered an Error
                alert("Error", error.message);
                }
            }
    
        } 
        getInterviewInfo();
    },[])


    async function handleSubmit(event) {
        event.preventDefault();
        // {
        //     "interviewId": 7,
        //     "addNewUsers": [5],
        //     "removeUsers": [4,12, 1],
        //     "startTime": "2022-12-22 15:00:00",
        //     "endTime": "2022-12-22 16:00:00"
        // }
        
        try{ 
            console.log(interview.interview.id);
            const res = await axios.patch("/interview?username=som_ahirwar&pass=123456",{
                interviewId: interview.interview.id,
                addNewUsers: addUser,
                removeUsers: removeUser,
                startTime: startTime,
                endTime: endTime
            });
            alert(`Updated Interview`)
        } catch (error) {
            console.log(error);
            if (error.response) {
              console.log("hello");
              console.log(error.response);
            alert(`Failed ${error.response.data.message}`)
    
              // Request made and server responded
              // console.log(error.response.data);
              // console.log(error.response.status);
              // console.log(error.response.headers);
              alert(
                `Error (${error.response.status}):\n${error.response.data.error}`
              );
            } else if (error.request) {
              // The request was made but no response was received
              alert("response not recieved from server");
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              alert("Error", error.message);
            }
          }
    }

    function handleCheckChangeAdd(event) {
        if(event.target.checked === true){
            setAddUser(prev => [...prev.filter(ele => ele !== event.target.value), event.target.value])
        }else{
            setAddUser(prev => prev.filter(ele => ele !== event.target.value))
        }
    }

    function handleCheckChangeRemove(event) {
        if(event.target.checked === true){
            setRemoveUser(prev => [...prev.filter(ele => ele !== event.target.value), event.target.value])
        }else{
            setRemoveUser(prev => prev.filter(ele => ele !== event.target.value))
        }
    }

    return (
        <div className='editPage'>
            <div className='interviewFormBox'>
                <form className="interviewForm" onSubmit={handleSubmit}>
                    <div className='interviewForm__userBox'>
                        <h4>Select User to Remove</h4>
                            {users.map(el => (<div key={el.id} className='interviewForm__user'>
                                <input className='interviewForm__checkBox' type="checkbox" id={el.id} name={el.name} value={el.id} onChange={handleCheckChangeRemove} />
                                <User userData={el} />
                                </div>)
                            )}
                    </div>
                    <div className='interviewForm__userBox'>
                        <h4>Select User to Add into interview</h4>
                            {allUser.filter(el => !users.some(ele => ele.id === el.id)).map(el => (<div key={el.id} className='interviewForm__user'>
                                <input className='interviewForm__checkBox' type="checkbox" id={el.id} name={el.name} value={el.id} onChange={handleCheckChangeAdd} />
                                <User userData={el} />
                                </div>)
                            )}
                    </div>
                    <div className='interviewForm__timeBox'>
                        <div className='interviewForm__time'>
                            <label htmlFor="startTime"> <h3>Start Time:&nbsp;</h3></label>
                            <input className="interviewForm__dateTime" type="datetime-local" id="startTime" name="startTime" value={startTime} onChange={event => setStartTime(event.target.value)}/>
                        </div>
                        <div className='interviewForm__time'>
                            <label htmlFor="endTime"> <h3>End Time:&nbsp;</h3></label>
                            <input className="interviewForm__dateTime" type="datetime-local" id="endTime" name="endTime" value={endTime} onChange={event => setEndTime(event.target.value)}/>
                        </div>
                    </div>

                    <div className='interviewForm__submitBtnBox'>
                        <button className='interviewForm__submitBtn'>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditPage
