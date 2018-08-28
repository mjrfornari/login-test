import React, { Component, PureComponent } from 'react';
import {BrowserRouter as Router, Route, Link, NavLink} from 'react-router-dom';
import logo from './delphus.svg';
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

                <Route exact path="/" component={EntrarForm}>
                </Route>
                <Route path="/entrar" component={CadastrarForm}>
                </Route>
            </div>  
        </div>
        </Router>
        );
  }
}

export default App;
