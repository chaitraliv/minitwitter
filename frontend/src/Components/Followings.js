import React, { Component } from 'react'
import Menu from './Menu'
import './Followings.css'
import history from './../history';

export class Followings extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             followings:[
                 {
                     username:'priya',
                     firstname:null,
                     lastname:null
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
            
        }
    }

    render() {
        return (
            <div>
                <Menu />
                <div className="UserFollowings">
                <div id="label"> Your Followings </div>
                <div id="followers-list"> 
                    {this.state.followings.map(followings => (
                                <div key={indexedDB}><div id="followers-name">{followings.firstname}<br/></div>
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
