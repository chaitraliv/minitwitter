import React, { Component } from 'react'
import Menu from './Menu'
import './Followers.css'
import history from './../history';
import axios from 'axios'
import { Link } from 'react-router-dom';

export class Followers extends Component {

constructor(props) {
    super(props)

    this.state = {

        token:localStorage.getItem('token'),
         followers:[],
         isFollowing:false
    }

}

viewProfile=(otherUserName,event)=>{

    console.log(otherUserName)
    localStorage.setItem('otheUserName',otherUserName)
    history.push('/OtherUserProfile')
}


// onclick function to follow the user
followUserBtn=(user,event)=>{

    console.log(user)
    const followuser={
        token:this.state.token,
        otheruser:user

    }
    


    axios
    .post('http://127.0.0.1:8000/User/Followers/Follow/',followuser)
    .then(response=>{
        console.log(response)    // will return 200 code if token is null
        if(response['status']==200){
            console.log('Followed Successfully!')
            history.push('/HomePage')

        }
        else if(response['status']==208){
            this.setState({
                isFollowing:true
            })
            console.log('User already followed!!')
            history.push('/Folllowings')

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

    axios
    .post('http://127.0.0.1:8000/User/Followers/Unfollow/',unfollowuser)
    .then(response=>{
        console.log(response)    
        if(response['status']==200){
           console.log('UnFollowed Successfully!')
            history.push('/HomePage')

        }
        else if(response['status']==208){
            this.setState({
                isFollowing:false
            })
            console.log('User already followed!!')
            history.push('/Folllowings')

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



componentDidMount(){
    if(this.state.followers[0]==''){

        history.push('./HomePage') 
        alert('No Any Followers!')
    }
    else{

        axios
        .post('http://127.0.0.1:8000/User/Followers/',this.state)
        .then(response=>{
            console.log(response)
            const followingsArray=response.data

            if(response['status']==200){

                this.setState({
                    
                    followers:followingsArray
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
}

    render() {
        const{isFollowing}=this.state
        return (
            <div>
                <Menu />
                <div className="UserFollowers">
                <div id="label"> Your Followers </div>
                    <div id="followers-list"> 
                    {this.state.followers.map(follow => (
                                <div key={indexedDB}>
                                    {/* <div id="followers-name">{followers.username}<br/></div> */}
                                <div id="followers-username">
                                    <Link onClick={()=>{
                                        this.viewProfile(follow)
                                    }}>@{follow}</Link>
                                    {
                                        isFollowing==true ?
                                        <div id="view-profile-btn">
                                        <button type="button"
                                        onClick={()=>{this.unfollowUserBtn(follow)}}>
                                        Unfollow
                                    </button></div>:
                                    <div id="view-profile-btn">
                                        <button type="button"
                                        onClick={()=>{this.followUserBtn(follow)}}>
                                    follow
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
