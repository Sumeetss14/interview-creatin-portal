import axios from 'axios';
import React from 'react'
import User from "../User/User"
import "./InterviewForm.css"

function InterviewForm({users}) {
    const [selectedUsers, setSelectedUsers] = React.useState([]);
    const [startTime, setStartTime] = React.useState('');
    const [endTime, setEndTime] = React.useState('');
    // const temp = [{username: "som_ahirwar", email:"som@gmail.com", role:"admin"},{username: "som_ahirwar", email:"som@gmail.com", role:"admin"},{username: "som_ahirwar", email:"som@gmail.com", role:"admin"},{username: "som_ahirwar", email:"som@gmail.com", role:"admin"}]

    function handleCheckChange(event) {
        if(event.target.checked === true){
            setSelectedUsers(prev => [...prev.filter(ele => ele !== event.target.value), event.target.value])
        }else{
            setSelectedUsers(prev => prev.filter(ele => ele !== event.target.value))
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        try{
        const users = selectedUsers;
        let beginTime = startTime;
        let endingTime = endTime;
        
        const res = await axios.post("/interview?username=som_ahirwar&pass=123456",{
            users,
            startTime: beginTime,
            endTime: endingTime
        });
        alert(`Created Interview`)
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

    return (
        <>
            <h1 className="interviewFormBox__heading">Create Interview</h1>
        <div className='interviewFormBox'>
            <form className="interviewForm" onSubmit={handleSubmit}>
                <div className='interviewForm__userBox'>
                    <h3>Users</h3>
                        {users.map(el => (<div key={el.id} className='interviewForm__user'>
                            <input className='interviewForm__checkBox' type="checkbox" id={el.id} name={el.name} value={el.id} onChange={handleCheckChange} />
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
        </>
    )
}

export default InterviewForm
