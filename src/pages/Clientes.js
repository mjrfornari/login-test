import React from "react";
import ReactDOM from "react-dom";
import Clock from 'react-live-clock';
import { Redirect } from 'react-router-dom';
import SideNav, { Nav, NavIcon, NavText } from 'react-sidenav';
import SvgIcon from 'react-icons-kit';
import _ from "lodash";
import { ic_account_box } from 'react-icons-kit/md/ic_account_box';
import { ic_home } from 'react-icons-kit/md/ic_home'
import { ic_add_shopping_cart } from 'react-icons-kit/md/ic_add_shopping_cart';
import { ic_exit_to_app } from 'react-icons-kit/md/ic_exit_to_app'
import {ic_build} from 'react-icons-kit/md/ic_build'
import {ic_sync} from 'react-icons-kit/md/ic_sync'
import {ic_assignment} from 'react-icons-kit/md/ic_assignment'
import {ListGroup, ListGroupItem, Button} from 'react-bootstrap'
import PouchDB from "pouchdb"
import { readData } from "./Utils";





const db = new PouchDB('macropecas')





class Example extends React.Component {
    constructor() {
    super();
    this.state = {
        clientes  : []
    };
    this.handleRefresh = this.handleRefresh.bind(this);
    this.createItems = this.createItems.bind(this);
  }
  
  createItems(item){
        return <ListGroupItem header={item.RAZAO_SOCIAL} href="#">CNPJ: {item.CNPJ}<br/>Código: {item.PK_CLI}</ListGroupItem>
    }

  handleRefresh(e){
    readData(Data => {this.setState({clientes: Data.data.clientes})})         
  }

 render() {
    let Data = this.state.clientes
    let listData = Data.map(this.createItems)
    let logou = localStorage.getItem("logou");
    console.log('a '+logou)
    if (logou === "true") {
    return (        
              <div className="App">
                <div className="App__Aside">
                    <div> 
                        <SideNav highlightColor='white' highlightBgColor='#506b55' defaultSelected='clientes'
                         onItemSelection={ (id, parent) => {
                            if (id==='exit'){  
                                localStorage.setItem("logou", false);    
                                this.props.history.push('../')
                            } else {this.props.history.push('../'+id)
                        }
                        }}>       
                            <Nav id='home'>
                                <NavIcon><SvgIcon size={30} icon={ic_home}/></NavIcon>    
                                <NavText> Página Inicial </NavText>
                            </Nav>
                            <Nav id='clientes'>
                                <NavIcon><SvgIcon size={30} icon={ic_account_box}/></NavIcon>    
                                <NavText> Clientes </NavText>
                            </Nav>
                            <Nav id='pedidos'>
                                <NavIcon><SvgIcon size={30} icon={ic_add_shopping_cart}/></NavIcon>
                                <NavText> Pedidos </NavText>
                            </Nav>
                            <Nav id='produtos'>
                                <NavIcon><SvgIcon size={30} icon={ic_build}/></NavIcon>
                                <NavText> Produtos </NavText>
                            </Nav>
                            <Nav id='notas'>
                                <NavIcon><SvgIcon size={30} icon={ic_assignment}/></NavIcon>
                                <NavText> Notas Fiscais </NavText>
                            </Nav>
                            <Nav id='sync'>
                                <NavIcon><SvgIcon size={30} icon={ic_sync}/></NavIcon>
                                <NavText> Sincronização </NavText>
                            </Nav>
                            <Nav id='exit'>
                                <NavIcon><SvgIcon size={30} icon={ic_exit_to_app}/></NavIcon>
                                <NavText> Sair </NavText>
                            </Nav>
                        </SideNav>
                    </div>
                </div> 
                <div className="App__Form">
                    <div className="FormCenter">
                        <div className="FormTitle">
                            <Clock format={'DD/MM/YYYY - HH:mm'} ticking={true}/> 
                            <br/>
                            <h1 className="FormTitle__Link--Active">Clientes</h1>
                        </div>
                        <form className="FormFields">  
                        <button className="FormField__Button" onClick={this.handleRefresh}>Processar</button>     
                            <ListGroup>
                                {listData}
                            </ListGroup>
                        </form> 
                    </div>
                </div>
            </div>
    );} else { return <Redirect exact to="/"/>}
  }
}




export default Example;
