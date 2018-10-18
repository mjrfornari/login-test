import React from "react";
import Clock from 'react-live-clock';
import { Redirect } from 'react-router-dom';
import SideNav, { Nav, NavIcon, NavText } from 'react-sidenav';
import SvgIcon from 'react-icons-kit';
import {LinkContainer} from 'react-router-bootstrap'
import { ic_account_box } from 'react-icons-kit/md/ic_account_box';
import { ic_home } from 'react-icons-kit/md/ic_home'
import { ic_add_shopping_cart } from 'react-icons-kit/md/ic_add_shopping_cart';
import { ic_exit_to_app } from 'react-icons-kit/md/ic_exit_to_app'
import {ic_build} from 'react-icons-kit/md/ic_build'
import {ic_sync} from 'react-icons-kit/md/ic_sync'
import {ic_assignment} from 'react-icons-kit/md/ic_assignment'
import {ListGroup, ListGroupItem, Modal, Button} from 'react-bootstrap'
// import PouchDB from "pouchdb"
import {plus} from 'react-icons-kit/fa/plus'
import { readTable, editData, appendData } from "./Utils";
import {ic_keyboard_arrow_left} from 'react-icons-kit/md/ic_keyboard_arrow_left'
import {ic_keyboard_arrow_right} from 'react-icons-kit/md/ic_keyboard_arrow_right'
import Downshift from 'downshift';

// let items = []



// const db = new PouchDB('macropecas')



