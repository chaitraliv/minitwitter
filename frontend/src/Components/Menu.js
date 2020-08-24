import React, { Component } from 'react'
import './Menu.css'
import { Link } from 'react-router-dom'
import history from './../history';




export class Menu extends Component {

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
                        <button type="button">Post Tweet</button>
                        
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
