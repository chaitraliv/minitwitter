import React, { Component } from 'react'
import Menu from './Menu'
import './Followers.css'
import history from './../history';
import axios from 'axios'
import { Link } from 'react-router-dom';
import {allUsersArray} from './Menu'
import {followingUserArray} from './Followings'
import {loggedUserData} from './Menu'

export class Followers extends Component {

constructor(props) {
    super(props)

    this.state = {

        token:localStorage.getItem('token'),
         followers:[],
         msg:''
        //  followingUserName:'',
        //  followerUserName:'',
        //  person:'',
        //  followingPerson:''
    }

}

viewProfile=(otherUserName,event)=>{

    console.log(otherUserName)
    localStorage.setItem('otheUserName',otherUserName)
    history.push('/OtherUserProfile')
}


// onclick function to follow the user
followUserBtn=(user,event)=>{

    const{followingUserName}=this.state

    console.log(user)
    const followuser={
        token:this.state.token,
        otheruser:user

    }

    axios.defaults.headers = {
        'Content-Type': 'application/json',
        Authorization: "token "+localStorage.getItem('token')
    }
    
    axios
    .post('http://127.0.0.1:8000/User/Followers/Follow/',followuser)
    .then(response=>{
        console.log(response)    // will return 200 code if token is null
        this.setState({
            followingUserName:user
        })
        
        if(response['status']==200){
            console.log('Followed Successfully!')
            history.push('/HomePage')

        }
        else if(response['status']==208){
            
            console.log('User unfollowed!!')
            history.push('/HomePage')

        }
        
    })
    .catch(error=>{
        console.log(error.response)
    })



}

// onclick function to unfollow the user
unfollowUserBtn=(user,event)=>{

    console.log(user)
    const unfollowuser={
        token:this.state.token,
        otheruser:user

    }

    axios.defaults.headers = {
        'Content-Type': 'application/json',
        Authorization: "token "+localStorage.getItem('token')
    }

    axios
    .post('http://127.0.0.1:8000/User/Followers/Unfollow/',unfollowuser)
    .then(response=>{
        console.log(response)
        
        if(response['status']==200){
           console.log('UnFollowed Successfully!')
            history.push('/HomePage')

        }
        else if(response['status']==208){
            console.log('User already followed!!')
            history.push('/HomePage')

        }
        
    })
    .catch(error=>{
        if(error.response['status']==406){
            console.log('already unfollowed')
            history.push('/Followings')
        }
        else if(error.response['status']==400){
            console.log('unfollowing yourself')
            history.push('/UserProfile')
        }
    })



}

clickeventfollowers=event=>{
    history.push('/Followers')
}
clickeventfollowings=event=>{
    history.push('/Followings')
}


componentDidMount(){
    if(this.state.followers[0]==''){

        history.push('./HomePage') 
        alert('No Any Followers!')
    }
    else{

        axios.defaults.headers = {
            'Content-Type': 'application/json',
            Authorization: "token "+localStorage.getItem('token')
        }

        axios
        .post('http://127.0.0.1:8000/User/Followers/',this.state)
        .then(response=>{
            console.log(response)
            const followingsArray=response.data
            // if(response.data.length===0){
            //     this.setState({
            //         msg:'No followers!'
            //     })
            //     return(this.state.msg)
            // }

            if(response['status']==200){

                this.setState({
                    
                    followers:followingsArray
                })
        
            }
            if(response['status']==206){

                console.log(response.data.message)

                return(response.data.message)
        
            }
        })
        .catch(error=>{
            console.log(error.response['status']);
            if(error.response['status']==400){
                history.push('/')
            }
        })
        
    }
}

    render() {
        var temp;
        return (
            <div>
                <Menu />
                <div className="UserFollowers">
                <div id="logeed-fullname">{loggedUserData.firstname} {loggedUserData.lastname}</div>
                <div id="logeed-username">@{loggedUserData.username}</div>
                <div id="upper-buttons">  
                    <button id="btn-followers" onClick={()=>{this.clickeventfollowers()}}> Followers</button>
                    <button id="btn-followings" onClick={()=>{this.clickeventfollowings()}}>Followings</button>
                 </div>
                 {
                    //  this.state.msg=='No followers!' ?
                    //     <h3>{this.state.msg}</h3>:
                    //     null
                 }
                 
                    <div id="followers-list"> 
                    {this.state.followers.map(follow => (
                                <div key={indexedDB} >
                                    {/* <div id="followers-name">{followers.username}<br/></div> */}
                                    <div id="followers-fullname"><i class="fa fa-user-circle"></i><label id="followers-fullname">{follow.first_name} {follow.last_name}</label></div>
                                <div id="followers-username">
                                    <Link onClick={()=>{
                                        this.viewProfile(follow.username)
                                    }}>
                                        @{follow.username}</Link>
                                    <div onLoadStart={temp=allUsersArray.find(user=> user===follow.username)}></div>
                                    {
                                        follow.username == temp  ?
                                        <div id="view-profile-btn">
                                        <button type="button"
                                        onClick={()=>{this.followUserBtn(follow.username)}}>
                                        follow
                                    </button></div>: 
                                    <div id="unfollow-follower-btn">
                                        <button type="button"
                                        onClick={()=>{this.unfollowUserBtn(follow.username)}}>
                                    unfollow
                                    </button></div>


                                    }
                                
                                </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        )
    }
}


export default Followers