class Example extends React.Component {
    constructor(props, context) {
    super(props, context);
    this.state = {
        pedidos  : [],
        clientes : [],
        cliente : {display: '', value: '', codigo: ''},
        cond_pag: {display: '', value: '', codigo: ''},
        cond_pags: [],
        now : {NUMPED:0, FK_CLI: 0, FK_CPG: 0, PK_PED: 0 },
        editIte: {CODIGOPRO: '', VALOR: '', TOTAL: '', DESCONTO1: '', id:0},
        append: false,
        isLoading: true,
        id: 0,
        ok: false,
        mostraModal: false,
        appendItem: false
    };
    this.show = false
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeItem = this.handleChangeItem.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)
    this.saveBtn = this.saveBtn.bind(this)
    this.showModal = this.showModal.bind(this)
    this.saveModal = this.saveModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.mostraItem = this.mostraItem.bind(this)
    this.hideShow = this.hideShow.bind(this);
    this.handleBar = this.handleBar.bind(this);
    this.appBar = this.appBar.bind(this);
    this.itens = this.itens.bind(this);
    this.createSons = this.createSons.bind(this)
    this.willShow = this.willShow.bind(this)
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
            <ListGroupItem href="#" id={id} className="FormField__Grid" onClick={this.willShow}>
            <div id={id} class="row">
                <div id={id} class="column_left">
                    Nº {id+1}
                </div>
                <div id={id} class="column">
                    Código: {item.CODIGOPRO}<br/>
                    Quantidade: {item.QUANTIDADE}<br/>
                    Valor: {'R$ '+item.VALOR}<br/>
                    Valor ICMS: {'R$ '+(item.VALOR_STICMS||'0.00')}<br/>
                </div>
            </div>
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
            if (this.state.isLoading === true) {
                if (this.props.location.pathname !== '/pedidos/registro') {
                    let ID = this.props.location.pathname.replace('/pedidos/registro/','');
                    readTable(Data => { this.setState({pedidos: Data.data.pedidos, isLoading: true})
                        this.setState({now: Data.data.pedidos[ID], id: ID, isLoading: false}) 
                        let listClientes = []
                        let listCondPags = []
                        Data.data.clientes.forEach((element, elementid) => {
                            if (element.PK_CLI === Data.data.pedidos[ID].FK_CLI){
                                let cli = {
                                    display : element.RAZAO_SOCIAL,
                                    value : element.CNPJ+' - '+element.RAZAO_SOCIAL,
                                    codigo : element.PK_CLI
                                }

                                this.setState({cliente: cli})
                            }
                            listClientes.push({value: element.CNPJ+' - '+element.RAZAO_SOCIAL, display: element.RAZAO_SOCIAL, codigo : element.PK_CLI})
                        }); 

                        Data.data.cond_pag.forEach((element, elementid) => {
                            if (element.PK_CPG === Data.data.pedidos[ID].FK_CPG){
                                let cpg = {
                                    display : element.NOME,
                                    value : '('+element.CODIGO_REPRESENTADA+') '+element.NOME,
                                    codigo : element.PK_CPG
                                }

                                this.setState({cond_pag: cpg})
                            }
                            listCondPags.push({value: '('+element.CODIGO_REPRESENTADA+') '+element.NOME, display: element.NOME, codigo : element.PK_CPG})
                        }); 
                        this.setState({cond_pags: listCondPags})
                        this.setState({clientes: listClientes})
                
                    })
                } else {
                readTable(Data => { this.setState({pedidos: Data.data.pedidos, isLoading: false})
                        let listClientes = []
                        let listCondPags = []
                        Data.data.clientes.forEach((element, elementid) => {
                            listClientes.push({value: element.CNPJ+' - '+element.RAZAO_SOCIAL, display: element.RAZAO_SOCIAL, codigo : element.PK_CLI})
                        }); 

                        Data.data.cond_pag.forEach((element, elementid) => {
                            listCondPags.push({value: '('+element.CODIGO_REPRESENTADA+') '+element.NOME, display: element.NOME, codigo : element.PK_CPG})
                        }); 
                        this.setState({cond_pags: listCondPags})
                        this.setState({clientes: listClientes})
                
                    })
                this.setState({append: true, isLoading: false})
                }
            }
        }
    }

  
    handleSubmit (e) {
        e.preventDefault();
        // console.log('a')
        if (this.state.ok ===false){
            if (this.state.append === true) {
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
            if (name !== 'PK_PED'){
                let reg = this.state.now
                reg[name] = value
                    this.setState({
                        now : reg
                    })
            }
    }

    handleChangeItem(e, id){
            let target = e.target
            let value = target.type === 'checkbox' ? target.checked : target.value
            let name = target.name
            let reg = this.state.editIte
            if (name !== 'TOTAL'){
                reg[name] = value
                console.log('editou')
            }
            if ((name === 'VALOR') || (name === 'DESCONTO1') || (name === 'QUANTIDADE') ){
                console.log('editou total')
               reg['TOTAL'] = reg['VALOR'] * reg['QUANTIDADE'] * ((100-reg['DESCONTO1'])/100) 
            }
            this.setState({editIte: reg})
    }

    itens(a,b){
        if (a===b){
            return '✓ '+a.value
        } else {
            return a.value
        }
    }

    salvaComplete(selecionado, nomefk, tablename){
        let reg = this.state.now
        reg[nomefk] = selecionado.codigo
        if (nomefk === 'FK_CLI'){
            reg.RAZAO_SOCIAL = selecionado.display
        } else if (nomefk === 'FK_CPG') {
            reg.NOMECPG = selecionado.display
        }
        this.setState({now: reg, [tablename]: selecionado})
        console.log(reg)

    }

    autocomplete(table, reg, tablename, nomefk){
        return(
                                    <Downshift 
                                        onChange={selection => {
                                            this.salvaComplete(selection, nomefk, tablename)
                                        }}
                                        itemToString={item => (item ? item.display : '')}
                                        selectedItem={reg}
                                        // inputValue={reg.display}
                                        
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
                                                    .filter(item => !inputValue.toUpperCase() || item.value.includes(inputValue.toUpperCase()))
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

    showModal(){
        // alert(this.state.mostraModal)
        if (this.state.mostraModal === true) {
            return 'ModalShow'
        } else {
            return 'ModalHide'
        }
    }


    closeModal(e){
        e.preventDefault();
        this.setState({mostraModal: false, editIte: {CODIGOPRO: '', VALOR: '', TOTAL: '', DESCONTO1: '', id:0}})
    }

    saveModal(e, id){
        e.preventDefault();
        if (this.state.appendItem === false) {
            let item = Object.assign({},this.state.now)
            item.itens[id] = this.state.editIte;
            this.setState({mostraModal: false, now: item, editIte: {CODIGOPRO: '', VALOR: '', TOTAL: '', DESCONTO1: '', id:0}})
        } else {
            let item = Object.assign({},this.state.now)
            if (typeof item.itens === 'undefined') {
                item.itens = []
                console.log(item.itens)
                item.itens.push(this.state.editIte);
            } else {
                item.itens.push(this.state.editIte);
            }          
            this.setState({mostraModal: false, now: item, editIte: {CODIGOPRO: '', VALOR: '', TOTAL: '', DESCONTO1: '', id:0}})
        }
    }

    willShow(e){
        e.preventDefault(); 
        if (this.state.ok) {
            alert('Edição bloqueada: Pedido já foi salvo. Aperte em "Voltar" e, após, "Editar" novamente.')
        } else { 
            if (e.target.id !== '') {
                let item = Object.assign({},this.state.now.itens[e.target.id])
                item.id = e.target.id
                console.log(item)
                this.setState({mostraModal: true, editIte: item, appendItem: false})
            } else {
                this.setState({mostraModal: true, appendItem: true})
            }         
        }
    }

    mostraItem(campo){
        if (typeof this.state.editIte !== 'undefined'){
            return(this.state.editIte[campo])
        } else {
            console.log('n rolou')
        }
    }
    

    render() {
        let bar = this.appBar(this.state.show);
        let clientes = []
        let mapItens = this.state.now.itens;
        let listItens = []
        if (typeof mapItens !== 'undefined'){
            listItens = mapItens.map(this.createSons)}
        else listItens = (<ListGroupItem className="FormField__Grid">Nenhum item.</ListGroupItem>)
        let cpgs = []
        if (typeof this.state.clientes === 'undefined'){
            clientes = []
        } else { clientes = this.state.clientes}
        if (typeof this.state.cond_pags === 'undefined'){
            cpgs = []
        } else { cpgs = this.state.cond_pags}
        let logou = localStorage.getItem("logou");
        console.log(this.state.cond_pags)
        console.log(this.state.clientes)
        if (logou === "true") {
            return (     
                        <div className="App">
                           {bar}  
                            <div className="App__Form">
                             <div className={this.showModal()} tabindex="-1" onHide={this.closeModal}>
                                    <Modal.Dialog className="Modal">
                                        <Modal.Header className="ModalBg">
                                            <Modal.Title>Nº {parseInt(this.state.editIte.id, 10)+1}</Modal.Title>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={this.closeModal}>
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </Modal.Header>
                                        <Modal.Body className="ModalBg">
                                            <div className="FormField">
                                                <label className="FormField__Label" htmlFor="CODIGOPRO">PRODUTO</label>
                                                <input type="text" id="CODIGOPRO" className="FormField__Input" 
                                                name="CODIGOPRO" value={this.state.editIte.CODIGOPRO} onChange={event => this.handleChangeItem(event, this.state.editIte.id)}/>
                                            </div>
                                            <div className="FormField">
                                                <label className="FormField__Label" htmlFor="QUANTIDADE">QUANTIDADE</label>
                                                <input type="text" id="QUANTIDADE" className="FormField__Input" 
                                                name="QUANTIDADE" value={this.state.editIte.QUANTIDADE} onChange={event => this.handleChangeItem(event, this.state.editIte.id)}/>
                                            </div>
                                            <div className="FormField">
                                                <label className="FormField__Label" htmlFor="VALOR">VALOR UNITÁRIO</label>
                                                <input type="text" id="VALOR" className="FormField__Input" 
                                                name="VALOR" value={this.state.editIte.VALOR} onChange={event => this.handleChangeItem(event, this.state.editIte.id)}/>
                                            </div>
                                            <div className="FormField">
                                                <label className="FormField__Label" htmlFor="DESCONTO1">DESCONTO</label>
                                                <input type="text" id="DESCONTO1" className="FormField__Input" 
                                                name="DESCONTO1" value={this.state.editIte.DESCONTO1} onChange={event => this.handleChangeItem(event, this.state.editIte.id)}/>
                                            </div>
                                            <div className="FormField">
                                                <label className="FormField__Label" htmlFor="TOTAL">TOTAL</label>
                                                <input type="text" id="TOTAL" className="FormField__Input" 
                                                name="TOTAL" value={this.state.editIte.TOTAL} onChange={event => this.handleChangeItem(event, this.state.editIte.id)}/>
                                            </div>

                                        </Modal.Body>
                                        <Modal.Footer className="ModalBg">
                                            <Button className="FormField__Button mr-20" onClick={this.closeModal}>Fechar</Button>
                                            <Button className="FormField__Button mr-20" onClick={event => this.saveModal(event, this.state.editIte.id)}>Salvar</Button>
                                        </Modal.Footer>
                                    </Modal.Dialog>
                            </div>
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
                                        {this.autocomplete(clientes, this.state.cliente, 'cliente', 'FK_CLI')}
                                        <label className="FormField__Label" htmlFor="FK_CPG">Condição de Pagamento</label>
                                        {this.autocomplete(cpgs, this.state.cond_pag, 'cond_pag', 'FK_CPG')}
                                    </div>    
                                    <div>
                                        ITENS:
                                        <ListGroup>
                                            {listItens}
                                        </ListGroup>
                                    </div>
                                    
                                    {this.saveBtn(this.state.ok)}
                                    <LinkContainer to="/pedidos"><button className="FormField__Button mr-20">Voltar</button></LinkContainer>
                                    {this.hideShow()}
                                    <button className="FormField__Button__Fix" onClick={this.willShow}><SvgIcon className='FormField__Icon__Fix' size={24} icon={plus}/></button>                                    
                                </form>
                                </div>
                            </div>
                        </div>
                )
        } else { return <Redirect exact to="/"/>}
    }
}




export default Example;
