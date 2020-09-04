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

        axios.defaults.headers = {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token')
        }

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
                    <div id="upper-portion">
                        {otherUserName}'s Profile
                    </div>
                    <i class="fa fa-user-alt"></i>
                    <div id="full-name">{firstname}  {lastname}</div>
                    <div id="user-id">@{username}</div>
                    <div id="user-id">{bio}</div>
                    <button id="tweetsAvailable">Tweets</button>
                    <div className="tweets">
                            <h4 id="tweets">
                            
                            {tweets.map(tweet => (
                                    <h4 key={tweet.id}><div id="tweetuser"><i class="fa fa-user-circle"></i>@{this.state.username}<br/></div><div id="user-tweet"><div id="twitter">{tweet.tweet}</div></div></h4>
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
