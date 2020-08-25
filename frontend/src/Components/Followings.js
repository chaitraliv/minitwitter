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
             followings:[
                 {
                     username:'user'
                 }
             ]
        }
    }
    
    componentDidMount(){
        if(this.state.followings.username===null){
    
            history.push('./HomePage') 
            alert('No Any Followings!')
           
        }
        else{

            axios
            .post('http://127.0.0.1:8000/UserProfile/',this.state)
            .then(response=>{
                console.log(response)
                const userData=response.data[0]
                const followingsArray=response.data[1]
    
                if(response['status']==200){
    
                    this.setState({
                        
                        username:userData.username,
                        followings:followingsArray
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
        // const{followings,username}=this.state
        return (
            <div>
                <Menu />
                <div className="UserFollowings">
                <div id="label"> Your Followings </div>
                <div id="followers-list"> 
                    {this.state.followings.map(followings => (
                                <div key={indexedDB}>
                                    {/* <div id="followers-name">{followings.firstname}<br/></div> */}
                                <div id="followers-username">@ {followings.username}
                                <div id="view-profile-btn"><button type="button">Profile</button></div>
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
