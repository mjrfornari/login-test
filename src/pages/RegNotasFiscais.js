import React from "react";
import ReactDOM from "react-dom";
import Clock from 'react-live-clock';
import { Redirect, withRouter } from 'react-router-dom';
import SideNav, { Nav, NavIcon, NavText } from 'react-sidenav';
import SvgIcon from 'react-icons-kit';
import _ from "lodash";
import {LinkContainer} from 'react-router-bootstrap'
import { ic_account_box } from 'react-icons-kit/md/ic_account_box';
import { ic_home } from 'react-icons-kit/md/ic_home'
import { ic_add_shopping_cart } from 'react-icons-kit/md/ic_add_shopping_cart';
import { ic_exit_to_app } from 'react-icons-kit/md/ic_exit_to_app'
import {ic_build} from 'react-icons-kit/md/ic_build'
import {ic_sync} from 'react-icons-kit/md/ic_sync'
import {ic_assignment} from 'react-icons-kit/md/ic_assignment'
import PouchDB from "pouchdb"
import { readTable, editData, appendData } from "./Utils";
import {ic_keyboard_arrow_left} from 'react-icons-kit/md/ic_keyboard_arrow_left'
import {ic_keyboard_arrow_right} from 'react-icons-kit/md/ic_keyboard_arrow_right'





const db = new PouchDB('macropecas')



class Example extends React.Component {
    constructor(props, context) {
    super(props, context);
    this.state = {
        clientes  : [],
        show: false,
        now : {PK_CLI: 0, RAZAO_SOCIAL: '', CNPJ: '', FONE1: '', CODIGO_REPRESENTADA:''},
        append: false,
        isLoading: true,
        id: 0,
        ok: false
    };
    this.show = false
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)
    this.saveBtn = this.saveBtn.bind(this)
    this.hideShow = this.hideShow.bind(this);
    this.handleBar = this.handleBar.bind(this);
    this.appBar = this.appBar.bind(this);
  }
  
    saveBtn(ok) {
        if (ok === false){
            return (<input type="submit" className="FormField__Button mr-20" value="Salvar" onSubmit={this.handleSubmit}/>)
        } else {
            return (<input type="submit" className="FormField__ButtonDisabled mr-20" value="Salvar"/>)
        }
    }

    appBar(mostra){
        console.log(mostra)
        if (mostra){
            return(
                <div className='App__Aside'>
                        <div>   
                            <SideNav highlightColor='white' highlightBgColor='#506b55' defaultSelected='notas'
                                        onItemSelection={ (id, parent) => {
                                            if (id==='exit'){  
                                                localStorage.setItem("logou", false);    
                                                this.props.history.push('/')
                                            } else {this.props.history.push('/'+id)
                            }}}>                      
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
            ) 
        } else {
            return(
                <div className='App__Aside__Hide'>
                </div> 
            )
        }
    }

    handleBar(e){
        e.preventDefault()
        let showBar = this.state.show
        console.log('a - '+showBar)
        this.setState({show: !(showBar)})
    }
    
    hideShow(){
        let show = this.state.show
        if (show) {        
            return (<button className="FormField__Button__HideShow" onClick={this.handleBar}><SvgIcon className='FormField__Icon__ShowHide' size={32} icon={ic_keyboard_arrow_left}/></button>)
        } else {
            
            return (<button className="FormField__Button__HideShow" onClick={this.handleBar}><SvgIcon className='FormField__Icon__ShowHide' size={32} icon={ic_keyboard_arrow_right}/></button>)
        }
    }

    componentDidMount(){
        let pathname = this.props.location.pathname
        if (pathname.includes('notas')) {           
            if (this.state.isLoading == true) {
                if (this.props.location.pathname !== '/notas/registro') {
                    let ID = this.props.location.pathname.replace('/notas/registro/','');
                    readTable(Data => { this.setState({clientes: Data.data.clientes, isLoading: true})
                        this.setState({now: Data.data.clientes[ID], id: ID, isLoading: false})  
                    // Data.data.clientes.forEach(element => {
                    //         if (element.PK_CLI == ID){
                    //             this.setState({now: element, isLoading: false})
                    //         }
                    //     });
                
                    })
                } else {
                this.setState({append: true, isLoading: false})
                }
            }
        }
    }

  
    handleSubmit (e) {
        e.preventDefault();
        // console.log('a')
        if (this.state.ok ===false){
            if (this.state.append == true) {
                appendData('clientes', this.state.now)     
                alert('Registro incluído com sucesso!') 
                this.setState({ok: true})    
            } else {
                editData('clientes', this.state.now, this.state.id)
                alert('Registro alterado com sucesso!')  
                this.setState({ok: true})  
            }
        }

    }

  handleChange(e){
        let target = e.target
        let value = target.type === 'checkbox' ? target.checked : target.value
        let name = target.name
        if (name != 'PK_CLI'){
            let reg = this.state.now
            reg[name] = value
                this.setState({
                    now : reg
                })
        }
  }


 render() {
    let bar = this.appBar(this.state.show);
    console.log(this.state.show)
    let logou = localStorage.getItem("logou");
    if (logou === "true") {
        return (     
                    
                    <div className="App">
                        {bar} 
                        <div className="App__Form">
                            <div className="FormCenter">
                                <div className="FormTitle">
                                    <Clock format={'DD/MM/YYYY - HH:mm'} ticking={true}/> 
                                    <br/>
                                    <h1 className="FormTitle__Link--Active">Registro de Notas Fiscais</h1>
                                </div>
                                <form className="FormFields" onSubmit={this.handleSubmit}>
                                <div className="FormField">
                                    <label className="FormField__Label" htmlFor="RAZAO_SOCIAL">Razão Social</label>
                                    <input type="text" id="RAZAO_SOCIAL" className="FormField__Input" 
                                    name="RAZAO_SOCIAL" value={this.state.now.RAZAO_SOCIAL} onChange={this.handleChange}/>
                                </div>
                                <div className="FormField">
                                    <label className="FormField__Label" htmlFor="CNPJ">CNPJ</label>
                                    <input type="text" id="CPNJ" className="FormField__Input" 
                                    name="CNPJ" value={this.state.now.CNPJ} onChange={this.handleChange}/>
                                </div>
                                <div className="FormField">
                                    <label className="FormField__Label" htmlFor="password">Telefone 1</label>
                                    <input type="text" id="FONE1" className="FormField__Input" 
                                    name="FONE1" value={this.state.now.FONE1} onChange={this.handleChange}/>
                                </div>
                                
                                {this.saveBtn(this.state.ok)}
                                <LinkContainer to="/notas"><button className="FormField__Button mr-20">Voltar</button></LinkContainer>
                                {this.hideShow()}
                            </form>
                            </div>
                        </div>
                    </div>
            )
    } else { return <Redirect exact to="/"/>}
  }
}




export default Example;
