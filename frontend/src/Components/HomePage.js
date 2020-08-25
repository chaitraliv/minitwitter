import React, { Component } from 'react'
import Menu from './Menu'

export class HomePage extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             fistname:'',
             lastname:'',
             username:'',
             token:localStorage.getItem('token')
        }
    }

    componentDidMount=()=>{

        axios
        .post('http://127.0.0.1:8000/HomePage/',this.state)
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
    

    render() {
        return (
            <div>
                
                <Menu />
            </div>
        )
    }
}

export default HomePage
