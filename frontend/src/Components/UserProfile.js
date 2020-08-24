import React, { Component } from 'react'
import './UserProfile.css'
import Menu from './Menu'
import history from './../history';

export class UserProfile extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             username:'vishakha',
             fullname:'Vishakha kajale',
             bio:'Live happy and simple life',
             
        }
    }

    clickForEdit=event=>{
        event.preventDefault();
        history.push('/CreateEditProfile')

    }

    clickForFollowers=event=>{
        event.preventDefault();
        history.push('/Followers')

    }

    clickForFollowing=event=>{
        event.preventDefault();
        history.push('/Followings')

    }
    
    render() {

        const tweets=[

            
            '@DrRPNishankji to please postpone exams for students Sir please listen to the majority of students They are extremely stressed and are very pressurised in this pandemic Please sir',
            'Back at it ',
            'how are you',
            'helo',
            'hi',
            'how are you',
            'helo',
            'hi',
            'how are you',
            'helo',
            'hi',
            'how are you',
            'helo',
            'hi',
            'how are you',
            'helo',
            'hi',
            'how are you',
            ' hi',
            'how are you',
            'helo',
            'hi',
            'how are you'
        ]
        return (
            <div>
             <Menu />  
            <div className="Profile">

                <img src="./logo.png"></img>
                <h1 id="fullname">{this.state.fullname}</h1>
                <h2 id="userid">@{this.state.username}</h2>
                <h3 id="bio">{this.state.bio}</h3>
                <label>TWEETS</label>
                <div className="tweets">
                        <h4 id="tweets">
                        
                        {tweets.map(tweets => (
                                <h4 key={indexedDB}><div id="tweetuser">@{this.state.username}<br/></div>{tweets}</h4>
                            ))}
                        </h4>
                </div>
                <button id="edit" type="button" onClick={this.clickForEdit}>Edit</button>
                <button id="followers" type="button" onClick={this.clickForFollowers}>Followers</button>
                <button id="following" type="button" onClick={this.clickForFollowing}>Following</button>
             
            </div>
            </div>
            
        )
    }
}

export default UserProfile