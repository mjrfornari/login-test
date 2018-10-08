import React from "react";
// import { render } from "react-dom";
import { Redirect } from 'react-router-dom';
import SideNav, { Nav, NavIcon, NavText } from 'react-sidenav';
import SvgIcon from 'react-icons-kit';
import { ic_account_box } from 'react-icons-kit/md/ic_account_box';
import { ic_home } from 'react-icons-kit/md/ic_home'
import { ic_add_shopping_cart } from 'react-icons-kit/md/ic_add_shopping_cart';
import { ic_exit_to_app } from 'react-icons-kit/md/ic_exit_to_app'
import {ic_build} from 'react-icons-kit/md/ic_build'
import {ic_sync} from 'react-icons-kit/md/ic_sync'
import {ic_assignment} from 'react-icons-kit/md/ic_assignment'
import { syncData, createToFirebird, updateToFirebird } from "./Utils";
import {promisify} from 'util';
import Clock from 'react-live-clock';
import PouchDB from "pouchdb"
import { utils } from "mocha";
import { func } from "prop-types";
import Loading from "react-loading-animation"
import ReactLoading from 'react-loading';
import { Offline, Online } from "react-detect-offline";

const db = new PouchDB('macropecas')




class Example extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      pages: null,
      loading: true,
      sync: false
    };

    this.handleSync = this.handleSync.bind(this);
    this.handleTeste = this.handleTeste.bind(this);
    
  }

    sincronizando(ok) {
        if (ok === false){
            return (<input type="submit" className="FormField__Button mr-20" value="Sincronizar" onClick={this.handleSync}/>)
        } else {
            return (<ReactLoading type='spokes' color='green' height={'5%'} width={'5%'} className='Loading'/>)
        }
    }


    handleSync (e) {
        
       e.preventDefault(); 
       this.setState({sync: true}) 
       createToFirebird('PK_CLI', () => {      
            updateToFirebird('PK_CLI', () => { 
                syncData(localStorage.getItem('macropecas'), ()=> {this.setState({sync: false})})}
            )}
        )
        
        
    }

    handleTeste(e){
      e.preventDefault();  
      syncData(localStorage.getItem('macropecas'))
    }

  render() {
    let logou = localStorage.getItem("logou");
    if (logou === "true") {
    return (
              <div className="App">
                <div className="App__Aside">
                    {/* <div className="App__Aside__BG"></div> */}
                    <div> 
                        <SideNav highlightColor='white' highlightBgColor='#506b55' defaultSelected='sync' 
                        onItemSelection={ (id, parent) => {
                            if (id==='exit'){  
                                localStorage.setItem("logou", false);    
                                this.props.history.push('/')
                            } else this.props.history.push('/'+id)
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
                        <form className="FormFields">
                        <div className="FormTitle"> 
                            <Clock format={'DD/MM/YYYY - HH:mm'} ticking={true}/> 
                            <br/>
                            <h1 className="FormTitle__Link--Active">Sincronização</h1>
                        </div>
                        <div className="FormField">
                            <Offline>Você está sem internet. Cheque sua conexão.</Offline>
                            <Online>{this.sincronizando(this.state.sync)}</Online>
                        </div>

                        </form>
                    </div>
                </div>
            </div>

    );} else { return <Redirect exact to="/"/>}
  }
}

export default Example;