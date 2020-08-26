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
            tweets:null,
            allUsers:[
                'fist',
                'second',
                'fist',
                'second',
                'second'
            ],
            otheruser:'user',
            token:localStorage.getItem('token')
        }
        // this.followUserBtn.bind(this)
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
                history.push('/Menu')  
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

    // onclick function to follow the user
    followUserBtn=(user,event)=>{

        console.log(user)
        const followuser={
            token:this.state.token,
            otheruser:user

        }

        axios
        .post('http://127.0.0.1:8000/Menu/',followuser)
        .then(response=>{
            console.log(response)    // will return 200 code if token is null
            if(response['status']==200){
               alert('Followed Successfully!')
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

    //onclick function to view the profile of other user
    viewProfileBtn=(user,event)=>{

        console.log(user)
        localStorage.setItem('otheUserName',user)
        history.push('/OtherUserProfile')

        // const viewuser={

        //     viewFlag:true,
        //     token:localStorage.getItem('token'),
        //     otheruser:user
        // }

        // axios
        // .post('http://127.0.0.1:8000/Menu/',viewuser)
        // .then(response=>{
        //     console.log(response)    
        //     if(response['status']==200){
        //        console.log('user successfully recieved !')
        //        localStorage.setItem('otheUserName',user)
        //         history.push('/OtherUserProfile')

        //     }
            
        // })
        // .catch(error=>{
        //     console.log(error.response)
        // })


    }

     // onchange function to make the tweet from textarea present in upper menu part
    changeEvent=event=>{
        this.setState({
            tweets:event.target.value
        })
    }

    // function  calls bydefault whenever this component will get call or get mount on screen
    componentDidMount=()=>{

        axios
        .post('http://127.0.0.1:8000/Menu/',this.state)
        .then( response=>{
                console.log(response)

                const setusername=response.data[0]
                const userArray=response.data[1]

                this.setState({
                    username:setusername.username,
                    allUsers:userArray
                })
        })
    }


    render() {

        const{tweets,allUsers}=this.state
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

                        <div className="users">
                            <h4 id="other-users-list">
                            
                            {allUsers.map(user => (
                                   <div id="for-each"> 
                                        <h4 key={user.id}>
                                            <div id="other-user-name">{user}</div>
                                            <button id="follow-button" onClick={()=>{this.followUserBtn(user)}}>follow</button><span>
                                            <button id="visit-profile-button" onClick={()=>{this.viewProfileBtn(user)}}>Profile</button>
                                            </span>
                                        </h4>
                                    </div>
                                ))}
                            </h4>
                        </div>
                    </div>


                </div>

                
            </div>
        )
    }
}

export default Menu
