import React, { Component } from 'react'
import './Menu.css'
import { Link } from 'react-router-dom'
import history from './../history';
import Axios from 'axios';




export class Menu extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            tweets:[],
            token:localStorage.getItem('token')
        }
    }
    

    clickEventProfile=event=>{

        event.preventDefault();
        history.push('/UserProfile')

    }
    
    clickEventHome=event=>{

        event.preventDefault();
        history.push('/HomePage')

    }

    clickEventFollowers=event=>{

        event.preventDefault();
        history.push('/Followers')

    }
    clickEventFollowings=event=>{

        event.preventDefault();
        history.push('/Followings')

    }
    clickEventPostTweet=event=>{

        axios
        .post('http://127.0.0.1:8000/Menu/',this.state)
        .then(response=>{
            console.log(response)
            event.preventDefault();
            alert('Changes saved')
            
            
        })
        .catch(error=>{
            console.log(error);
        })
        

    }


    render() {
        return (
            <div className="Menu">
                <div className="sideMenu">
                    <div>
                        <h3>User Name</h3>
                    </div>
                    <div>
                        <img src="./logo.png"></img>
                    </div>
                    <div>
                        <button type="button" onClick={this.clickEventHome}>Home</button>
                    </div>
                    <div>
                        <button type="button" onClick={this.clickEventProfile}>Profile</button>
                    </div>
                    <div>
                         <button type="button" onClick={this.clickEventFollowers}>Followers</button>
                    </div>
                    <div>
                        <button type="button" onClick={this.clickEventFollowings}>Following</button>
                    </div>
                    <div>
                         <button type="button">Tweets</button>
                    </div>

                    <div>
                         <button type="button">Post Tweet</button>
                    </div>
                

                </div>
                <div className="tweetContainer">
                    <div className="tweetBox">
                        <textarea
                            placeholder="Make a tweet">
                        </textarea><br/><br/>
                        <button type="button" onClick={this.clickEventPostTweet}>Post Tweet</button>
                        
                    </div>
                    {/* <div className="Pages">
                       
                    </div> */}
                    

                </div>
                <div className="searchUser">
                    <div className="searchBar">
                        <input type="text"
                        placeholder="Search">
                        </input>
                        <button type="button">
                            Search
                        </button>
                    </div>


                </div>

                
            </div>
        )
    }
}

export default Menu
