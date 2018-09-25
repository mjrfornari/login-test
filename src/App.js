import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
// import logo from './delphus.svg';
import Menu from './pages/Menu';
import Clientes from './pages/Clientes';
import Pedidos from './pages/Pedidos';
import NotasFiscais from './pages/NotasFiscais';
import Sync from './pages/Sincronizacao';
import Produtos from './pages/Produtos';
import EntrarForm from './pages/EntrarForm';
import RegClientes from './pages/RegClientes'
import './App.css';


class App extends Component {
           

    render() {
        return (
        <Router>
            <Switch>  
                <div>

                    <Route exact path="/" component={EntrarForm}>
                    </Route>
                    <Route path="/home" component={Menu}>
                    </Route>
                    <Route path="/clientes/registro" component={RegClientes}>
                    </Route>
                    <Route exact path="/clientes" component={Clientes}>
                    </Route>
                    <Route path="/pedidos" component={Pedidos}>
                    </Route>
                    <Route path="/produtos" component={Produtos}>
                    </Route>
                    <Route path="/notas" component={NotasFiscais}>
                    </Route>
                    <Route path="/sync" component={Sync}>
                    </Route>


                </div>
            </Switch>
        </Router>
        );
  }
}

export default App;
