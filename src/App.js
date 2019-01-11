import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
// import logo from './delphus.svg';
import Menu from './pages/Menu';
import Clientes from './pages/Clientes';
import Pedidos from './pages/Pedidos';
import Sync from './pages/Sincronizacao';
import Produtos from './pages/Produtos';
import EntrarForm from './pages/EntrarForm';
import RegClientes from './pages/RegClientes'
import RegPedidos from './pages/RegPedidos'
import './App.css';



class App extends Component {
    

    render() {
        return (
        <Router>
            <Switch>  
                <Route exact path="/macropecas-web" component={EntrarForm}>
                </Route>
                <Route path="/macropecas-web/home" component={Menu}>
                </Route>
                <Route path="/macropecas-web/clientes/registro" component={RegClientes}>
                </Route>
                <Route exact path="/macropecas-web/clientes" component={Clientes}>
                </Route>
                <Route path="/macropecas-web/pedidos/registro" component={RegPedidos}>
                </Route>
                <Route exact path="/macropecas-web/pedidos" component={Pedidos}>
                </Route>
                <Route path="/macropecas-web/produtos" component={Produtos}>
                </Route>
                <Route path="/macropecas-web/sync" component={Sync}>
                </Route>
                <Route component={Menu}>
                </Route>
            </Switch>
        </Router>
        );
  }
}

export default App;
