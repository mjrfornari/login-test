import React from "react";
// import { render } from "react-dom";
import { Redirect } from 'react-router-dom';
import SideNav, { Nav, NavIcon, NavText } from 'react-sidenav';
import SvgIcon from 'react-icons-kit';
import { ic_account_box } from 'react-icons-kit/md/ic_account_box';
import { ic_home } from 'react-icons-kit/md/ic_home'
import { ic_add_shopping_cart } from 'react-icons-kit/md/ic_add_shopping_cart';
import { ic_settings } from 'react-icons-kit/md/ic_settings'
import {ic_build} from 'react-icons-kit/md/ic_build'
import {ic_exit_to_app} from 'react-icons-kit/md/ic_exit_to_app'
import { syncData, createToFirebird, updateToFirebird, syncLoading, date2str  } from "./Utils";
import Clock from 'react-live-clock';
import ReactLoading from 'react-loading';
import { Offline, Online } from "react-detect-offline";
// import { pedirPermissaoParaReceberNotificacoes } from '../push-notification';
// import { ic_exit_to_app } from "react-icons-kit/md/ic_exit_to_app";

// const db = new PouchDB('macropecas')




class Example extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      pages: null,
      loading: true,
      sync: false,
      reload: 0,
      savingShow: {display: 'none'},
      savingPhase: 1,
      updatingShow: {display: 'none'},
      updatingPhase: 1
    };
    this.handleSync = this.handleSync.bind(this);
    this.handleTeste = this.handleTeste.bind(this);
    this.saving = this.saving.bind(this);
  }

    sincronizando(ok) {
        if (ok === false){
            return (<input type="submit" className="FormField__Button__Center mr-20" value="Sincronizar" onClick={this.handleSync}/>)
        } else {
            return (<ReactLoading type='spokes' color='var(--cor-1)' height={'5%'} width={'5%'} className='Loading'/>)
        }
    }

    atualizando(ok) {
        if (ok === false){
            return (<input type="submit" className="FormField__Button__Center mr-20" value="Atualizar" onClick={() => {
                this.setState({sync: true, updatingPhase: 1, updatingShow:{}})
                setTimeout(() => {
                    localStorage.setItem("macroupdate", new Date())
                    this.setState({sync: false, updatingPhase: 2, updatingShow:{}})
                },
                3000)
                
            }}/>)
        } else {
            return (<ReactLoading type='spokes' color='var(--cor-1)' height={'5%'} width={'5%'} className='Loading'/>)
        }
    }

    saving(){
        this.setState({savingShow: {display: 'none'}})
    }

    updating(){
        window.location.reload(true)
    }

    handleSync (e) {
        
        e.preventDefault(); 
        this.setState({sync: true, savingPhase: 1, savingShow:{}}) 
        createToFirebird(() => {   
            updateToFirebird(() => { 
                syncData(localStorage.getItem('macropecas'), ()=> {this.setState({sync: false, savingPhase: 2, savingShow:{}})
                localStorage.setItem("macrosync", new Date())})
            })
        })
        // createToFirebird(() => {
        //     updateToFirebird(() => {console.log('A')})
        // })
        
    }

    

    handleTeste(e){
        e.preventDefault();
        navigator.serviceWorker.getRegistration().then(function(reg){reg.showNotification('Teste')})
    }

    hideBar(){
        if (this.state.sync === true){
            return 'App__Aside__Hide'
        } else return 'App__Aside'
    }

  render() {
    let logou = localStorage.getItem("logou");
    if (logou === "true") {
    return (
              <div className="App">
                <div className={this.hideBar()}>
                    {/* <div className="App__Aside__BG"></div> */}
                    <div> 
                        <SideNav highlightColor='var(--cor-letra)' highlightBgColor='var(--cor-menu)' defaultSelected='sync' 
                        onItemSelection={ (id, parent) => {
                            if (id==='exit'){  
                                localStorage.setItem("logou", false);    
                                this.props.history.push('/macropecas/')
                            } else this.props.history.push('/macropecas/'+id)
                        }}>       
                                <Nav id='home'>
                                    <NavIcon className='BarIcon'><SvgIcon size={30} icon={ic_home}/></NavIcon>    
                                    <NavText className='BarText'> Página Inicial </NavText>
                                </Nav>
                                <Nav id='clientes'>
                                    <NavIcon className='BarIcon'><SvgIcon size={30} icon={ic_account_box}/></NavIcon>    
                                    <NavText className='BarText'> Clientes </NavText>
                                </Nav>
                                <Nav id='produtos'>
                                    <NavIcon className='BarIcon'><SvgIcon size={30} icon={ic_build}/></NavIcon>
                                    <NavText className='BarText'> Produtos </NavText>
                                </Nav>
                                <Nav id='pedidos'>
                                    <NavIcon className='BarIcon'><SvgIcon size={30} icon={ic_add_shopping_cart}/></NavIcon>
                                    <NavText className='BarText'> Pedidos </NavText>
                                </Nav>
                                <Nav id='sync'>
                                    <NavIcon className='BarIcon'><SvgIcon size={30} icon={ic_settings}/></NavIcon>
                                    <NavText className='BarText'> Sistema </NavText>
                                </Nav>
                                <Nav id='exit'>
                                    <NavIcon className='BarIcon'><SvgIcon size={30} icon={ic_exit_to_app}/></NavIcon>
                                    <NavText className='BarText'> Sair </NavText>
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
                            <h1 className="FormTitle__Link--Active">Sistema</h1>
                        </div>
                        <div className="FormField">
                            <Offline>
                                Você está sem internet. Cheque sua conexão.
                            </Offline>
                            <Online>
                                <div className='box_inverted'>
                                    <h1>Sincronização:</h1>
                                    <div>
                                        Última sincronização: {localStorage.getItem("macrosync") ? date2str(localStorage.getItem("macrosync")) : 'Nunca sincronizado.'}<br/>
                                        {this.sincronizando(this.state.sync)}
                                    </div>
                                </div>
                                <div className='box_inverted'>
                                    <h1>Atualização:</h1>
                                    <div>
                                        Última atualização: {localStorage.getItem("macroupdate") ? date2str(localStorage.getItem("macroupdate")) : 'Nunca atualizado.'}<br/>
                                        {this.atualizando(this.state.sync)}
                                    </div>                                    
                                </div>
                                {/* <button onClick={(e)=>{
                                    e.preventDefault();
                                    pedirPermissaoParaReceberNotificacoes()}}>Clique aqui para receber notificações</button> */}
                            </Online>
                        </div>

                        {syncLoading(this.state.savingShow, this.state.savingPhase, this.saving, 'Sincronizando...', 'Sincronização realizada com sucesso!')}
                        {syncLoading(this.state.updatingShow, this.state.updatingPhase, this.updating, 'Atualizando...', 'Atualização realizada com sucesso!')}
                        </form>
                    </div>
                </div>
            </div>

    );} else { return <Redirect exact to="/macropecas/"/>}
  }
}

export default Example;