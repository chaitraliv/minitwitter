import React, { Component } from 'react'
import './RegistrationPage.css'
import history from './history';
import axios from 'axios'

// regular expression for validating email-id entered by user
const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

// function which returs boolean value by validating all the feilds and save the errors in the object error
const validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach(
      (val) => val.length > 0 && (valid = false)
    );
    return valid;
  }

// component to render Register Page
export class RegistrationPage extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             username:'',
             password:'',
             email:'',
             firstname:'',
             lastname:'',
             errors: {
                firstname: '',
                lastname:'',
                username:'',
                email: '',
                password: '',
              }
        }
    }

    // Function to perform action on button click
    clickEvent=event=>{

        event.preventDefault();
        axios
        .post('http://127.0.0.1:8020/RegistrationPage/',this.state) // link of backend api
        .then(response=>{
            console.log(response);
            if(validateForm(this.state.errors)) {
              if(response.data.code === 201){
                console.info('Valid Form')
                console.log(this.state)
                alert(`Hey ${this.state.firstname}.... Registration Successful! `);
                history.push('/LoginPage')      //Rendering on next page
    
              }
              else if(response.data.code === 226){
                console.log(this.state)
                alert(`Hey ${this.state.firstname}.... username already used! `);
              }
              else if(response.data.code === 400){
                console.log(this.state)
                alert(`Empty feilds not allowed! `);
              }
              
            }
            else{
              console.error('Invalid Form')
            }

        })
        .catch(error=>{
            console.log(error);
        })
        
        
    }

    // Function to perform action for onchange event
    onChangeEvent=event=>{

    event.preventDefault();
    const { name, value } = event.target;

    let errors = this.state.errors;

    // for catching the error in object and rendering  appropriate warning on UI
    switch (name) {
      case 'firstname': 
        errors.firstname = 
          value.length < 2
            ? 'First Name must be 2 characters long!'
            : '';
        break;
    
      case 'lastname': 
        errors.lastname = 
          value.length < 2
            ? 'Last Name must be 2 characters long!'
            : '';
        break;
      
      case 'email': 
        errors.email = 
          validEmailRegex.test(value)
            ? ''
            : 'Email is not valid!';
        break;
      case 'username': 
        errors.username = 
          value.length < 5
            ? 'First Name must be 5 characters long!'
            : '';
        break;
      case 'password': 
        errors.password = 
          value.length < 8
            ? 'Password must be 8 characters long!'
            : '';
        break;
      default:
        break;
    }

    this.setState({errors, [name]: value}); // error object contains all the feilds as property which have validation error


    }
    
    
    render() {
        const{username,password,email,firstname,lastname }=this.state
        const {errors} = this.state;
        return (
            <div className='reg'> 
            <h1 id="title">InstaTwitter</h1>
                <img src="./logo.png"></img>
            <div className="box">
                
            <form>
                
                <div className="registrationPage"><br></br>
                    <div id="textRegister">Registration</div>
                    <h3 id="tagline">Create your account here!</h3>
                    <div>
                    <label> Fisrt Name</label>
                        <input
                        type="text" 
                        id="firstname"
                        placeholder="Enter First Name" 
                        name="firstname"
                        value={firstname}
                        required="text"
                        onChange={this.onChangeEvent}>
                        </input>
                        {errors.firstname.length > 0 && 
                        <span className='error'>{errors.firstname}</span>}
                    
                    </div>
                    <div>
                    <label>Last Name</label>
                        <input type="text" 
                            id="lastname" 
                            placeholder="Enter Last Name"
                            name="lastname"
                            value={lastname}
                            required=""
                            onChange={this.onChangeEvent}>
                        </input>
                        {errors.lastname.length > 0 && 
                        <span className='error'>{errors.lastname}</span>}
                    </div>
                    <div>
                        <label>Email</label>
                        <input type="email" 
                            id="email" 
                            placeholder="Enter Email ID "
                            name="email"
                            value={email}
                            required=""
                            onChange={this.onChangeEvent}>
                        </input>
                        {errors.email.length > 0 && 
                        <span className='error'>{errors.email}</span>}
                    </div>
                    
                    <div>
                        <label>UserName</label>
                        <input type="text" 
                            id="use-rname" 
                            placeholder="Enter username "
                            name="username"
                            value={username}
                            required=""
                            onChange={this.onChangeEvent}>
                        </input>
                        {errors.username.length > 0 && 
                        <span className='error'>{errors.username}</span>}
                    </div>
                    <div>
                        <label>Password</label>
                        <input type="password" 
                            id="pass-word" 
                            placeholder="Set Password of 8 Characters" 
                            name="password"
                            value={password}
                            required=""
                            onChange={this.onChangeEvent}>
                        </input>
                    
                        {errors.password.length > 0 && 
                        <span className='error'>{errors.password}</span>}
                    </div>
                   
                    
                    
                    <button id="btnSignIn" type="Submit" onClick={this.clickEvent} >Register</button>
        
        
                 </div>
                
                </form>
                </div>  
            </div>
        )
    }
}

export default RegistrationPage
