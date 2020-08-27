import React, { Component } from 'react'
import Menu from './Menu'
import './Followers.css'
import history from './../history';
import axios from 'axios'

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



componentDidMount(){
    if(this.state.followers[0]==''){

        history.push('./HomePage') 
        alert('No Any Followers!')
    }
    else{

        axios
        .post('http://127.0.0.1:8000/Followers/',this.state)
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
                                <div id="followers-username">@ {follow}
                                <div id="view-profile-btn">
                                    <button type="button"
                                    onClick={()=>{
                                        this.viewProfile(follow)
                                    }}>
                                        Profile
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
