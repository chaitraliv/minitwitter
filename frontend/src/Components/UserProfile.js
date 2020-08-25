import React, { Component } from 'react'
import './UserProfile.css'
import Menu from './Menu'
import history from './../history';
import axios from 'axios'

export class UserProfile extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             username:'',
             firstname:'',
             lastname:'',
             bio:null,
             token:localStorage.getItem('token')
             
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

    componentDidMount=()=>{

        axios
        .post('http://127.0.0.1:8000/UserProfile/',this.state)
        .then(response=>{
            console.log(response)

            if(response['status']==200){

                this.setState({
                    firstname:response.data['firstname'],
                    lastname:response.data['lastname'],
                    username:response.data['username'],
                    bio:response.data['bio']
                })
                
            }
        })
        .catch(error=>{
            console.log(error.response);
            if(error.response['status']==504){
                history.push('/')
            }
        })
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
                <h1 id="fullname">{this.state.firstname}  {this.state.firstname}</h1>
                <h2 id="userid">@{this.state.username}</h2>
                <h3 id="bio">{this.state.bio}</h3>
                <div id="label-">TWEETS</div>
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