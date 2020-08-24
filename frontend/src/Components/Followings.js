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
                     name:null,
                     username:null
                 }
             ]
        }
    }
    
    componentDidMount(){
        if(this.state.followings.name==null){
    
            history.push('./HomePage') 
            alert('No Any Followings!')
           
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
                                <div key={indexedDB}><div id="followers-name">{followings.name}<br/></div>
                                <div id="followers-username">@ {followings.username}
                                <div id="view-profile-btn"><button type="button">View</button></div>
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
