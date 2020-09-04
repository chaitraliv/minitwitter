import React, { Component } from 'react'
import Menu from './Menu'
import './Followings.css'
import history from './../history';
import axios from 'axios'
import { Link } from 'react-router-dom';
import {loggedUserData} from './Menu'

export var followingUserArray=[]

export class Followings extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            token:localStorage.getItem('token'),
            username:null,
             followings:[],
             msg:''
        }
    }

    viewProfile=(otherUserName,event)=>{

        console.log(otherUserName)
        localStorage.setItem('otheUserName',otherUserName)
        history.push('/OtherUserProfile')
    }
    
    componentDidMount(){
        if(this.state.followings[0]=='helo'){
    
            alert('No Any Followings!')
            history.push('./HomePage') 
           
        }
        else{

            axios.defaults.headers = {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('token')
            }

            axios
            .post('http://127.0.0.1:8000/User/Followings/',this.state)
            .then(response=>{
                console.log(response)
                const userData=response.data[0]
                const followingsArray=response.data[1]

                // if(response.data.message='Start following !!'){
                //     this.setState({
                //         msg:'Start Following!'
                //     })
                //     return(this.state.msg)
                // }
    
                if(response['status']===200){
    
                    this.setState({
                        
                        username:userData.username,
                        followings:followingsArray
                    })
                    followingUserArray=this.state.followings

                    if(this.state.followings===null || this.state.followings===undefined){

                        alert('No Any Followings!')
                        history.push('./HomePage') 

                    }
                    
                }
                // if(response['status']==206){

                //     this.setState({
                //         msg:'Start Following!'
                //     })
                //     return(this.state.msg)
    
                    
                // }
                
            })
            .catch(error=>{
                console.log(error)
                // console.log(error.response['status']);
                // if(error.response['status']==504){
                //     history.push('/')
                // }
            })
            
        }
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
            Authorization: localStorage.getItem('token')
        }

        axios
        .post('http://127.0.0.1:8000/User/Followings/Unfollow/',unfollowuser)
        .then(response=>{
            console.log(response)    
            if(response['status']==200){
               console.log('UnFollowed Successfully!')
                history.push('/HomePage')

            }
            if(response['status']==208){
                console.log('Please follow again!')
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

    render() {
        const{followings,username}=this.state
        return (
            <div>
                <Menu />
                <div className="UserFollowings">
                <div id="logeed-fullname">{loggedUserData.firstname} {loggedUserData.lastname}</div>
                <div id="logeed-username">@{loggedUserData.username}</div>
                <div id="upper-buttons">  
                    <button id="btn--followers" onClick={()=>{this.clickeventfollowers()}}> Followers</button>
                    <button id="btn--followings" onClick={()=>{this.clickeventfollowings()}}>Followings</button>
                 </div>

                 {/* {
                     this.state.msg=='Start Following!' ?
                        <h3>{this.state.msg}</h3>:
                        null
                 } */}

                <div id="followers-list"> 
                    {followings.map(follow => (
                                <div key={indexedDB}>
                                <div id='following-fullname'><i class="fa fa-user-circle"></i>{follow.first_name} {follow.last_name}</div>
                                <div id="followings-username">
                                    <Link onClick={()=>{this.viewProfile(follow.username)}}>
                                        @{follow.username}
                                    </Link>
                                    {/* <div id="view-profile-btn">
                                        <button type="button"
                                        onClick={()=>{this.viewProfile(follow.username)}}>
                                            Profile
                                        </button>
                                        </div> */}
                                        <div id="unfollow-btn">
                                            <button type="button"
                                            onClick={()=>{this.unfollowUserBtn(follow.username)}}>
                                                Unfollow
                                            </button>
                                        </div>
                                </div>
                                </div>
                            ))}
                    </div>
                </div>
                
            </div>
        )
    }
}

export default Followings
