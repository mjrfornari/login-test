import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
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
          <div className="App__Aside__BG"></div>
        </div>
        <div className="App__Form">
          <div className="PageSwitcher">
            <a href="#" className="PageSwitcher__Item PageSwitcher__Item">Entrar</a>
            <a href="#" className="PageSwitcher__Item PageSwitcher__Item--Active">Cadastrar</a>
          </div>

          <div className="FormTitle"> 
            <Link to="/entrar" className="FormTitle__Link">Entre</Link> ou <Link to="/" 
            className="FormTitle__Link--Active">Cadastre-se</Link>
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
