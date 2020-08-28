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
         followers:[]
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
        
    })
    .catch(error=>{
        if(error.response['status']==406){
            console.log('already followed')
            alert('User already followed!')
            history.push('/Followings')
        }
        else if(error.response['status']==400){
            console.log('following yourself')
            alert('You cannot follow yourself!')
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
                                <div id="view-profile-btn">
                                    <button type="button"
                                    onClick={()=>{
                                        this.followUserBtn(follow)
                                    }}>
                                        follow
                                    </button></div>
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
