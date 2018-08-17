import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App__Aside">
          <div className="App__Aside__BG"></div>
        </div>
        <div className="App__Form">
          <div className="PageSwitcher">
            <a href="#" className="PageSwitcher__Item PageSwitcher__Item">Entrar</a>
            <a href="#" className="PageSwitcher__Item PageSwitcher__Item--Active">Cadastrar</a>
          </div>

          <div className="FormTitle">
            <a href="#" className="FormTitle__Link">Entre</a> ou <a href="#" 
            className="FormTitle__Link--Active">Cadastre-se</a>
          </div>

          <div className="FormCenter">
            <form className="FormFields" onSubmit={this.handleSubmit}>
              <div className="FormField">
                <label className="FormField__Label" htmlFor="name">Nome Completo</label>
                <input type="text" id="name" className="FormField__Input" placeholder="Digite seu nome completo" name="name"/>
              </div>
              <div className="FormField">
                <label className="FormField__Label" htmlFor="password">Senha</label>
                <input type="password" id="password" className="FormField__Input" placeholder="Digite sua senha" name="password"/>
              </div>
              <div className="FormField">
                <label className="FormField__Label" htmlFor="email">E-Mail</label>
                <input type="email" id="email" className="FormField__Input" placeholder="Digite seu e-mail" name="email"/>
              </div>
            </form>
          </div>

        </div>  
      </div>
    );
  }
}

export default App;
