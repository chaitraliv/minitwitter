import React, { Component } from 'react'
import Menu from './Menu'
import './CreateEditProfile.css'
import axios from 'axios'


export class CreateEditProfile extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            firstname:'',
            lastname:'',
            username:'',
            bio:''
        }
    }
    
    componentDidMount=()=>{

        const userToken=localStorage.getItem('token')
        console.log(userToken)
        axios
        .post('http://127.0.0.1:8000/CreateEditProfile/',userToken)
        .then(response=>{
            console.log(response)
            
        })
        .catch(error=>{
            console.log(error);
        })
    }


    updateInputValue=event=>{
        this.setState({
            [event.target.name]:event.target.value
        });
    }


    clickEvent=event=>{
        event.preventDefault();
        alert('Changes saved')
        console.log(this.state);
    }

    render() {

        return (
            <div>
                <Menu />
                <div className="Profile-">
                    <div id="label"> User Profile </div>
                    <div className="profileForm">

                    <form>
                        <label>First Name</label>
                        <input type="text"
                        id="firstname"
                        name="firstname"
                        value={this.state.firstname}
                        onChange={this.updateInputValue}>

                        </input>

                        <label>Last Name</label>
                        <input type="text"
                        id="lastname"
                        name="lastname"
                        value={this.state.lastname}
                        onChange={this.updateInputValue}>
                        </input>

                        <label>User Name</label>
                        <input type="text"
                        id="userName"
                        name="username"
                        value={this.state.username}
                        onChange={this.updateInputValue}>
                        </input>

                        <label>Bio</label>
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
