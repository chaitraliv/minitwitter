import React, { Component } from 'react'
import './Menu.css'
import history from './../history';
import axios from 'axios';
// import history from './../history';


// This component will render the navigation menu , tweet box on upper side and  search bar

export class Menu extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            username:'user',
            tweets:'null',
            token:localStorage.getItem('token')
        }
    }
    

    // on click function to open the profile of user
    clickEventProfile=event=>{

        event.preventDefault();
        history.push('/UserProfile')

    }
    
    // onclick function to provide home page which displays the timeline
    clickEventHome=event=>{

        event.preventDefault();
        history.push('/HomePage')

    }

    // onclick function to provide Followers page which displays the list of followers
    clickEventFollowers=event=>{

        event.preventDefault();
        history.push('/Followers')

    }

     // onclick function to provide Followings page which displays the list of followings
    clickEventFollowings=event=>{

        event.preventDefault();
        history.push('/Followings')

    }

     // onclick function to post the tweet 
    clickEventPostTweet=event=>{

        console.log(this.state)
        axios
        .post('http://127.0.0.1:8000/Menu/',this.state)
        .then(response=>{
            console.log(response)
            if(response['status']==200){

                alert('Tweet Posted')  
            }
   
        })
        .catch(error=>{
            console.log(error);
        })
        

    }

     // onclick function to logout 

    clickEventLogout=event=>{

        localStorage.clear('token') 
        axios
        .post('http://127.0.0.1:8000/Menu/',this.state)
        .then(response=>{
            console.log(response)    // will return 200 code if token is null
            if(response['status']==200){

                event.preventDefault();
               history.push('/')

            }
            
        })
        .catch(error=>{
            if(error['status']==504){
                console.log('State:Logged Out')
                history.push('/')
            }
            else{
                console.log('State:Logged In')
            }
        })
        
    }

     // onchange function to make the tweet from textarea present in upper menu part
    changeEvent=event=>{
        this.setState({
            tweets:event.target.value
        })
    }

    // function  calls bydefault whenever this component will get call
    componentDidMount=()=>{

        axios
        .post('http://127.0.0.1:8000/Menu/',this.state)
        .then( response=>{
                console.log(response)

                this.setState({
                    username:response.data['username']
                })
        })
    }


    render() {

        const{tweets}=this.state.tweets
        return (
            <div className="Menu">
                {/* Renders the side menu */}
                <div className="sideMenu">
                    <div>
                        <h3>{this.state.username}</h3>
                    </div>
                    <div>
                        <img src="./logo.png"></img>
                    </div>

                    <div>
                        <button type="button" 
                        onClick={this.clickEventHome}>
                            Home
                        </button>
                    </div>

                    <div>
                        <button type="button" 
                        onClick={this.clickEventProfile}>
                            Profile
                        </button>
                    </div>

                    <div>
                         <button type="button" 
                         onClick={this.clickEventFollowers}>
                             Followers
                         </button>
                    </div>

                    <div>
                        <button type="button" 
                        onClick={this.clickEventFollowings}>
                            Following
                        </button>
                    </div>

                    <div>
                         <button type="button">
                             Tweet
                         </button>
                    </div>

                    <div>
                         <button type="button">
                             Post Tweet
                         </button>
                    </div>
                    
                    <div>
                         <button type="button" 
                         onClick={this.clickEventLogout}>
                             Logout
                        </button>
                    </div>
                

                </div>
                {/* Will render the upper part from where user can tweet */}
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
                {/* Will render search bar on opposite side of navigation menu */}
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
