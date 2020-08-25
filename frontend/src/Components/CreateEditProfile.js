import React, { Component } from 'react'
import Menu from './Menu'
import './CreateEditProfile.css'
import axios from 'axios'
import history from './../history';

// This component will render the profile page of user where user can edit their personal
export class CreateEditProfile extends Component {

    constructor(props) {
        super(props)

        this.state = {
            firstname:'',
            lastname:'',
            username:'',
            bio:null,
            token:localStorage.getItem('token')

        }
    }
    
    componentDidMount=()=>{

        axios
        .post('http://127.0.0.1:8000/CreateEditProfile/',this.state)
        .then(response=>{
            console.log(response)

            if(response['status']==200){

                this.setState({
                    firstname:response.data['firstname'],
                    lastname:response.data['lastname'],
                    username:response.data['username'],
                    bio:response.data['bio']
                })
                
            }
        })
        .catch(error=>{
            console.log(error.response);
            if(error.response['status']==504){
                history.push('/')
            }
        })
        
    }


    updateInputValue=event=>{
        this.setState({
            [event.target.name]:event.target.value
        });
    }


    clickEvent=event=>{

        console.log(this.state)
        axios
        .post('http://127.0.0.1:8000/CreateEditProfile/',this.state)
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
            <div>
                <Menu />
                <div className="Profile-">
                    <div id="label"> User Profile </div>
                    <div className="profileForm">

                    <form>
                        <label id="label-create-edit-profile">First Name</label>
                        <input type="text"
                        id="firstname"
                        name="firstname"
                        value={this.state.firstname}
                        onChange={this.updateInputValue}>

                        </input>

                        <label id="label-create-edit-profile">Last Name</label>
                        <input type="text"
                        id="lastname"
                        name="lastname"
                        value={this.state.lastname}
                        onChange={this.updateInputValue}>
                        </input>

                        <label id="label-create-edit-profile">User Name</label>
                        <input type="text"
                        id="userName"
                        name="username"
                        value={this.state.username}>
                        {/* // onChange={ this.updateInputValue}>           */}
                        </input>

                        <label id="label-create-edit-profile">Bio</label>
                        <input type="text"
                        id="bio-"
                        name="bio"
                        value={this.state.bio}
                        onChange={this.updateInputValue}>
                        </input>

                        <button type="button"
                        onClick={this.clickEvent}>
                            SAVE
                        </button>

                    </form>

                    </div>
                   
                
                    
                </div>
            </div>
        )
    }
}

export default CreateEditProfile
