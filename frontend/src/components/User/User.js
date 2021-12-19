import React from 'react'
import './User.css'

function User({userData}) {
    return (
        <div className="user">
            <div className='user__leftBox'>
            <div className="user__username">{userData.username}</div>            
            <div className="user__email">{userData.email}</div>  
            </div>
            <div className='rightBox'>
                <div className='user__role'>{userData.role}</div>
            </div>          

        </div>
    )
}

export default User
