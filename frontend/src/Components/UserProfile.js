import React, { Component } from 'react'
import './UserProfile.css'
import Menu from './Menu'
import history from './../history';
import axios from 'axios'

export class UserProfile extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             username:null,
             firstname:null,
             lastname:null,
             bio:null,
             tweets:[],
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

        axios.defaults.headers = {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token')
        }

        axios
        .post('http://127.0.0.1:8000/User/UserProfile/',this.state)
        .then(response=>{
            console.log(response)
            const userData=response.data[0]
            const tweetsArray=response.data[1]

            if(response['status']==200){

                this.setState({
                    firstname:userData.firstname,
                    lastname:userData.lastname,
                    username:userData.username,
                    bio:userData.bio,
                    tweets:tweetsArray
                })
                
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

       const{tweets}=this.state
    //    const flag='tr'
        return (
            <div>
             <Menu />  
            <div className="Profile">
                <div id="upper-portion">{this.state.firstname}  {this.state.lastname}
                </div>

                <i class="fa fa-user-alt"></i>
                <div id="full-name">{this.state.firstname}  {this.state.lastname}</div>
                <div id="user-id">@{this.state.username}</div>
                <div id="user-id">{this.state.bio}</div>
                <button id="tweets-available">Tweets</button>
                <div className="tweets">
                        <h4 id="tweets">
                        
                        {tweets.map(tweet => (
                                <h4 key={tweet.id}><div id="tweetuser"><i class="fa fa-user-circle"></i>@{this.state.username}<br/></div><div id="user-tweet"><div id="twitter">{tweet.tweet}</div></div></h4>
                            ))}
                        </h4>
                </div>
                <button id="edit" type="button" onClick={this.clickForEdit}>Edit</button>
                {/* <button id="followers" type="button" onClick={this.clickForFollowers}>Followers</button>
                <button id="following" type="button" onClick={this.clickForFollowing}>Following</button> */}
                
             
            </div>
            </div>
            
        )
    }
}

export default UserProfile