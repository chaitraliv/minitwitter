import React, { Component } from 'react'
import './NewUser.css'
import Menu from './Menu'
import history from './../history';

export class NewUser extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             firstname:'',
             lastname:'',
             username:'',
             bio:''
             
        }
    }

    buttonClick= event=>{

        event.preventDefault();
        axios
        .post('http://127.0.0.1:8000/RegistrationPage/',this.state)
        .then(response=>{
            console.log(response)
            history.push('/CreateEditProfile')
        })
        .catch(error=>{
            console.log(error);
        })
        

    }
    
    render() {
        return (
            <div>
            <Menu /> 
               <div className="Pages-">
                   <h1>Welcome To InstaTwitter</h1>
                   <button id="welcome" type="button" onClick={this.buttonClick}>Create Profile</button>
                       
                   
               </div>
            </div>   
        )
    }
}

export default NewUser
