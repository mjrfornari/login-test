import React, { Component } from 'react';

class EntrarForm extends Component {
    render(){
        return(
          <div className="FormCenter">
          <form className="FormFields" onSubmit={this.handleSubmit}>
          <div className="FormField">
              <label className="FormField__Label" htmlFor="email">E-Mail</label>
              <input type="email" id="email" className="FormField__Input" placeholder="Digite seu e-mail" name="email"/>
            </div>
            <div className="FormField">
              <label className="FormField__Label" htmlFor="password">Senha</label>
              <input type="password" id="password" className="FormField__Input" placeholder="Digite sua senha" name="password"/>
            </div>
            <div className="FormField">
              <button className="FormField__Button mr-20">Entrar</button> 
              <a href="#" className="FormField__Link">Já possuo cadastro</a>
            </div>
          </form>
        </div>
        );
    }
}

export default EntrarForm;