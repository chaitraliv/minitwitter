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
             firstname:'',
             lastname:'',
             username:'',
             bio:'',
             tweets:[]


        }
    }
    componentDidMount=()=>{

        axios
        .post('http://127.0.0.1:8000/OtherUserProfile/',this.state)
        .then(response=>{
            console.log(response)
            // const userData=response.data[0]
            // const tweetsArray=response.data[1]

            // if(response['status']==200){

            //     this.setState({
            //         firstname:userData.firstname,
            //         lastname:userData.lastname,
            //         username:userData.username,
            //         bio:userData.bio,
            //         tweets:tweetsArray
            //     })
                
            // }
        })
        .catch(error=>{
            // console.log(error.response['status']);
            // if(error.response['status']==504){
            //     history.push('/')
            // }
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
                                    <h4 key={tweet.id}><div id="tweetuser">@{this.state.username}<br/></div>{tweet}</h4>
                                ))}
                            </h4>
                    </div>

                </div>
            </div>
        )
    }
}

export default OtherUserProfile
