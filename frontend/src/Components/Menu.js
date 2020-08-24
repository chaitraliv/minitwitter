import React, { Component } from 'react'
import './Menu.css'
import history from './../history';
import axios from 'axios';
// import history from './../history';




export class Menu extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            username:'user',
            tweets:'',
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

        console.log(this.state)
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

    clickEventLogout=event=>{
        this.setState({token:null})
        history.push('/LoginPage')
       history.replace('/LoginPage')
        axios
        .post('http://127.0.0.1:8000/Menu/',this.state)
        .then(response=>{
            console.log(response)
            if(response['status']==200){

                event.preventDefault();
                history.push('/LoginPage')

            }
            
            
            
        })
        .catch(error=>{
            console.log(error);
        })
        
    }

    changeEvent=event=>{
        this.setState({
            tweets:event.target.value
        })
    }

    componentDidMount=()=>{

        axios
        .post('http://127.0.0.1:8000/Menu/',this.state)
        .then( response=>{
                console.log(response)

                this.setState({
                    username:response.username
                })
        })
    }


    render() {

        const{tweets}=this.state.tweets
        return (
            <div className="Menu">
                <div className="sideMenu">
                    <div>
                        <h3>{this.state.username}</h3>
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
                    <div>
                         <button type="button" onClick={this.clickEventLogout}>Logout</button>
                    </div>
                

                </div>
                <div className="tweetContainer">
                    <div className="tweetBox">
                        <form>
                        <textarea
                            value={tweets}
                            name="tweets"
                            placeholder="Make a tweet"
                            onChange={this.changeEvent}>
                        </textarea><br/><br/>
                        <button type="button"
                         onClick={this.clickEventPostTweet}>Post Tweet</button>
                         </form>
                        
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
