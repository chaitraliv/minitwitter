import React, { Component } from 'react'
import './LoginPage.css';
import axios from 'axios'
import history from './history';


// This component renders login page on browser
class LoginPage extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
             userName:'',
             passWord:''
             
             
        }
    }
    

    // Function to perform action on button click
    handleEvent=event=>{

        axios
        .post('http://127.0.0.1:8000/LoginPage/',this.state) // link of backend api
        .then(response=>{
            console.log(response);


        })
        .catch(error=>{
            console.log(error);
        })

        axios
        .get('http://127.0.0.1:8000/LoginPage/') // link of backend api
        .then(response=>{
            console.log(response);

            if(response.data.code === 200){

                alert(`Welcome ${this.state.userName}  !`)
                console.log(this.state);
                history.push('/Menu')
                event.preventDefault()
        
                }
                 else if(response.data.code === 400){
                     alert(`Empty feilds not allowed !`)
        
                 }
                 else if(response.data.code === 404){
                    alert(`Empty feilds not allowed !`)
        
                }
                event.preventDefault()
            

        })
        .catch(error=>{
            console.log(error);
        })

    
        
        event.preventDefault()
        
       
    }
    // Function to perform action onChange event for feild of username
    changeEventUserName=event=>{
        this.setState({
           userName:event.target.value
        })
    }
    // Function to perform action onChange event for feild of username
    changeEventPassWord=event=>{
            this.setState({
              passWord:event.target.value
            })

    }
    
    render() {

        const { userName, passWord } = this.state
        return (
        <div className="loginPage">
            <form>
                
                <img src={require('./logo.gif')}  />
                <div id="textLogin">Login to InstaTwitter</div><br></br><br></br>
                <input 
                    type="text" 
                    id="username" 
                    placeholder="Enter username or phone number"
                    value={userName}
                    name={userName}
                    required="text"
                    onChange={this.changeEventUserName}>
                </input><br></br>
                <br></br>
                <input 
                    type="password" 
                    id="password" 
                    placeholder="Enter Password" 
                    value={passWord}
                    name={passWord}
                    required="password"
                    onChange={this.changeEventPassWord}>
                </input><br></br>
                <br></br><br></br>
                <button id="btnLogIn" type="button" onClick={this.handleEvent} >Log In</button>
            </form>   
     
        </div>
        )
    }
}

export default LoginPage
