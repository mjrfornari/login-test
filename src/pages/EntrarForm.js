import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class EntrarForm extends Component {
   
    constructor(){
        super();

        this.state = {
            email:'',
            password:''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }



    handleChange(e){
        let target = e.target
        let value = target.type === 'checkbox' ? target.checked : target.value
        let name = target.name

        this.setState({
            [name]: value
        });
    }
    
    handleSubmit(e){
        e.preventDefault();
        console.log('The form was submitted with the followind data:')
        console.log(this.state)

    }
   
   
    render(){
      
        return(
            <div className="FormCenter">
                <form className="FormFields" onSubmit={this.handleSubmit}>
                <div className="FormField">
                    <label className="FormField__Label" htmlFor="email">E-Mail</label>
                    <input type="email" id="email" className="FormField__Input" 
                    placeholder="Digite seu e-mail" name="email" 
                    value={this.state.email} onChange={this.handleChange}/>
                </div>
                <div className="FormField">
                    <label className="FormField__Label" htmlFor="password">Senha</label>
                    <input type="password" id="password" className="FormField__Input" 
                    placeholder="Digite sua senha" name="password" 
                    value={this.state.password} onChange={this.handleChange}/>
                </div>
                <div className="FormField">
                    <button className="FormField__Button mr-20">Entrar</button> 
                    <Link to="/" className="FormField__Link">Crie sua conta</Link>
                </div>
                </form>
            </div>
        );
    }
}

export default EntrarForm;