import React, { Component } from 'react'
import Menu from './Menu'
import './Followings.css'
import history from './../history';
import axios from 'axios'

export class Followings extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            token:localStorage.getItem('token'),
            username:null,
             followings:[]
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

            axios
            .post('http://127.0.0.1:8000/Followings/',this.state)
            .then(response=>{
                console.log(response)
                const userData=response.data[0]
                const followingsArray=response.data[1]
    
                if(response['status']==200){
    
                    this.setState({
                        
                        username:userData.username,
                        followings:followingsArray
                    })

                    if(this.state.followings===null || this.state.followings===undefined){

                        alert('No Any Followings!')
                        history.push('./HomePage') 

                    }
                    
                }
                
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

    render() {
        const{followings,username}=this.state
        return (
            <div>
                <Menu />
                <div className="UserFollowings">
                <div id="label"> Your Followings </div>
                <div id="followers-list"> 
                    {followings.map(follow => (
                                <div key={indexedDB}>
                                <div id="followers-username">@{follow.username}
                                <div id="view-profile-btn">
                                    <button type="button"
                                    onClick={()=>{this.viewProfile(follow.username)}}>
                                        Profile
                                    </button>
                                </div>
                                <div id="unfollow-btn">
                                    <button type="button">
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
