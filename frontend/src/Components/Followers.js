import React, { Component } from 'react'
import Menu from './Menu'
import './Followers.css'
import history from './../history';

export class Followers extends Component {

constructor(props) {
    super(props)

    this.state = {

        token:localStorage.getItem('token'),
         followers:['hello']
    }

}



componentDidMount(){
    if(this.state.followers[0]=='hello'){

        history.push('./HomePage') 
        alert('No Any Followers!')
    }
    else{

        axios
        .post('http://127.0.0.1:8000/Followers/',this.state)
        .then(response=>{
            console.log(response)
            // const userData=response.data[0]
            // const followingsArray=response.data[1]

            // if(response['status']==200){

            //     this.setState({
                    
            //         followers:followingsArray
            //     })
                
            // }
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
                    {this.state.followers.map(followers => (
                                <div key={indexedDB}>
                                    {/* <div id="followers-name">{followers.username}<br/></div> */}
                                <div id="followers-username">@ {followers.username}
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


export default Followers
