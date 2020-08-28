import React, { Component } from 'react'
import Menu from './Menu'
import history from './../history';
import axios from 'axios'
import './OtherUserProfile.css'

export class OtherUserProfile extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             otherUserName:localStorage.getItem('otheUserName'),
             token:localStorage.getItem('token'),
             firstname:null,
             lastname:null,
             username:'',
             bio:'',
             tweets:[]


        }
        this.componentDidMount()
    }
    componentDidMount=()=>{

        console.log(this.state.otherUserName)
        axios
        .post('http://127.0.0.1:8000/User/OtherUserProfile/',this.state)
        .then(response=>{
            console.log(response)

            const userDataArray=response.data[0]
            const userTweets=response.data[1]

            if(response['status']==200){

                localStorage.clear('otheUserName') 
                localStorage.setItem('token',this.state.token)
                this.setState({
                    token:localStorage.getItem('token')
                })
                console.log('Token after other user profile',this.state.token)
                this.setState({
                    firstname:userDataArray.firstname,
                    lastname:userDataArray.lastname,
                    username:userDataArray.username,
                    bio:userDataArray.bio,
                    tweets:userTweets
                })
                console.log(this.state.otherUserName)
                 
                
            }
        })
        .catch(error=>{
            console.log(error.response['status']);
            if(error.response['status']==504){
                history.push('/')
            }
        })
    }
    
    render() {
        const{firstname,lastname,username,bio,tweets,otherUserName}=this.state
        return (

            <div>
                <Menu />
                <div className="other-user-profile">
                    <div id="label">
                        {otherUserName}'s Profile
                    </div>
                    <img src="./logo.png"></img>
                    <h1 id="fullname">{firstname}  {lastname}</h1>
                    <h2 id="userid">@{username}</h2>
                    <h3 id="bio">{bio}</h3>
                    <div id="label-">TWEETS</div>
                    <div className="tweets">
                            <h4 id="tweets">
                            
                            {tweets.map(tweet => (
                                    <h4 key={tweet.id}><div id="tweetuser">@{this.state.username}<br/></div>{tweet.tweet}</h4>
                                ))}
                            </h4>
                    </div>
                    <button id="exit-btn"
                    onClick={()=>{history.push('/HomePage')}}> 
                        Exit
                    </button>

                </div>
            </div>
        )
    }
}

export default OtherUserProfile
