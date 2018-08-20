import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Link, NavLink} from 'react-router-dom';
import logo from './logo.svg';
import CadastrarForm from './pages/CadastrarForm';
import EntrarForm from './pages/EntrarForm';
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>  
        <div className="App">
        <div className="App__Aside">
          {/* <div className="App__Aside__BG"></div> */}
          <img src='/logo.png' className='App__Aside__BG' alt='Delphus'/>  
        </div>
        <div className="App__Form">
            <div className="PageSwitcher">
              <NavLink to="/entrar" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Entrar</NavLink>
              <NavLink exact to="/" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Cadastrar</NavLink>
            </div>

            <div className="FormTitle"> 
              <NavLink to="/entrar" activeClassName="FormTitle__Link--Active" className="FormTitle__Link">Entre</NavLink> ou <NavLink exact to="/" 
              activeClassName="FormTitle__Link--Active" className="FormTitle__Link">Cadastre-se</NavLink>
            </div>

            <Route exact path="/" component={CadastrarForm}>
            </Route>
            <Route path="/entrar" component={EntrarForm}>
            </Route>
        </div>  
      </div>
      </Router>
    );
  }
}

export default App;
