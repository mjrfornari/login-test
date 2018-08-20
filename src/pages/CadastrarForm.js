import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class CadastrarForm extends Component {

    constructor(){
        super();

        this.state = {
            email:'',
            password:'',
            name:''
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
                    <label className="FormField__Label" htmlFor="name">Nome Completo</label>
                    <input type="text" id="name" className="FormField__Input" placeholder="Digite seu nome completo" 
                    name="name" value={this.state.name} onChange={this.handleChange}/>
                </div>
                <div className="FormField">
                    <label className="FormField__Label" htmlFor="password">Senha</label>
                    <input type="password" id="password" className="FormField__Input" placeholder="Digite sua senha" 
                    name="password" value={this.state.password} onChange={this.handleChange}/>
                </div>
                <div className="FormField">
                    <label className="FormField__Label" htmlFor="email">E-Mail</label>
                    <input type="email" id="email" className="FormField__Input" placeholder="Digite seu e-mail" 
                    name="email" value={this.state.email} onChange={this.handleChange}/>
                </div>
                <div className="FormField">
                    <button className="FormField__Button mr-20">Cadastrar</button> 
                    <Link to="/entrar" className="FormField__Link">Já possuo cadastro</Link>
                </div>
              </form>
            </div>
        );
    }
}

export default CadastrarForm;