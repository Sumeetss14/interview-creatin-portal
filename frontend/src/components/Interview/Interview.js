import React from 'react'
import "./Interview.css"

function Interview({interviewBody}) {
    return (
        <div className='interview'>
            <div className='interview__timeBox'>
                <div><strong>Start time:</strong> {interviewBody.start_time}</div>
                <div><strong>End time:</strong> {interviewBody.end_time}</div>
            </div>
            <div className=''><h3>ID: {interviewBody.id}</h3></div>
        </div>
    )
}

export default Interview
