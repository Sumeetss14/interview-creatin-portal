import React from 'react'
import axios from 'axios'
import Interview from '../Interview/Interview'
import "./UpcomingInterview.css"

function UpcomingInterview() {
    const [upcomingInterview, setUpcomingInterview] = React.useState([]);

    React.useEffect(function() {
        async function getUpcomingInterviews()
        {
            try{
                const res = await axios.get("/interview?username=som_ahirwar&pass=123456",);
                console.log(res);
                setUpcomingInterview(res.data.data);
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

        getUpcomingInterviews();
    }, []);

    return (
        <>
        <h1>Upcoming Interviews</h1>
        <div className="upcomingInterview">
            {upcomingInterview.map(el => <Interview interviewBody={el} />)}
        </div>
        </>
    )
}

export default UpcomingInterview
