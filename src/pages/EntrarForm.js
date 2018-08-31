import React, { Component } from 'react';
import { Link, Router, Route, Redirect } from 'react-router-dom';
import {browserHistory} from 'react-router';
import axios from 'axios';



class EntrarForm extends Component {

    constructor(){
        super();

        this.state = {
            user:'',
            password:''
        };

        this.logado = false;

        this.handleChange = this.handleChange.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit (e) {
        e.preventDefault();
        if ((this.state.user!=='') && (this.state.password!=='')){
            fetch('http://localhost:3001/login/'+this.state.user+'/'+this.state.password).then(r => r.json()).then(r => {
                this.logado=false;
            
                if (Object.keys(r).length > 0){
                    if (r[0]["PK_VEN"] !== '') {
                        this.logado=true
                        this.props.history.push('/entrar')   
                                          
                    }
                }
                console.log(this.logado)
                localStorage.setItem("logou", this.logado);
            })
        }
    }
    


    handleChange(e){
        let target = e.target
        let value = target.type === 'checkbox' ? target.checked : target.value
        let name = target.name

        this.setState({
            [name]: value
        });
    }

    handleUserChange(e){
        let target = e.target
        let value = target.type === 'checkbox' ? target.checked : target.value
        let name = target.name

        value = value.replace(/\D/g,'');

        this.setState({
            [name]: value
        });
    
    }
    
    // handleSubmit(e){
    //     e.preventDefault();
    //     console.log('The form was submitted with the followind data:')
    //     console.log(this.state)

    // }

  
   
    render(){
        return(
            <div className="FormCenter">
                <form className="FormFields" onSubmit={this.handleSubmit}>
                <div className="FormTitle"> 
                    <h1 className="FormTitle__Link--Active">Login</h1>
                </div>
                <div className="FormField">
                    <label className="FormField__Label" htmlFor="user">CPF ou CNPJ</label>
                    <input type="text" id="user" className="FormField__Input" 
                    placeholder="Digite seu CPF ou CNPJ" name="user"
                    value={this.state.user} onChange={this.handleUserChange}/>
                </div>
                <div className="FormField">
                    <label className="FormField__Label" htmlFor="password">Senha</label>
                    <input type="password" id="password" className="FormField__Input" 
                    placeholder="Digite sua senha" name="password" 
                    value={this.state.password} onChange={this.handleChange}/>
                </div>
                <div className="FormField">
                    <button className="FormField__Button mr-20">Entrar</button> 
                    {/* <Link to="/entrar" className="FormField__Button mr-20">Sair</Link> */}
                </div>
                </form>
            </div>
        );
    }
}

export default EntrarForm;