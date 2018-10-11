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
import {ListGroup, ListGroupItem, Modal, Button} from 'react-bootstrap'
import PouchDB from "pouchdb"
import { readTable, editData, appendData } from "./Utils";
import {ic_keyboard_arrow_left} from 'react-icons-kit/md/ic_keyboard_arrow_left'
import {ic_keyboard_arrow_right} from 'react-icons-kit/md/ic_keyboard_arrow_right'
import Downshift from 'downshift';

let items = []



const db = new PouchDB('macropecas')



class Example extends React.Component {
    constructor(props, context) {
    super(props, context);
    this.state = {
        pedidos  : [],
        clientes : [],
        cliente : [],
        cond_pag: [],
        cond_pags: [],
        now : {NUMPED: 0, RAZAO_SOCIAL: '', CNPJ: '', FONE1: '', CODIGO_REPRESENTADA:''},
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
    this.showModal = this.showModal.bind(this)
    this.hideShow = this.hideShow.bind(this);
    this.handleBar = this.handleBar.bind(this);
    this.appBar = this.appBar.bind(this);
    this.itens = this.itens.bind(this);
    this.createSons = this.createSons.bind(this)
  }
  
    saveBtn(ok) {
        if (ok === false){
            return (<input type="submit" className="FormField__Button mr-20" value="Salvar" onSubmit={this.handleSubmit}/>)
        } else {
            return (<input type="submit" className="FormField__ButtonDisabled mr-20" value="Salvar"/>)
        }
    }

    createSons(item, id){
        return(
            <ListGroupItem href="#" className="FormField__Grid" onClick={this.showModal}>
            Código: {item.CODIGOPRO}<br/>
            Quantidade: {item.QUANTIDADE}<br/>
            Valor: {'R$ '+item.VALOR}<br/>
            Valor ICMS: {'R$ '+(item.VALOR_STICMS||'0.00')}<br/>
            </ListGroupItem>
        )
    }


    appBar(mostra){
        if (mostra){
            return(
                <div className='App__Aside'>
                        <div>   
                            <SideNav highlightColor='white' highlightBgColor='#506b55' defaultSelected='pedidos'
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
        if (pathname.includes('pedidos')) {           
            if (this.state.isLoading == true) {
                if (this.props.location.pathname !== '/pedidos/registro') {
                    let ID = this.props.location.pathname.replace('/pedidos/registro/','');
                    readTable(Data => { this.setState({pedidos: Data.data.pedidos, isLoading: true})
                        this.setState({now: Data.data.pedidos[ID], id: ID, isLoading: false}) 
                        let listClientes = []
                        let listCondPags = []
                        Data.data.clientes.forEach((element, elementid) => {
                            if (element.PK_CLI == Data.data.pedidos[ID].FK_CLI){
                                let cli = {
                                    display : element.RAZAO_SOCIAL,
                                    value : element.CNPJ+' - '+element.RAZAO_SOCIAL
                                }

                                this.setState({cliente: cli})
                            }
                            listClientes.push({value: element.CNPJ+' - '+element.RAZAO_SOCIAL, display: element.RAZAO_SOCIAL})
                        }); 

                        Data.data.cond_pag.forEach((element, elementid) => {
                            if (element.PK_CPG == Data.data.pedidos[ID].FK_CPG){
                                let cpg = {
                                    display : element.NOME,
                                    value : '('+element.CODIGO_REPRESENTADA+') '+element.NOME
                                }

                                this.setState({cond_pag: cpg})
                            }
                            listCondPags.push({value: '('+element.CODIGO_REPRESENTADA+') '+element.NOME, display: element.NOME})
                        }); 
                        this.setState({cond_pags: listCondPags})
                        this.setState({clientes: listClientes})
                
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
                appendData('pedidos', this.state.now)     
                alert('Registro incluído com sucesso!') 
                this.setState({ok: true})    
            } else {
                editData('pedidos', this.state.now, this.state.id)
                alert('Registro alterado com sucesso!')  
                this.setState({ok: true})  
            }
        }

    }

    handleChange(e){
            let target = e.target
            let value = target.type === 'checkbox' ? target.checked : target.value
            let name = target.name
            if (name != 'PK_PED'){
                let reg = this.state.now
                reg[name] = value
                    this.setState({
                        now : reg
                    })
            }
    }

    itens(a,b){
        if (a===b){
            return '✓ '+a.value
        } else {
            return a.value
        }
    }

    autocomplete(table, reg, tablename){
        return(
                                    <Downshift 
                                        onChange={selection => {
                                            this.setState({
                                               [tablename] : selection 
                                            })
                                        }}
                                        itemToString={item => (item ? item.display : '')}
                                        selectedItem={reg}
                                        inputValue={reg.display}
                                        
                                    >
                                        {({
                                        getInputProps,
                                        getItemProps,
                                        getLabelProps,
                                        getMenuProps,
                                        isOpen,
                                        inputValue,
                                        highlightedIndex,
                                        selectedItem,
                                        }) => (
                                        <div>
                                            <input className="FormField__Input" {...getInputProps()} />
                                            <ul {...getMenuProps()} className={isOpen ? "FormField__Complete" : ""}>
                                            {isOpen
                                                ? table
                                                    .filter(item => !inputValue || item.value.includes(inputValue))
                                                    .map((item, index) => (
                                                    <li className="FormField__List"
                                                        {...getItemProps({
                                                        key: item.value,
                                                        index,
                                                        item,
                                                        style: {
                                                            backgroundColor: (selectedItem === item) || (highlightedIndex === index) ? '#506b55' : '#649764',
                                                            color:'white',
                                                            fontWeight: selectedItem === item ? 'bold' : 'normal',
                                                        },
                                                        })}
                                                    >
                                                        <p className='FormField__List__Text'>{this.itens(item,selectedItem)}</p>
                                                    </li>
                                                    ))
                                                : null}
                                            </ul>
                                        </div>
                                        )}
                                    </Downshift>
        )
    }

    showModal(e){
        e.preventDefault;
        return (
            <div className="static-modal">
                <Modal.Dialog>
                    <Modal.Header>
                    <Modal.Title>Modal title</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>One fine body...</Modal.Body>

                    <Modal.Footer>
                    <Button>Close</Button>
                    <Button bsStyle="primary">Save changes</Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </div>
        )
    }
    

    render() {
        let bar = this.appBar(this.state.show);
        let clientes = []
        let mapItens = this.state.now.itens;
        let listItens = []
        if (typeof mapItens != 'undefined'){
            listItens = mapItens.map(this.createSons)}
        let cpgs = []
        if (typeof this.state.clientes == 'undefined'){
            clientes = []
        } else { clientes = this.state.clientes}
        if (typeof this.state.cond_pags == 'undefined'){
            cpgs = []
        } else { cpgs = this.state.cond_pags}
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
                                        <h1 className="FormTitle__Link--Active">Registro de Pedidos</h1>
                                    </div>
                                    <form className="FormFields" onSubmit={this.handleSubmit}>
                                    <div className="FormField">
                                        <label className="FormField__Label" htmlFor="NUMPED">Nº do Pedido</label>
                                        <input type="text" id="NUMPED" className="FormField__Input" 
                                        name="NUMPED" value={this.state.now.NUMPED} onChange={this.handleChange}/>
                                    </div>
                                    <div className="FormField">
                                        <label className="FormField__Label" htmlFor="FK_CLI">Cliente</label>
                                        {this.autocomplete(clientes, this.state.cliente, 'cliente')}
                                        <label className="FormField__Label" htmlFor="FK_CPG">Condição de Pagamento</label>
                                        <Downshift 
                                            // onChange={selection => alert(`You selected ${selection.value}`)}
                                            itemToString={item => (item ? item.display : '')}
                                            selectedItem={this.state.cond_pag} 
                                        >
                                            {({
                                            getInputProps,
                                            getItemProps,
                                            getLabelProps,
                                            getMenuProps,
                                            isOpen,
                                            initialInputValue,
                                            inputValue,
                                            highlightedIndex,
                                            selectedItem,
                                            }) => (
                                            <div>
                                                <input className="FormField__Input" {...getInputProps()} />
                                                <ul {...getMenuProps()} className={isOpen ? "FormField__Complete" : ""}>
                                                {isOpen
                                                    ? cpgs
                                                        .filter(item => !inputValue || item.value.includes(inputValue))
                                                        .map((item, index) => (
                                                        <li className="FormField__List"
                                                            {...getItemProps({
                                                            key: item.value,
                                                            index,
                                                            item,
                                                            style: {
                                                                backgroundColor: (selectedItem === item) || (highlightedIndex === index) ? '#506b55' : '#649764',
                                                                color:'white',
                                                                fontWeight: selectedItem === item ? 'bold' : 'normal',
                                                            },
                                                            })}
                                                        >
                                                            <p className='FormField__List__Text'>{this.itens(item,selectedItem)}</p>
                                                        </li>
                                                        ))
                                                    : null}
                                                </ul>
                                            </div>
                                            )}
                                        </Downshift>
                                    </div>    
                                    <div>
                                        Itens:
                                        <ListGroup>
                                            {listItens}
                                        </ListGroup>
                                    </div>
                                    {this.saveBtn(this.state.ok)}
                                    <LinkContainer to="/pedidos"><button className="FormField__Button mr-20">Voltar</button></LinkContainer>
                                </form>
                                </div>
                            </div>
                        </div>
                )
        } else { return <Redirect exact to="/"/>}
    }
}




export default Example;
