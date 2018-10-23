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
import {check} from 'react-icons-kit/metrize/check'
import { Radio } from 'semantic-ui-react'
import ReactLoading from 'react-loading';
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
        produtos : [],
        st_icms : {value: '', codigo: ''},
        cliente : {display: '', value: '', codigo: ''},
        produto : {display: '', value: '', codigo: '', IPI: 0, ST_ICMS: 0},
        cond_pag: {display: '', value: '', codigo: ''},
        cond_pags: [],
        now : {NUMPED:0, FK_CLI: 0, FK_CPG: 0, PK_PED: 0, OBSERVACAO: '', ORCAMENTO: 'N'},
        editIte: {CODIGOPRO: '', VALOR: '', TOTAL: 0, DESCONTO1: '', DESCONTO2: '', id:0, ST_ICMS: 0, IPI: 0},
        append: false,
        isLoading: true,
        id: 0,
        ok: false,
        mostraModal: false,
        mostraTotal: false,
        appendItem: false,
        itemAdded: 'ItemAdded-hide'
    };
    this.show = false
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleChangeItem = this.handleChangeItem.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)
    this.saveBtn = this.saveBtn.bind(this)
    this.showModal = this.showModal.bind(this)
    this.showTotal = this.showTotal.bind(this)
    this.saveModal = this.saveModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.mostraItem = this.mostraItem.bind(this)
    this.hideShow = this.hideShow.bind(this);
    this.handleBar = this.handleBar.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.appBar = this.appBar.bind(this);
    this.itens = this.itens.bind(this);
    this.createSons = this.createSons.bind(this)
    this.willShow = this.willShow.bind(this)
    this.loading = this.loading.bind(this)
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


    loading(ok, list) {
        if (ok === false){
            return (list)
        } else {
            return (<ReactLoading type='spokes' color='green' height={'3%'} width={'3%'} className='Loading'/>)
        }
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
                        let listProdutos = []
                        let listSt_icms = []
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


                        Data.data.st_icms.forEach((element, elementid) => {
                            listSt_icms.push({value: element.PERCENTUAL_ST, codigo : element.FK_PRO})
                        }); 

                        Data.data.produtos.forEach((element, elementid) => {
                            listProdutos.push({value: element.CODIGO_REPRESENTADA+' - '+element.NOME_REPRESENTADA, ST_ICMS: 0,IPI : element.IPI,display: element.CODIGO_REPRESENTADA, codigo : element.PK_PRO})
                        }); 

                        Data.data.cond_pag.forEach((element, elementid) => {
                            if (element.PK_CPG === Data.data.pedidos[ID].FK_CPG){
                                let cpg = {
                                    display : element.NOME,
                                    value : element.NOME,
                                    codigo : element.PK_CPG
                                }

                                this.setState({cond_pag: cpg})
                            }
                            listCondPags.push({value: element.NOME, display: element.NOME, codigo : element.PK_CPG})
                        }); 
                        this.setState({cond_pags: listCondPags, clientes: listClientes, produtos: listProdutos, st_icms: listSt_icms})
                
                    })
                } else {
                readTable(Data => { this.setState({pedidos: Data.data.pedidos, isLoading: false})
                        let listClientes = []
                        let listCondPags = []
                        let listProdutos = []
                        let listSt_icms = []
                        Data.data.clientes.forEach((element, elementid) => {
                            listClientes.push({value: element.CNPJ+' - '+element.RAZAO_SOCIAL, display: element.RAZAO_SOCIAL, codigo : element.PK_CLI})
                        }); 
                        
                        Data.data.st_icms.forEach((element, elementid) => {
                            listSt_icms.push({value: element.PERCENTUAL_ST, codigo : element.FK_PRO})
                        }); 

                        Data.data.produtos.forEach((element, elementid) => {
                            listProdutos.push({value: element.CODIGO_REPRESENTADA+' - '+element.NOME_REPRESENTADA, display: element.CODIGO_REPRESENTADA, codigo : element.PK_PRO})
                        }); 

                        Data.data.cond_pag.forEach((element, elementid) => {
                            listCondPags.push({value: '('+element.CODIGO_REPRESENTADA+') '+element.NOME, display: element.NOME, codigo : element.PK_CPG})
                        }); 
                        this.setState({cond_pags: listCondPags, clientes: listClientes, produtos: listProdutos, st_icms: listSt_icms})
                
                    })
                this.setState({append: true, isLoading: false})
                }
            }
        }
    }

  
    handleSubmit (e) {
        e.preventDefault();
        let pedido = this.state.now
        let total = 0
        console.log(pedido)
        console.log(this.state.st_icms)
        pedido.itens.forEach((element, elementid) => {
            total = total + ((element.VALOR * element.QUANTIDADE * ((100-element.DESCONTO1)/100)) * ((100-element.DESCONTO2)/100))
            let filtroipi = this.state.produtos.filter((value) => {return (value.codigo === element.FK_PRO)})
            let ipi = 0
            let st = 0
            let filtrost = this.state.st_icms.filter((value) => {return (value.codigo === element.FK_PRO)})
            if (filtrost.length > 0){
                st = filtrost[0].value
                total = total + (element.VALOR * element.QUANTIDADE * (st/100))
            }
            if (filtroipi.length > 0){
                ipi = filtroipi[0].IPI
                total = total + (element.VALOR * element.QUANTIDADE * (ipi/100))
            }
        })
        pedido.TOTAL = total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        this.setState({mostraTotal: true, now: pedido})  
    }

    handleSave (e) {
        e.preventDefault();
        // console.log('a')
        if (this.state.ok ===false){
            if (this.state.append === true) {
                appendData('pedidos', this.state.now)     
                // alert('Registro incluído com sucesso!') 
                this.setState({ok: true, mostraTotal: false})    
            } else {
                editData('pedidos', this.state.now, this.state.id)
                // alert('Registro alterado com sucesso!')  
                this.setState({ok: true, mostraTotal: false})  
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
                this.setState({now : reg})
            }

    }

    handleToggle(e){
        e.preventDefault();
        let reg = this.state.now
        reg.ORCAMENTO = reg.ORCAMENTO === 'S' ? 'N' : 'S'
        this.setState({now: reg})
    }

    handleChangeItem(e, id){
            let target = e.target
            let value = target.type === 'checkbox' ? target.checked : target.value
            let name = target.name
            let reg = this.state.editIte
            if (this.state.appendItem===true) {
                if (this.state.itemAdded === 'ItemAdded'){
                    this.setState({itemAdded: 'ItemAdded-hide'})
                }
            }
            if (name !== 'TOTAL'){
                reg[name] = value
                console.log('editou')
            }
            if ((name === 'VALOR') || (name === 'DESCONTO1') || (name === 'DESCONTO2') || (name === 'QUANTIDADE') ){
                console.log('editou total')
                let ipi = 0
                if (this.state.produto.IPI > 0){
                    ipi=this.state.produto.IPI
                }
                let st = 0
                if (this.state.produto.ST_ICMS > 0){
                    st = this.state.produto.ST_ICMS
                }
                reg['IPI'] = (ipi * ((reg['VALOR']*reg['QUANTIDADE'])/100)).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});;

                reg['ST_ICMS'] = (st * ((reg['VALOR']*reg['QUANTIDADE'])/100)).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});;
                
                reg.TOTAL = (((reg['VALOR'] * reg['QUANTIDADE'] * ((100-reg['DESCONTO1'])/100)) * ((100-reg['DESCONTO2'])/100)) + (ipi * ((reg['VALOR']*reg['QUANTIDADE'])/100)) + (st * ((reg['VALOR']*reg['QUANTIDADE'])/100)));
                reg.TOTAL = reg.TOTAL.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
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

    salvaComplete(selecionado, nomefk, tablename, idItem){
        let reg = this.state.now
        if (nomefk === 'FK_CLI'){
            reg[nomefk] = selecionado.codigo
            reg.RAZAO_SOCIAL = selecionado.display
            this.setState({now: reg, [tablename]: selecionado})
        } else if (nomefk === 'FK_CPG') {
            reg[nomefk] = selecionado.codigo
            reg.NOMECPG = selecionado.display
            this.setState({now: reg, [tablename]: selecionado})
        } else if (nomefk === 'FK_PRO') {
            reg = this.state.editIte
            reg[nomefk] = selecionado.codigo
            reg.IPI = (selecionado.IPI * ((reg.QUANTIDADE*reg.VALOR)/100)).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
            let percSt = 0 
            let procuraSt = this.state.st_icms.filter((value) => {return (value.codigo === selecionado.codigo)})
            if (procuraSt.length > 0) {
                percSt = procuraSt[0].value
            }
            selecionado.ST_ICMS = percSt
            reg.ST_ICMS = (percSt * ((reg.QUANTIDADE*reg.VALOR)/100)).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
            reg.TOTAL = (((reg['VALOR'] * reg['QUANTIDADE'] * ((100-reg['DESCONTO1'])/100)) * ((100-reg['DESCONTO2'])/100)) + reg.IPI + reg.ST_ICMS).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
            this.setState({editIte: reg, [tablename]: selecionado})
        }
        

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
                                                    .map((item, index) => {if (index<10) { return(
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
                                                    )}})
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

    showTotal(){
        // alert(this.state.mostraModal)
        if (this.state.mostraTotal === true) {
            return 'ModalShow_Total'
        } else {
            return 'ModalHide'
        }
    }


    closeModal(e){
        e.preventDefault();
        this.setState({mostraModal: false, mostraTotal: false, itemAdded: 'ItemAdded-hide', editIte: {CODIGOPRO: '', QUANTIDADE: '',VALOR: '', TOTAL: '', IPI:'', ST_ICMS: '', DESCONTO1: '', DESCONTO2: '', id:0}, produto: {display: '',codigo:'', value: '', ST_ICMS: 0, IPI: 0}})
    }

    saveModal(e, id){
        e.preventDefault();
        if (this.state.appendItem === false) {
            let item = Object.assign({},this.state.now)
            item.itens[id] = this.state.editIte;
            this.setState({mostraModal: false, now: item, editIte: {CODIGOPRO: '', QUANTIDADE: '',VALOR: '', TOTAL: '', DESCONTO1: '', DESCONTO2: '', IPI: '', ST_ICMS: '',id:0}, produto: {display: '',codigo:'', value: '', ST_ICMS: 0, IPI: 0}})
        } else {
            let item = Object.assign({},this.state.now)
            if (typeof item.itens === 'undefined') {
                item.itens = []
                item.itens.push(this.state.editIte);
            } else {
                item.itens.push(this.state.editIte);
            }         
            this.setState({itemAdded: 'ItemAdded', mostraModal: true, now: item, editIte: {CODIGOPRO: '', VALOR: '', QUANTIDADE: '', TOTAL: '', DESCONTO1: '', IPI: '', ST_ICMS: '', DESCONTO2: '', id:0}, produto: {display: '',codigo:'', value: '', ST_ICMS: 0, IPI: 0}})
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
                let produtos = this.state.produtos
                let prod = produtos.filter((value)=>{return value.codigo === item.FK_PRO})
                let st = this.state.st_icms.filter((value) => {return value.codigo === item.FK_PRO})
                if (st.length > 0) {
                    prod[0].ST_ICMS = st[0].value
                } else {
                    prod[0].ST_ICMS = 0
                }
                
                item.IPI =  (((item.QUANTIDADE * item.VALOR)/100) * (prod[0].IPI)).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});    
                item.ST_ICMS = (((item.QUANTIDADE * item.VALOR)/100) * (prod[0].ST_ICMS)).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
                item.TOTAL = (((item.QUANTIDADE * item.VALOR * ((100-item.DESCONTO1)/100)) * ((100-item.DESCONTO2)/100)) +  (((item.QUANTIDADE * item.VALOR)/100) * (prod[0].IPI)) + (((item.QUANTIDADE * item.VALOR)/100) * (prod[0].ST_ICMS))).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
                this.setState({mostraModal: true, editIte: item, appendItem: false, produto: prod[0]})
            } else {
                this.setState({mostraModal: true, appendItem: true, itemAdded: 'ItemAdded-hide'})
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
        let produtos = []
        
        let mapItens = this.state.now.itens;
        let listItens = []
        if (typeof mapItens !== 'undefined'){
            listItens = mapItens.map(this.createSons)}
        else listItens = (<ListGroupItem className="FormField__Grid">Nenhum item.</ListGroupItem>)
        let cpgs = []
        if (typeof this.state.clientes === 'undefined'){
            clientes = []
        } else { clientes = this.state.clientes}
        if (typeof this.state.produtos === 'undefined'){
            produtos = []
        } else { produtos = this.state.produtos}
        if (typeof this.state.cond_pags === 'undefined'){
            cpgs = []
        } else { cpgs = this.state.cond_pags}
        let logou = localStorage.getItem("logou");
        if (logou === "true") {
            return (     
                        <div className="App">
                           {bar}  
                            <div className="App__Form">
                                <div className={this.showTotal()} tabindex="-1" onHide={this.closeModal}>
                                    <Modal.Dialog className="Modal">
                                        <Modal.Body className="ModalBg">    
                                            Total do Pedido: R$ {this.state.now.TOTAL}
                                        </Modal.Body>
                                        <Modal.Footer className="ModalBg">
                                            <Button className="FormField__Button mr-20" onClick={this.closeModal}>Cancelar</Button>
                                            <Button className="FormField__Button mr-20" onClick={this.handleSave}>Salvar</Button>
                                        </Modal.Footer>
                                    </Modal.Dialog>
                                </div>
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
                                                <label className="FormField__Label" htmlFor="PRODUTO">PRODUTO</label>
                                                {this.autocomplete(produtos, this.state.produto, 'produto', 'FK_PRO')}
                                            </div>

                                            <div className="FormField">
                                                    <div style={{display:'flex'}}>
                                                        <div style={{width: '45%', display:'inline'}}>
                                                            <label className="FormField__Label" htmlFor="QUANTIDADE">QUANTIDADE</label>
                                                        </div>
                                                        <div style={{width: '45%', display:'inline'}}>
                                                            <label className="FormField__Label" htmlFor="VALOR">VALOR UNITÁRIO</label>
                                                        </div>
                                                    </div>
                                                    <div style={{display:'flex'}}>
                                                        <div style={{width: '45%', display:'inline'}}>
                                                        
                                                           <input type="number" min="1" step="1" id="QUANTIDADE" className="FormField__Input" 
                                                            name="QUANTIDADE" value={this.state.editIte.QUANTIDADE} onChange={event => this.handleChangeItem(event, this.state.editIte.id)}/>
                                                        </div>
                                                        <div style={{width: '45%', display:'inline'}}>
                                                            <input type="number" min="0.00" step="0.01" id="VALOR" className="FormField__Input"
                                                            name="VALOR" value={this.state.editIte.VALOR} onChange={event => this.handleChangeItem(event, this.state.editIte.id)}/>
                                                        </div>
                                                    </div>
                                            </div>



                                            <div className="FormField">
                                                    <div style={{display:'flex'}}>
                                                        <div style={{width: '45%', display:'inline'}}>
                                                            <label className="FormField__Label" htmlFor="DESCONTO1">DESCONTO 1</label>
                                                        </div>
                                                        <div style={{width: '45%', display:'inline'}}>
                                                            <label className="FormField__Label" htmlFor="DESCONTO2">DESCONTO 2</label>
                                                        </div>
                                                    </div>
                                                    <div style={{display:'flex'}}>
                                                        <div style={{width: '45%', display:'inline'}}>
                                                            <input type="number" min="0.00" step="0.01" id="DESCONTO1" className="FormField__Input"  style={{margin: '0px 5px 0px 0px', display:'inline-block'}} 
                                                            name="DESCONTO1" value={this.state.editIte.DESCONTO1} onChange={event => this.handleChangeItem(event, this.state.editIte.id)}/>
                                                        </div>
                                                        <div style={{width: '45%', display:'inline'}}>
                                                            <input type="number" min="0.00" step="0.01" id="DESCONTO2" className="FormField__Input"  style={{margin: '0px 5px 0px 0px'}}
                                                            name="DESCONTO2" value={this.state.editIte.DESCONTO2} onChange={event => this.handleChangeItem(event, this.state.editIte.id)}/>
                                                        </div>
                                                    </div>
                                            </div>
                                            <div className="FormField">
                                                    <div style={{display:'flex'}}>
                                                        <div style={{width: '30%', display:'inline'}}>
                                                            <label className="FormField__Label" htmlFor="PROIPI">ALIQ. IPI</label>
                                                        </div>
                                                        <div style={{width: '65%', display:'inline'}}>
                                                            <label className="FormField__Label" htmlFor="IPI">VALOR IPI</label>
                                                        </div>
                                                    </div>
                                                    <div style={{display:'flex'}}>
                                                        <div style={{width: '30%', display:'inline'}}>
                                                            <input type="text" id="PROIPI" className="FormField__Input" 
                                                            name="PROIPI" value={this.state.produto.IPI}/>
                                                        </div>
                                                        <div style={{width: '65%', display:'inline'}}>
                                                            <input type="text" id="IPI" className="FormField__Input"
                                                            name="IPI" value={this.state.editIte.IPI}/>
                                                        </div>
                                                    </div>
                                            </div>
                                            <div className="FormField">
                                                    <div style={{display:'flex'}}>
                                                        <div style={{width: '30%', display:'inline'}}>
                                                            <label className="FormField__Label" htmlFor="PROST_ICMS">ALIQ. ST ICMS</label>
                                                        </div>
                                                        <div style={{width: '65%', display:'inline'}}>
                                                            <label className="FormField__Label" htmlFor="ST_ICMS">VALOR ST ICMS</label>
                                                        </div>
                                                    </div>
                                                    <div style={{display:'flex'}}>
                                                        <div style={{width: '30%', display:'inline'}}>
                                                            <input type="text" id="PROIPI" className="FormField__Input" 
                                                            name="PROST_ICMS" value={this.state.produto.ST_ICMS}/>
                                                        </div>
                                                        <div style={{width: '65%', display:'inline'}}>
                                                            <input type="text" id="ST_ICMS" className="FormField__Input"
                                                            name="ST_ICMS" value={this.state.editIte.ST_ICMS}/>
                                                        </div>
                                                    </div>
                                            </div>
                                            <div className="FormField">
                                                <label className="FormField__Label" htmlFor="TOTAL">VALOR TOTAL</label>
                                                <input type="text" id="TOTAL" className="FormField__Input" 
                                                name="TOTAL" value={this.state.editIte.TOTAL}/>
                                            </div>

                                        </Modal.Body>
                                        <Modal.Footer className="ModalBg">
                                            <div className={this.state.itemAdded}><SvgIcon size={80} icon={check} style={{ color: '#649764', margin: '15px 15px 15px 15px' }}/><p className='ItemMsg'>Item adicionado com sucesso!</p></div>
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
                                        <Radio label='ORÇAMENTO' name='ORCAMENTO' style={{color: 'white'}} checked={this.state.now.ORCAMENTO === "S"} onChange={this.handleToggle} toggle/>
                                    </div>                                   
                                    <div className="FormField">
                                        <label className="FormField__Label" htmlFor="FK_CLI">Cliente</label>
                                        {this.autocomplete(clientes, this.state.cliente, 'cliente', 'FK_CLI')}
                                        <label className="FormField__Label" htmlFor="FK_CPG">Condição de Pagamento</label>
                                        {this.autocomplete(cpgs, this.state.cond_pag, 'cond_pag', 'FK_CPG')}
                                    </div>    
                                    <div className="FormField">
                                        <label className="FormField__Label" htmlFor="OBSERVACAO">OBSERVAÇÃO</label>
                                        <textarea id="OBSERVACAO" className="FormField__Input__OBS" 
                                        name="OBSERVACAO" value={this.state.now.OBSERVACAO} onChange={this.handleChange}/>
                                    </div>
                                    <div>
                                        ITENS:
                                        <ListGroup>
                                            {/* {listItens} */}
                                            {this.loading(this.state.isLoading, listItens)}
                                        </ListGroup>
                                    </div>
                                    <LinkContainer to="/pedidos"><button className="FormField__Button mr-20">Voltar</button></LinkContainer>
                                    {this.saveBtn(this.state.ok)}
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
