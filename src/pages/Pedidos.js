import React from "react";
import Clock from 'react-live-clock';
import { Redirect } from 'react-router-dom';
import SideNav, { Nav, NavIcon, NavText } from 'react-sidenav';
import SvgIcon from 'react-icons-kit';
import { ic_account_box } from 'react-icons-kit/md/ic_account_box';
import { ic_home } from 'react-icons-kit/md/ic_home'
import { ic_add_shopping_cart } from 'react-icons-kit/md/ic_add_shopping_cart';
import { ic_exit_to_app } from 'react-icons-kit/md/ic_exit_to_app'
import {ic_build} from 'react-icons-kit/md/ic_build'
import {ic_sync} from 'react-icons-kit/md/ic_sync'
import {ListGroup, ListGroupItem, Pagination} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import { readTable, deleteData, garanteDate, now} from "./Utils";
import {plus} from 'react-icons-kit/fa/plus'
import {ic_keyboard_arrow_left} from 'react-icons-kit/md/ic_keyboard_arrow_left'
import {ic_keyboard_arrow_right} from 'react-icons-kit/md/ic_keyboard_arrow_right'













class Example extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            pedidos  : [],
            show: false,
            filter:  {
                RAZAO_SOCIAL: '',
                DATA_MIN: now(-30),
                DATA_MAX: now(0)
            },
            filtered: [],
            detailed: false,
            iddetailed: 0,
            op: 'r',
            page: 1,
            inputPage: 1,
            maxPages: 1
        };
        this.show = false;
        this.handleRefresh = this.handleRefresh.bind(this);
        this.createItems = this.createItems.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleExcluir = this.handleExcluir.bind(this);
        this.handleClean = this.handleClean.bind(this);
        this.hideShow = this.hideShow.bind(this);
        this.handleBar = this.handleBar.bind(this);
        this.appBar = this.appBar.bind(this);
        this.setPage = this.setPage.bind(this);
        this.calcPages = this.calcPages.bind(this);
        this.masterDetail = this.masterDetail.bind(this)
        this.paginacao = this.paginacao.bind(this)

    }

    componentDidMount(){
        readTable(Data => {this.setState({pedidos: Data.data.pedidos, filtered: []})})      
    }
    

    masterDetail(id){
        if (id === this.state.iddetailed){
            this.setState({detailed: !(this.state.detailed)})
        } else {
            this.setState({detailed: true, iddetailed: id})
        }
    }

    createSons(item, id){
        return(
            <ListGroupItem href="#" key={id} className="FormField__Grid">
                Código: {item.CODIGOPRO}<br/>
                Descrição: {item.DESCRICAOPRO}<br/>
                Quantidade: {item.QUANTIDADE}<br/>
                IPI: {item.IPI+'%'}<br/>
                Valor: {'R$ '+item.VALOR}<br/>
                Valor ICMS: {'R$ '+(item.VALOR_STICMS||'0.00')}<br/>
            </ListGroupItem>
        )
    }

    handleExcluir(e) {
        e.preventDefault()
        let table = this.state.pedidos
        // console.log(this.state.clientes[e.target.id])
        let result = window.confirm('Confirma a exclusão do pedido?')
        if (result) {
            let removed = table.splice(e.target.id, 1)
            this.handleClean()
            this.setState({pedidos: table, iddetailed:0, detailed:false})
            deleteData('pedidos',removed, e.target.id)
        }
    }



    nextPage(){
            if(this.state.page===this.state.maxPages){
                return ''
            } else {
                return this.state.page+1
            }
    }

    prevPage(){
            if(this.state.page===1){
                return ''
            } else {
                return this.state.page-1
            }
    }

    paginacao(){
        if (this.state.maxPages>1){
            return (
                <Pagination>
                    <button className="FormField__Pagination__First" onClick={event => this.setPage(event,this.state.page,-1)}>{'◀'}</button>
                    <button className="FormField__Pagination" onClick={event => this.setPage(event,1,0)}>1</button>

                    <div className="FormField__Pagination__OutInput">
                        <input type="text" className="FormField__Pagination__Input" value={this.state.inputPage} onChange={event => this.setPage(event,1,0)}></input> 
                    </div>

                    <button className="FormField__Pagination" onClick={event => this.setPage(event,this.state.maxPages,0)}>{this.state.maxPages}</button>
                    <button className="FormField__Pagination__Last" onClick={event => this.setPage(event,this.state.page,1)}>{'▶'}</button>
                </Pagination>
            )
        }
    }

    createItems(item, id){
        if ((id <= (this.state.page*20)-1) && (id >= (this.state.page*20)-20)){
            if (this.state.detailed === true){
                if (this.state.iddetailed === id){
                    let listItens = []
                    if (typeof item.itens !== 'undefined'){
                        listItens = item.itens.map(this.createSons)}
                    else listItens = (<ListGroupItem className="FormField__Grid">Nenhum item.</ListGroupItem>)
                    return   (
                        <ListGroupItem header={item.NUMPED ? 'Nº Pedido: '+item.NUMPED:''} href="#" key={id} className="FormField__GridDetailed" onClick={() => {this.masterDetail(id)}}>
                        Sincronizado: {(item.PK_PED>0) ? 'Sim' : 'Não' }<br/>
                        Tipo: {(item.ORCAMENTO==='N') ? 'Pedido' : 'Orçamento' }<br/>
                        Data: {garanteDate(item.DATA)}<br/>
                        Cliente: {item.RAZAO_SOCIAL}<br/>
                        Condição de Pagamento: {item.NOMECPG}<br/>
                        Valor: {'R$ '+item.VALOR_INFORMADO}<br/>
                        Valor Produtos: {'R$ '+item.VALOR_CALCULADO}<br/>
                        Valor Ipi: {'R$ '+item.VALOR_IPI}<br/>
                        Valor ST ICMS: {'R$ '+item.VALOR_ST}<br/>
                        Código: {item.PK_PED}<br/>
                        <div>
                            Itens:
                            <LinkContainer to={"/macropecas/pedidos/registro/"+id}>
                                <ListGroup>
                                    {listItens}
                                </ListGroup>
                            </LinkContainer>  
                        </div>
                        <LinkContainer to={"/macropecas/pedidos/registro/"+id}><button className="Grid__Button">Editar</button></LinkContainer>
                        <button className={item.PK_PED>0 ? "Grid__Button__Hide" : "Grid__Button"} id={id} onClick={this.handleExcluir}>Excluir</button> 
                        </ListGroupItem>
                    )
                } else {
                    return (
                        <ListGroupItem header={item.NUMPED ? 'Nº Pedido: '+item.NUMPED:''} href="#" key={id} className="FormField__Grid" onClick={() => {this.masterDetail(id)}}>
                        Sincronizado: {(item.PK_PED>0) ? 'Sim' : 'Não' }<br/>
                        Tipo: {(item.ORCAMENTO==='N') ? 'Pedido' : 'Orçamento' }<br/>
                        Data: {garanteDate(item.DATA)}<br/>
                        Cliente: {item.RAZAO_SOCIAL}<br/>
                        Condição de Pagamento: {item.NOMECPG}<br/>
                        Valor: {'R$ '+item.VALOR_INFORMADO}<br/>
                        <LinkContainer to={"/macropecas/pedidos/registro/"+id}><button className="Grid__Button">Editar</button></LinkContainer>
                        <button className={item.PK_PED>0 ? "Grid__Button__Hide" : "Grid__Button"} id={id} onClick={this.handleExcluir}>Excluir</button> 
                        </ListGroupItem>
                    )
                }
            } else {
                return (
                    <ListGroupItem header={item.NUMPED ? 'Nº Pedido: '+item.NUMPED:''} href="#" key={id} className="FormField__Grid" onClick={() => {this.masterDetail(id)}}>
                    Sincronizado: {(item.PK_PED>0) ? 'Sim' : 'Não' }<br/>
                    Tipo: {(item.ORCAMENTO==='N') ? 'Pedido' : 'Orçamento' }<br/>
                    Data: {garanteDate(item.DATA)}<br/>
                    Cliente: {item.RAZAO_SOCIAL}<br/>
                    Condição de Pagamento: {item.NOMECPG}<br/>
                    Valor: {'R$ '+item.VALOR_INFORMADO}<br/>
                    <LinkContainer to={"/macropecas/pedidos/registro/"+id}><button className="Grid__Button">Editar</button></LinkContainer>
                    <button className={item.PK_PED>0 ? "Grid__Button__Hide" : "Grid__Button"} id={id} onClick={this.handleExcluir}>Excluir</button> 
                    </ListGroupItem>
                )
            }
        }
    }



    handleBar(e){
        e.preventDefault()
        let showBar = this.state.show
        this.setState({show: !(showBar)})
    }

    appBar(mostra){
        if (mostra){
            return(
                <div className='App__Aside'>
                        <div>   
                            <SideNav highlightColor='var(--cor-letra)' highlightBgColor='var(--cor-2)' defaultSelected='pedidos'
                                        onItemSelection={ (id, parent) => {
                                            if (id==='exit'){  
                                                localStorage.setItem("logou", false);    
                                                this.props.history.push('/macropecas/')
                                            } else {this.props.history.push('/macropecas/'+id)
                            }}}>                      
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
                                    <NavIcon className='BarIcon'><SvgIcon size={30} icon={ic_sync}/></NavIcon>
                                    <NavText className='BarText'> Sincronização </NavText>
                                </Nav>
                                <Nav id='exit'>
                                    <NavIcon className='BarIcon'><SvgIcon size={30} icon={ic_exit_to_app}/></NavIcon>
                                    <NavText className='BarText'> Sair </NavText>
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


    hideShow(){
        let show = this.state.show
        if (show) {        
            return (<button className="FormField__Button__HideShow" onClick={this.handleBar}><SvgIcon className='FormField__Icon__ShowHide' size={32} icon={ic_keyboard_arrow_left}/></button>)
        } else {
            
            return (<button className="FormField__Button__HideShow" onClick={this.handleBar}><SvgIcon className='FormField__Icon__ShowHide' size={32} icon={ic_keyboard_arrow_right}/></button>)
        }
    }




    handleChange(e){
        e.preventDefault()
        let target = e.target
        let value = target.type === 'checkbox' ? target.checked : target.value
        let name = target.name
        console.log(value)
        let reg = this.state.filter
        reg[name] = value
        this.setState({
                    filter : reg
        })
        
    }


    handleRefresh(e){
        e.preventDefault()
        let dados = this.state.pedidos
        let filtro = this.state.filter
        let filtrados = []

        let datamax = new Date (filtro.DATA_MAX)
        let datamin = new Date (filtro.DATA_MIN)
        dados.forEach(element => {
            let data = new Date (element.DATA)
            let maior = true
            let menor = true
            if (!isNaN(datamax.getTime())) {
                if (data > datamax){
                    maior = false
                }
            }
            if (!isNaN(datamin.getTime())) {
                if (data < datamin){
                    menor = false
                }
            }
            if (JSON.stringify(element.RAZAO_SOCIAL).toUpperCase().includes(filtro.RAZAO_SOCIAL.toUpperCase()) && maior && menor){
                        filtrados.push(element)
            }
        });
        this.setState({filtered: filtrados}) 
    }

    handleClean(e){
        // let dados = this.state.pedidos
        let filtro = []
        filtro.RAZAO_SOCIAL = ''
        filtro.DATA_MIN = now(-30)
        filtro.DATA_MAX = now(0)
        let filtrados = []
        this.setState({filtered: filtrados, filter: filtro, page:1, maxPages: 1}) 
    }

    setPage(e,setar, add){
        e.preventDefault();
        console.log(e.target.type)
        if (e.target.type === 'submit'){
            let gotoPage = (setar+add)
            if (gotoPage > this.state.maxPages){
                gotoPage = this.state.maxPages
            } else if (gotoPage < 1) {
                gotoPage = 1
            }
            this.setState({page: gotoPage, inputPage: gotoPage})
        } else {
                let pg = e.target.value
                if (pg !== '') {
                    if (pg > this.state.maxPages || pg < 1) {
                        alert('Página não encontrada')
                    } else {
                        this.setState({page: Number(pg), inputPage: Number(pg)})
                    }
                } else {this.setState({inputPage: Number(pg)})}
        }
    }

    calcPages(registros){
        let x = Math.ceil(registros/20)
        this.setState({maxPages: x})
    }

    render() {
        let Data = this.state.filtered
        let listData = Data.map(this.createItems)
        let logou = localStorage.getItem("logou");
        let bar = this.appBar(this.state.show);
        if (logou === "true") {
        return (     
                <div className="App">
                    {bar}
                    <div className="App__Form">
                        <div className="FormCenter">
                            <div className="FormTitle">
                                <Clock format={'DD/MM/YYYY - HH:mm'} ticking={true}/> 
                                <br/>
                                <h1 className="FormTitle__Link--Active">Pedidos</h1>
                            </div>
                            {/* <form className="FormFields">   */}
                                    <div>
                                        Filtro:
                                        <div className='box_inverted'> 
                                            <div className="FormField">
                                                <label className="FormFilter__Label" htmlFor="RAZAO_SOCIAL">Razão Social</label>
                                                <input type="text" id="RAZAO_SOCIAL" className="FormFilter__Input" 
                                                name="RAZAO_SOCIAL" value={this.state.filter.RAZAO_SOCIAL || ''} onChange={this.handleChange}/>
                                                <label className="FormFilter__Label">PERÍODO</label>
                                                <input id="DATA_MIN" name="DATA_MIN" className="FormFilter__Date" type="date" value={this.state.filter.DATA_MIN || ''} onChange={this.handleChange}></input>
                                                <input id="DATA_MAX" name="DATA_MAX" className="FormFilter__Date" type="date" value={this.state.filter.DATA_MAX || ''} onChange={this.handleChange}></input>
                                                <div>
                                                    <button className="FormField__Button" onClick={this.handleRefresh}>Pesquisar</button>  
                                                    <button className="FormField__Button" onClick={this.handleClean}>Limpar</button> 
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                <div>
                                    
                                    <br/>
                                    {this.hideShow()}
                                    <LinkContainer to={"/macropecas/pedidos/registro"}><button className="FormField__Button__Fix" onClick={this.handleShow}><SvgIcon className='FormField__Icon__Fix' size={24} icon={plus}/></button></LinkContainer>                       
                                </div>
                                <div>                    
                                    <ListGroup>
                                        {listData}
                                    </ListGroup>
                                </div>  
                                <div> 
                                    {this.paginacao()}
                                </div>  
                            {/* </form>  */}
                        </div>
                    </div>
                </div>

        );} else { return <Redirect exact to="/macropecas/"/>}
    }
}




export default Example;
