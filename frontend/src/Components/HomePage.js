import React, { Component } from 'react'
import Menu from './Menu'
import history from './../history';
import axios from 'axios'
import './HomePage.css'
import { Link } from 'react-router-dom';

export class HomePage extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             fistname:'',
             lastname:'',
             username:'',
             token:localStorage.getItem('token'),
             timelineArray:[]
     
                 
            
        }
    }

    componentDidMount=()=>{

        axios
        .post('http://127.0.0.1:8000/HomePage/Timeline/',this.state)
        .then(response=>{
            console.log(response)

            if(response['status']==200){

                const tweetArray=response.data
                const{timelineArray}=this.state

                tweetArray.map(tweet=>(

                    timelineArray.push(tweet)
                ))
                
                console.log(timelineArray)

                
            }
        })
        .catch(error=>{
            console.log(error.response['status'])
            if(error.response['status']==504){
                history.push('/')
            }
        })
        
    }

    viewProfile=(otherUserName,event)=>{

        console.log(otherUserName)
        localStorage.setItem('otheUserName',otherUserName)
        history.push('/OtherUserProfile')
    }
    

    render() {
        const{timelineArray}=this.state
        return (
            <div>
                
                <Menu />

                <div className="timeline">

                    <div id="label">timeline</div>

                    <div className="tweets-timeline"><div id="tweets-timeline-content">{timelineArray.map(tweet => (
                                <h4 key={tweet.id}>
                                    <div id="tweet-full-name">
                                        {tweet.firstname} {tweet.lastname} 
                                        {/* <div id="tweet-user-name"> */}
                                            <Link id="tweet-user-name" onClick={()=>{this.viewProfile(tweet.username)}}>
                                              <span>@{tweet.username}</span>
                                            </Link> 
                                        {/* </div> */}
                                    </div>
                                    
                                    <div id="tweet-content">
                                        {tweet.tweet}
                                    </div>
                                </h4>
                            ))}
                        </div>
                </div>

                </div>
            </div>
        )
    }
}

export default HomePage
