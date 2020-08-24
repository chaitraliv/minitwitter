import React, { Component } from 'react'
import Menu from './Menu'
import './Followers.css'
import history from './../history';

export class Followers extends Component {

constructor(props) {
    super(props)

    this.state = {
         followers:[
             {
                 name:'vishakha',
                 username:'vish'
             },
             {
                name:'chaitrali',
                username:'chait'
            },
            {
                name:'aishwarya',
                username:'aish'
            },
            {
                name:'vishakha',
                username:'vish'
            },
            {
               name:'chaitrali',
               username:'chait'
           },
           {
               name:'aishwarya',
               username:'aish'
           },
           {
            name:'vishakha',
            username:'vish'
        },
        {
           name:'chaitrali',
           username:'chait'
       },
       {
           name:'aishwarya',
           username:'aish'
       }
         ]
    }

}



componentDidMount(){
    if(this.state.followers==null){

        history.push('./HomePage') 
        alert('No Any Followers!')
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
                                <div key={indexedDB}><div id="followers-name">{followers.name}<br/></div>
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
