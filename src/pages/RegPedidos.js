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
import {ListGroup, ListGroupItem, Modal, Button} from 'react-bootstrap'
import {check} from 'react-icons-kit/metrize/check'
import { Radio } from 'semantic-ui-react'
import ReactLoading from 'react-loading';
// import PouchDB from "pouchdb"
import {plus} from 'react-icons-kit/fa/plus'
import { readTable, editData, appendData, savingItem } from "./Utils";
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
        produto : {display: '', value: '', codigo: '', OBS_PROMOCIONAL:'', IPI: 0, ST_ICMS: 0, PRECO_PROM_REGIAO_1:0, PRECO_PROM_REGIAO_2:0, PRECO_PROM_REGIAO_3:0, PRECO_PROM_REGIAO_4:0,  PRECO_VENDA_PROMO:0, PRECO_VENDA_LISTA:0, PRECO_REGIAO_1:0, PRECO_REGIAO_2:0, PRECO_REGIAO_3:0, PRECO_REGIAO_4:0 },
        cond_pag: {display: '', value: '', codigo: ''},
        cidades: {},
        cond_pags: [],
        now : {NUMPED:0, FK_CLI: 0, FK_CPG: 0, PK_PED: 0, OBSERVACAO: '', ORCAMENTO: '', DATA: new Date()},
        editIte: {CODIGOPRO: '', QUANTIDADE: 0, VALOR: '', PERCIPI: 0, PERCST_ICMS: 0, TOTAL: 0, DESCONTO1: '', DESCONTO2: '', id:0, ST_ICMS: 0, IPI: 0},
        append: false,
        isLoading: true,
        id: 0,
        ok: false,
        mostraModal: false,
        mostraTotal: false,
        appendItem: false,
        savingShow: {display: 'none'},
        savingPhase: 1,
        buttons: 'Buttons',
        itemAdded: 'ItemAdded-hide'
    };
    this.show = false
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleToggleOrc = this.handleToggleOrc.bind(this);
    this.handleTogglePed = this.handleTogglePed.bind(this);
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
    this.saving = this.saving.bind(this);
    this.itens = this.itens.bind(this);
    this.createSons = this.createSons.bind(this)
    this.willShow = this.willShow.bind(this)
    this.loading = this.loading.bind(this)
    this.precoUnit = this.precoUnit.bind(this)
    this.pegaRegiao = this.pegaRegiao.bind(this)
    this.pegaStIcms = this.pegaStIcms.bind(this)
    this.aplicaDescontos = this.aplicaDescontos.bind(this)
    this.descontosDigitados = this.descontosDigitados.bind(this)
  }
  
    saveBtn(ok) {
        if (ok === false){
            return (<input type="submit" className="FormField__Button mr-20" value="Salvar" onSubmit={this.handleSubmit}/>)
        } else {
            return (<input type="submit" className="FormField__ButtonDisabled mr-20" value="Salvar"/>)
        }
    }

    saving(){
        this.setState({savingShow: {display: 'none'}})
    }

    createSons(item, id){
        return(
            <ListGroupItem href="#" id={id} key={id} className="FormField__Grid" onClick={this.willShow}>
            <div id={id} className="row">
                <div id={id} className="column_left">
                    Nº {id+1}
                </div>
                <div id={id} className="column">
                    Código: {item.CODIGOPRO}<br/>
                    Descrição: {item.DESCRICAOPRO}<br/>
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
                                                this.props.history.push('/macropecas/')
                                            } else {this.props.history.push('/macropecas/'+id)
                            }}}>                      
                                <Nav id='home'>
                                    <NavIcon><SvgIcon size={30} icon={ic_home}/></NavIcon>    
                                    <NavText> Página Inicial </NavText>
                                </Nav>
                                <Nav id='clientes'>
                                    <NavIcon><SvgIcon size={30} icon={ic_account_box}/></NavIcon>    
                                    <NavText> Clientes </NavText>
                                </Nav>
                                <Nav id='produtos'>
                                    <NavIcon><SvgIcon size={30} icon={ic_build}/></NavIcon>
                                    <NavText> Produtos </NavText>
                                </Nav>
                                <Nav id='pedidos'>
                                    <NavIcon><SvgIcon size={30} icon={ic_add_shopping_cart}/></NavIcon>
                                    <NavText> Pedidos </NavText>
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
                if (this.props.location.pathname !== '/macropecas/pedidos/registro') {
                    let ID = this.props.location.pathname.replace('/macropecas/pedidos/registro/','');
                    readTable(Data => { this.setState({pedidos: Data.data.pedidos, isLoading: true})
                        this.setState({now: Data.data.pedidos[ID], id: ID, isLoading: false}) 
                        let listClientes = []
                        let listCondPags = []
                        let listProdutos = []
                        let listSt_icms = []
                        let listCidades = Data.data.cidades;
                        let listDescontoLog = Data.data.descontolog
                        Data.data.clientes.forEach((element, elementid) => {
                            if (element.PK_CLI === Data.data.pedidos[ID].FK_CLI){
                                let cli = {
                                    display : element.RAZAO_SOCIAL,
                                    value : element.CNPJ+' - '+element.RAZAO_SOCIAL,
                                    codigo : element.PK_CLI,
                                    cidade : element.FK_CID,
                                    simples_nacional: element.SIMPLESNACIONAL
                                }

                                this.setState({cliente: cli})
                            }
                            listClientes.push({value: element.CNPJ+' - '+element.RAZAO_SOCIAL, simples_nacional: element.SIMPLESNACIONAL, cidade : element.FK_CID, display: element.RAZAO_SOCIAL, codigo : element.PK_CLI})
                        }); 
                        
                        


                        Data.data.st_icms.forEach((element, elementid) => {
                            listSt_icms.push({value: element.PERCENTUAL_ST, codigo : element.FK_PRO, destino: element.FK_ESTDESTINO, origem: element.ORIGEM, simples_nacional: element.SIMPLES_NACIONAL})
                        }); 

                        Data.data.produtos.forEach((element, elementid) => {
                            listProdutos.push({value: element.CODIGO_REPRESENTADA+' - '+element.NOME_REPRESENTADA, 
                                DATA_VALID_PROMO: element.DATA_VALID_PROMO,
                                PRECO_VENDA_LISTA: element.PRECO_VENDA_LISTA,
                                PRECO_VENDA_PROMO: element.PRECO_VENDA_PROMO,
                                PRECO_REGIAO_1: element.PRECO_REGIAO_1,
                                PRECO_REGIAO_2: element.PRECO_REGIAO_2,
                                PRECO_REGIAO_3: element.PRECO_REGIAO_3,
                                PRECO_REGIAO_4: element.PRECO_REGIAO_4, 
                                PRECO_PROM_REGIAO_1: element.PRECO_PROM_REGIAO_1, 
                                PRECO_PROM_REGIAO_2: element.PRECO_PROM_REGIAO_2, 
                                PRECO_PROM_REGIAO_3: element.PRECO_PROM_REGIAO_3,
                                PRECO_PROM_REGIAO_4: element.PRECO_PROM_REGIAO_4, 
                                OBS_PROMOCIONAL: element.OBS_PROMOCIONAL,
                                DESCRICAOPRO: element.NOME_REPRESENTADA,
                                CODIGOPRO: element.CODIGO_REPRESENTADA,
                                ST_ICMS: 0,
                                IPI : element.IPI,
                                display: element.CODIGO_REPRESENTADA+' - '+element.NOME_REPRESENTADA, 
                                codigo : element.PK_PRO})
                        }); 

                        Data.data.cond_pag.forEach((element, elementid) => {
                            if (element.PK_CPG === Data.data.pedidos[ID].FK_CPG){
                                let cpg = {
                                    display : element.NOME,
                                    value : element.NOME,
                                    codigo : element.PK_CPG,
                                    desconto : element.DESCONTO
                                }

                                this.setState({cond_pag: cpg})
                            }
                            listCondPags.push({value: element.NOME, display: element.NOME, codigo : element.PK_CPG, desconto: element.DESCONTO})
                        }); 
                        this.setState({cond_pags: listCondPags, descontoLog: listDescontoLog, cidades:listCidades, clientes: listClientes, produtos: listProdutos, st_icms: listSt_icms})
                
                    })
                } else {
                readTable(Data => { this.setState({pedidos: Data.data.pedidos, isLoading: false})
                        let listClientes = []
                        let listCondPags = []
                        let listProdutos = []
                        let listSt_icms = []
                        let listCidades = Data.data.cidades;
                        let listDescontoLog = Data.data.descontolog
                        Data.data.clientes.forEach((element, elementid) => {
                            listClientes.push({value: element.CNPJ+' - '+element.RAZAO_SOCIAL, simples_nacional: element.SIMPLESNACIONAL, cidade : element.FK_CID, display: element.RAZAO_SOCIAL, codigo : element.PK_CLI})
                        }); 
                        
                        Data.data.st_icms.forEach((element, elementid) => {
                            listSt_icms.push({value: element.PERCENTUAL_ST, codigo : element.FK_PRO, destino: element.FK_ESTDESTINO, origem: element.ORIGEM, simples_nacional: element.SIMPLES_NACIONAL})
                        }); 

                        Data.data.produtos.forEach((element, elementid) => {
                            listProdutos.push({value: element.CODIGO_REPRESENTADA+' - '+element.NOME_REPRESENTADA, 
                                DATA_VALID_PROMO: element.DATA_VALID_PROMO,
                                PRECO_VENDA_LISTA: element.PRECO_VENDA_LISTA,
                                PRECO_VENDA_PROMO: element.PRECO_VENDA_PROMO,
                                PRECO_REGIAO_1: element.PRECO_REGIAO_1,
                                PRECO_REGIAO_2: element.PRECO_REGIAO_2,
                                PRECO_REGIAO_3: element.PRECO_REGIAO_3,
                                PRECO_REGIAO_4: element.PRECO_REGIAO_4, 
                                PRECO_PROM_REGIAO_1: element.PRECO_PROM_REGIAO_1, 
                                PRECO_PROM_REGIAO_2: element.PRECO_PROM_REGIAO_2, 
                                PRECO_PROM_REGIAO_3: element.PRECO_PROM_REGIAO_3,
                                PRECO_PROM_REGIAO_4: element.PRECO_PROM_REGIAO_4, 
                                OBS_PROMOCIONAL: element.OBS_PROMOCIONAL,
                                DESCRICAOPRO: element.NOME_REPRESENTADA,
                                CODIGOPRO: element.CODIGO_REPRESENTADA,
                                ST_ICMS: 0,
                                IPI : element.IPI,
                                display: element.CODIGO_REPRESENTADA+' - '+element.NOME_REPRESENTADA, 
                                codigo : element.PK_PRO})
                        }); 

                        Data.data.cond_pag.forEach((element, elementid) => {
                            listCondPags.push({value: element.NOME, display: element.NOME, codigo : element.PK_CPG, desconto: element.DESCONTO})
                        }); 
                        this.setState({cond_pags: listCondPags, descontoLog: listDescontoLog, cidades: listCidades, clientes: listClientes, produtos: listProdutos, st_icms: listSt_icms})
                
                    })
                this.setState({append: true, isLoading: false})
                }
            }
        }
    }

  
    handleSubmit (e) {
        e.preventDefault();
        let cliente = this.state.now.FK_CLI || 0
        let cpg = this.state.now.FK_CPG || 0
        let itens = this.state.now.itens || []
        let tipo = this.state.now.ORCAMENTO || 'A'
        if ( tipo==='A' ){
            alert('Informe se é Pedido ou Orçamento!!')
        } else
        if ( cliente===0 ){
            alert('Informe o Cliente!!')
        } else
        if ( cpg===0 ){
            alert('Informe a Condição de Pagamento!!')
        } else
        if ( itens.length===0 ){
            alert('Informe pelo menos um Item para o pedido/orçamento!!')
        } else {
            let pedido = this.state.now
            let total = 0
            let ipi = 0
            let sticms = 0
            pedido.itens.forEach((element, elementid) => {
                let desconto = (1-(Number(element.DESCONTO1)/100))*(1-(Number(element.DESCONTO2)/100))
                total = (element.VALOR*Number(element.QUANTIDADE))*desconto + total
                ipi = (element.IPI*Number(element.QUANTIDADE))*desconto + ipi
                sticms = (element.ST_ICMS*Number(element.QUANTIDADE))*desconto + sticms
            })
            pedido.TOTALPRO = total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            pedido.TOTALIPI = ipi.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            pedido.TOTALSTI = sticms.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            pedido.TOTAL = (total+ipi+sticms).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            this.setState({mostraTotal: true, now: pedido})
        } 
    }

    handleSave (e) {
        e.preventDefault();
        // console.log('a')
        this.setState({savingPhase: 1, savingShow:{}})
        if (this.state.ok ===false){
            if (this.state.append === true) {
                appendData('pedidos', this.state.now, res => {this.setState({savingPhase: 2, savingShow:{}})})
                // alert('Registro incluído com sucesso!') 
                this.setState({ok: true, mostraTotal: false})    
            } else {
                editData('pedidos', this.state.now, this.state.id, res => {this.setState({savingPhase: 2, savingShow:{}})})
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
                if (this.state.append === true) {
                    reg.DATA = new Date()
                }
                reg[name] = value
                this.setState({now : reg})
            }

    }


    pegaStIcms(cliente, produto){
        let cidade = this.state.cidades.filter((value) => {return (value.PK_CID === cliente.cidade)})
        let percSt = 0
        if (cidade.length > 0){
            let destino = cidade[0].FK_EST
            let regiao = this.pegaRegiao(cliente)
            if ((regiao === 3) || (regiao === 4)) {
                let st = this.state.st_icms.filter((value) => {
                    return ((value.codigo === produto.codigo) && (value.destino === destino) && (value.origem === 'PE') && (value.simples_nacional === cliente.simples_nacional))
                })
                if (st.length > 0) {
                    percSt = st[0].value
                }
            } else {
                let st = this.state.st_icms.filter((value) => {
                    return ((value.codigo === produto.codigo) && (value.destino === destino) && (value.origem === 'PR') && (value.simples_nacional === cliente.simples_nacional))
                })
                if (st.length > 0) {
                    percSt = st[0].value
                }                
            }
        }
        return percSt
    }


    handleToggleOrc(e){
        e.preventDefault();
        let reg = this.state.now
        reg.ORCAMENTO = 'S'
        this.setState({now: reg})
    }

    handleTogglePed(e){
        e.preventDefault();
        let reg = this.state.now
        reg.ORCAMENTO = 'N'
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
                if ((name === 'DESCONTO1') || (name === 'DESCONTO2')) {
                    reg[name] = value
                } else {
                    reg[name] = value
                }
            }
            if ((name === 'VALOR') || (name === 'DESCONTO1') || (name === 'DESCONTO2') || (name === 'QUANTIDADE') ){
                let ipi = 0
                if (this.state.produto.IPI > 0){
                    ipi=this.state.produto.IPI
                }
                let st = this.pegaStIcms(this.state.cliente, this.state.produto)
                let preco = this.precoUnit(this.state.cliente, this.state.produto)
                preco = this.aplicaDescontos(preco)
                reg.VALOR = preco
                let precodscto = this.descontosDigitados(preco)
                reg.ST_ICMS = (st * (precodscto/100)).toFixed(2)
                reg.ST_ICMS = Number(reg.ST_ICMS)
                reg.IPI = (ipi * (precodscto/100)).toFixed(2)
                reg.IPI = Number(reg.IPI)
                reg.TOTAL = ((precodscto + reg.IPI + reg.ST_ICMS)*reg.QUANTIDADE).toFixed(2)
                reg.TOTAL = Number(reg.TOTAL)
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

    pegaRegiao(cliente){
        let cidade = this.state.cidades.filter((value) => {return (value.PK_CID === cliente.cidade)})
        if (cidade.length > 0){
            let uf = cidade[0].UF
            let r1 = [ 'RS', 'SP', 'SC', 'MG', 'RJ' ]
            let r3 = [ 'PE' ]
            let r4 = [ 'AL', 'BA', 'CE', 'MA', 'PI', 'PB', 'RN', 'SE' ]
            if ( uf === 'PR') {
                return 0
            } else if ( r1.indexOf(uf) !== -1) {
                return 1
            } else if ( r3.indexOf(uf) !== -1) {
                return 3
            } else if ( r4.indexOf(uf) !== -1) {
                return 4
            } else {
                return 2
            }
        } else {
            alert('Cliente sem cidade cadastrada!! Preço baseado no estado do Paraná!')
            return 0
        }
    }

    pegaPreco(tipo, regiao, produto){
        let preco = 0
        if ( tipo === 'PROMO' ){
            if (regiao === 0) {
                preco = produto.PRECO_VENDA_PROMO
            } else {
                preco = produto['PRECO_PROM_REGIAO_'+regiao]
            }
        } else {
            if (regiao === 0) {
                preco = produto.PRECO_VENDA_LISTA
            } else {
                preco = produto['PRECO_REGIAO_'+regiao]
            }
        }
        return preco
    }

    precoUnit(cliente, produto){
        let preco = 0
        let regiao = this.pegaRegiao(cliente)
        if (new Date(this.state.now.DATA) > new Date(produto.DATA_VALID_PROMO)) {
            preco = this.pegaPreco('LISTA', regiao, produto)
            console.log('lista '+regiao+' - '+preco)
        } else {
            preco = this.pegaPreco('PROMO', regiao, produto)
            console.log('promo '+regiao+' - '+preco)
        }
        if ( preco > 0 ) {
            return preco
        } else {
            alert('Preço Unitário não foi encontrado! Verifique no menu "Produtos"')
            return 0.00
        }
    }

    aplicaDescontos(preco){
        let dataPedido = new Date(this.state.now.DATA)
        let logistica = this.state.descontoLog.filter((value) => { return ((value.MES === (dataPedido.getMonth()+1)) && (value.ANO === dataPedido.getFullYear()) && (dataPedido <= (new Date(value.DATA_LIMITE))))})

        let descontoLog = 0
        if (logistica.length>0){
            descontoLog = logistica[0].DESCONTO
        }
        let calc = (preco - (preco*(descontoLog/100))).toFixed(2)
        preco = Number(calc)
        console.log('desconto log '+descontoLog+' : '+preco)
        let descontoCpg = this.state.cond_pag.desconto || 0
        calc = (preco - (preco*(descontoCpg/100))).toFixed(2)
        preco = Number(calc)
        console.log('desconto cpg '+descontoCpg+' : '+preco)
        console.log('--------------------------------------------------')
        return Number(preco)       

    }

    descontosDigitados(preco){
        preco = (preco * (1-(this.state.editIte.DESCONTO1/100)) * (1-(this.state.editIte.DESCONTO2/100))).toFixed(2)
        return Number(preco)
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
            reg.CODIGOPRO = selecionado.CODIGOPRO
            reg.DESCRICAOPRO = selecionado.DESCRICAOPRO
            reg[nomefk] = selecionado.codigo
            let preco = this.precoUnit(this.state.cliente, selecionado)
            preco = this.aplicaDescontos(preco)
            reg.VALOR = preco
            let precodscto = this.descontosDigitados(preco)
            reg.IPI = (selecionado.IPI * ((reg.VALOR)/100));
            let percSt = this.pegaStIcms(this.state.cliente, selecionado)
            selecionado.ST_ICMS = percSt
            reg.ST_ICMS = (percSt * (precodscto/100)).toFixed(2)
            reg.ST_ICMS = Number(reg.ST_ICMS)
            reg.IPI = (selecionado.IPI * (precodscto/100)).toFixed(2)
            reg.IPI = Number(reg.IPI)
            reg.TOTAL = ((precodscto + reg.IPI + reg.ST_ICMS)*reg.QUANTIDADE).toFixed(2)
            console.log(reg.Total)
            reg.TOTAL = Number(reg.TOTAL)
            
            this.setState({editIte: reg, [tablename]: selecionado})
        }
        

    }

    totalizaPedido(){

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
                                                    .slice(0,10)
                                                    .map((item, index) => {return(
                                                    <li className="FormField__List"
                                                        {...getItemProps({
                                                        key: index,
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
                                                    )})
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
        this.setState({mostraModal: false, mostraTotal: false, itemAdded: 'ItemAdded-hide', editIte: {CODIGOPRO: '', QUANTIDADE: 0,VALOR: '', TOTAL: '', IPI:'', ST_ICMS: '', DESCONTO1: '', DESCONTO2: '', id:0}, produto: {display: '',codigo:'', value: '', ST_ICMS: 0, IPI: 0}})
    }

    saveModal(e, id){
        e.preventDefault();
        let produto = this.state.editIte.FK_PRO || 0
        let desconto1 = this.state.editIte.DESCONTO1 || 0
        let desconto2 = this.state.editIte.DESCONTO2 || 0
        let quantidade = this.state.editIte.QUANTIDADE || 0
        if ( produto === 0 ){
            alert('Informe um produto!')
        } else
        if ( quantidade === 0 ){
            alert('Informe a quantidade!')
        } else
        if ( desconto1 > 100 || desconto2 > 100 || desconto1 < 0 || desconto2 < 0 ) {
            alert('Desconto deve ser entre 0 e 100%!')
        } else
        if (this.state.appendItem === false) {
            let item = Object.assign({},this.state.now)
            item.itens[id] = this.state.editIte;
            this.setState({mostraModal: false, now: item, editIte: {CODIGOPRO: '', QUANTIDADE: 0,VALOR: '', TOTAL: '', DESCONTO1: '', DESCONTO2: '', IPI: '', ST_ICMS: '',id:0}, produto: {display: '',codigo:'', value: '', ST_ICMS: 0, IPI: 0}})
        } else {
            // let nextId = 0
            let item = Object.assign({},this.state.now)
            if (typeof item.itens === 'undefined') {
                item.itens = []
                item.itens.push(this.state.editIte);
            } else {
                item.itens.push(this.state.editIte);
            }
            let nextId = item.itens.length
            this.setState({itemAdded: 'ItemAdded', mostraModal: true, now: item, editIte: {CODIGOPRO: '', VALOR: '', QUANTIDADE: 0, TOTAL: '', DESCONTO1: '', IPI: '', ST_ICMS: '', DESCONTO2: '', id: nextId}, produto: {display: '',codigo:'', value: '', ST_ICMS: 0, IPI: 0}})
        }
    }

    willShow(e){
        e.preventDefault(); 
        let cliente = this.state.now.FK_CLI || 0
        let cpg = this.state.now.FK_CPG || 0
        
        if ( cliente===0 || cpg===0 ) {
            alert('Informe o Cliente e a Condição de Pagamento para incluir um item.')
        } else
        if (this.state.ok) {
            alert('Edição bloqueada: Pedido já foi salvo. Aperte em "Voltar" e, após, "Editar" novamente.')
        } else { 
            if (e.target.id !== '') {
                let item = Object.assign({},this.state.now.itens[e.target.id])
                item.id = e.target.id
                let produtos = this.state.produtos
                let prod = produtos.filter((value)=>{return value.codigo === item.FK_PRO})
                this.setState({mostraModal: true, editIte: item, appendItem: false, produto: prod[0]})
            } else {
                let itens = this.state.now.itens || []
                let item = this.state.editIte
                item.id = itens.length
                this.setState({mostraModal: true, appendItem: true, editIte: item, itemAdded: 'ItemAdded-hide'})
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
                                <div className={this.showTotal()} tabIndex="-1">
                                    <Modal.Dialog className="Modal" >
                                        <Modal.Body className="ModalBg">    
                                            <div className="FormField">
                                                <Radio label='PEDIDO' name='ORCAMENTO' style={{color: 'white'}} checked={this.state.now.ORCAMENTO === "N"} onChange={this.handleTogglePed} toggle/>
                                                <Radio label='ORÇAMENTO' name='ORCAMENTO' style={{color: 'white'}} checked={this.state.now.ORCAMENTO === "S"} onChange={this.handleToggleOrc} toggle/>
                                            </div> 
                                            Total Produtos: R$ {this.state.now.TOTALPRO}<br/>
                                            Total IPI: R$ {this.state.now.TOTALIPI}<br/>
                                            Total ST Icms: R$ {this.state.now.TOTALSTI}<br/>
                                            Total do Pedido: R$ {this.state.now.TOTAL}
                                        </Modal.Body>
                                        <Modal.Footer className="ModalBg">
                                            <Button className="FormField__Button mr-20" onClick={this.closeModal}>Cancelar</Button>
                                            <Button className="FormField__Button mr-20" onClick={this.handleSave}>Salvar</Button>
                                        </Modal.Footer>
                                    </Modal.Dialog>
                                </div>
                                <div className={this.showModal()} tabIndex="-1" >
                                    <Modal.Dialog className="Modal">
                                        <Modal.Header className="ModalBg">
                                            <Modal.Title>Nº {(parseInt(this.state.editIte.id, 10)+1)}</Modal.Title>
                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.closeModal}>
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
                                                           <input type="text" id="QUANTIDADE" className="FormField__Input" 
                                                            name="QUANTIDADE" value={(this.state.editIte.QUANTIDADE || '0')} onChange={event => this.handleChangeItem(event, this.state.editIte.id)}/>
                                                        </div>
                                                        <div style={{width: '45%', display:'inline'}}>
                                                            <input type="text" id="VALOR" className="FormField__Input"
                                                            name="VALOR" readOnly tabIndex="-1" value={(this.state.editIte.VALOR||0).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})} onChange={event => this.handleChangeItem(event, this.state.editIte.id)}/>
                                                        </div>
                                                    </div>
                                            </div>
                                            <div className="FormField">
                                                <label className="FormField__Label" htmlFor="OBS_PROMOCIONAL">OBSERVAÇÃO PROMOCIONAL</label>
                                                <textarea id="OBS_PROMOCIONAL" className="FormField__Input__OBS" 
                                                name="OBS_PROMOCIONAL" value={this.state.produto.OBS_PROMOCIONAL || ''} tabIndex="-1" readOnly/>
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
                                                            <input type="number" data-number-to-fixed="2" id="DESCONTO1" className="FormField__InputUn"  style={{margin: '0px 5px 0px 0px', display:'inline-block' }} 
                                                            name="DESCONTO1" value={(this.state.editIte.DESCONTO1) || 0.00} onChange={event => this.handleChangeItem(event, this.state.editIte.id)}/>
                                                            <input type="text" value="%" readOnly tabIndex='-1' className="FormField__Un" style={{margin: '0px 5px 0px 0px', display:'inline-block' }}></input>
                                                        </div>
                                                        <div style={{width: '45%', display:'inline'}}>
                                                            <input type="number" id="DESCONTO2" className="FormField__InputUn"  style={{margin: '0px 5px 0px 0px'}}
                                                            name="DESCONTO2" value={(this.state.editIte.DESCONTO2 || 0.00)} onChange={event => this.handleChangeItem(event, this.state.editIte.id)}/>
                                                        <input type="text" value="%" readOnly tabIndex='-1' className="FormField__Un" style={{margin: '0px 5px 0px 0px', display:'inline-block' }}></input>
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
                                                            name="PROIPI" value={(this.state.produto.IPI+' %' || '0.00 %')} tabIndex="-1" readOnly/>
                                                        </div>
                                                        <div style={{width: '65%', display:'inline'}}>
                                                            <input type="text" id="IPI" className="FormField__Input"
                                                            name="IPI" value={(this.state.editIte.IPI||0).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})} tabIndex="-1" readOnly/>
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
                                                            name="PROST_ICMS" value={(this.state.produto.ST_ICMS+' %' || '0.00 %')} tabIndex="-1" readOnly/>
                                                        </div>
                                                        <div style={{width: '65%', display:'inline'}}>
                                                            <input type="text" id="ST_ICMS" className="FormField__Input"
                                                            name="ST_ICMS" value={(this.state.editIte.ST_ICMS||0).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})} tabIndex="-1" readOnly/>
                                                        </div>
                                                    </div>
                                            </div>
                                            <div className="FormField">
                                                <label className="FormField__Label" htmlFor="TOTAL">VALOR TOTAL</label>
                                                <input type="text" id="TOTAL" className="FormField__Input" 
                                                name="TOTAL" value={(this.state.editIte.TOTAL||0).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) } tabIndex="-1" readOnly/>
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
                                        <Radio label='PEDIDO' name='ORCAMENTO' style={{color: 'white'}} checked={this.state.now.ORCAMENTO === "N"} onChange={this.handleTogglePed} toggle/>
                                        <Radio label='ORÇAMENTO' name='ORCAMENTO' style={{color: 'white'}} checked={this.state.now.ORCAMENTO === "S"} onChange={this.handleToggleOrc} toggle/>
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
                                        name="OBSERVACAO" value={this.state.now.OBSERVACAO || ''} onChange={this.handleChange}/>
                                    </div>
                                    <div>
                                        ITENS:
                                        <ListGroup>
                                            {/* {listItens} */}
                                            {this.loading(this.state.isLoading, listItens)}
                                        </ListGroup>
                                    </div>
                                    {savingItem(this.state.savingShow, this.state.savingPhase, this.saving)}
                                        <LinkContainer to="/macropecas/pedidos"><button className="FormField__Button mr-20">Voltar</button></LinkContainer>
                                        {this.saveBtn(this.state.ok)}
                                        {this.hideShow()}
                                        <button className="FormField__Button__Fix" onClick={this.willShow}><SvgIcon className='FormField__Icon__Fix' size={24} icon={plus}/></button>                                    
                                </form>
                                </div>
                            </div>
                        </div>
                )
        } else { return <Redirect exact to="/macropecas/"/>}
    }
}




export default Example;
