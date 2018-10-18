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
import {ic_assignment} from 'react-icons-kit/md/ic_assignment'
import {ListGroup, ListGroupItem} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import { readTable, deleteData } from "./Utils";
import {plus} from 'react-icons-kit/fa/plus'
import {ic_keyboard_arrow_left} from 'react-icons-kit/md/ic_keyboard_arrow_left'
import {ic_keyboard_arrow_right} from 'react-icons-kit/md/ic_keyboard_arrow_right'













class Example extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            pedidos  : [],
            show: true,
            filter:  {
                RAZAO_SOCIAL: '',
            },
            filtered: [],
            detailed: false,
            iddetailed: 0,
            op: 'r',
        };
        this.handleRefresh = this.handleRefresh.bind(this);
        this.createItems = this.createItems.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleExcluir = this.handleExcluir.bind(this);
        this.handleClean = this.handleClean.bind(this);
        this.hideShow = this.hideShow.bind(this);
        this.handleBar = this.handleBar.bind(this);
        this.appBar = this.appBar.bind(this);
        this.masterDetail = this.masterDetail.bind(this)

    }

    componentDidMount(){
        readTable(Data => {this.setState({pedidos: Data.data.pedidos, filtered: Data.data.pedidos})})      
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
            <ListGroupItem href="#" className="FormField__Grid">
            Código: {item.CODIGOPRO}<br/>
            Quantidade: {item.QUANTIDADE}<br/>
            Valor: {'R$ '+item.VALOR}<br/>
            Valor ICMS: {'R$ '+(item.VALOR_STICMS||'0.00')}<br/>
            </ListGroupItem>
        )
    }

    createItems(item, id){
        if (this.state.detailed === true){
            if (this.state.iddetailed === id){
                let listItens = []
                if (typeof item.itens !== 'undefined'){
                    listItens = item.itens.map(this.createSons)}
                else listItens = (<ListGroupItem className="FormField__Grid">Nenhum item.</ListGroupItem>)
                return   (
                    <ListGroupItem header={item.NUMPED} href="#" className="FormField__GridDetailed" onClick={() => {this.masterDetail(id)}}>
                    Data: {item.DATA}<br/>
                    Cliente: {item.RAZAO_SOCIAL}<br/>
                    Condição de Pagamento: {item.NOMECPG}<br/>
                    Valor: {'R$ '+item.VALOR_CALCULADO}<br/>
                    Valor Informado: {'R$ '+item.VALOR_CALCULADO}<br/>
                    Data de Envio: {item.DATA_ENVIO}<br/>
                    Código: {item.PK_PED}<br/>
                    <div>
                        Itens:
                        <LinkContainer to={"/pedidos/registro/"+id}>
                            <ListGroup>
                                {listItens}
                            </ListGroup>
                        </LinkContainer>  
                    </div>
                    <LinkContainer to={"/pedidos/registro/"+id}><button className="Grid__Button">Editar</button></LinkContainer>
                    </ListGroupItem>
                )
            } else {
                return (
                    <ListGroupItem header={item.NUMPED} href="#" className="FormField__Grid" onClick={() => {this.masterDetail(id)}}>
                    Data: {item.DATA}<br/>
                    Cliente: {item.RAZAO_SOCIAL}<br/>
                    Condição de Pagamento: {item.NOMECPG}<br/>
                    Valor: {'R$ '+item.VALOR_CALCULADO}<br/>
                    <LinkContainer to={"/pedidos/registro/"+id}><button className="Grid__Button">Editar</button></LinkContainer>
                    </ListGroupItem>
                )
            }
        } else {
            return (
                <ListGroupItem header={item.NUMPED} href="#" className="FormField__Grid" onClick={() => {this.masterDetail(id)}}>
                Data: {item.DATA}<br/>
                Cliente: {item.RAZAO_SOCIAL}<br/>
                Condição de Pagamento: {item.NOMECPG}<br/>
                Valor: {'R$ '+item.VALOR_CALCULADO}<br/>
                <LinkContainer to={"/pedidos/registro/"+id}><button className="Grid__Button">Editar</button></LinkContainer>
                </ListGroupItem>
            )
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


    hideShow(){
        let show = this.state.show
        if (show) {        
            return (<button className="FormField__Button__HideShow" onClick={this.handleBar}><SvgIcon className='FormField__Icon__ShowHide' size={32} icon={ic_keyboard_arrow_left}/></button>)
        } else {
            
            return (<button className="FormField__Button__HideShow" onClick={this.handleBar}><SvgIcon className='FormField__Icon__ShowHide' size={32} icon={ic_keyboard_arrow_right}/></button>)
        }
    }

    handleExcluir(e) {
        e.preventDefault()
        let table = this.state.pedidos
        // console.log(this.state.clientes[e.target.id])
        let result = window.confirm('Confirma a exclusão de "'+table[e.target.id].RAZAO_SOCIAL.trim()+'"?')
        if (result) {
            let removed = table.splice(e.target.id, 1)
            this.setState({pedidos: table})
            deleteData('pedidos',removed, e.target.id)
        }
    }


    handleChange(e){
        e.preventDefault()
        let target = e.target
        let value = target.type === 'checkbox' ? target.checked : target.value
        let name = target.name
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
        dados.forEach(element => {
            // if (JSON.stringify(element.RAZAO_SOCIAL).toUpperCase().includes(filtro.RAZAO_SOCIAL.toUpperCase())){
            //     filtrados.push(element)
            // }
            if (JSON.stringify(element.RAZAO_SOCIAL).toUpperCase().includes(filtro.RAZAO_SOCIAL.toUpperCase()) && JSON.stringify(element.CNPJ).toUpperCase().includes(filtro.CNPJ.toUpperCase())){
                filtrados.push(element)
            }


        });
        this.setState({filtered: filtrados}) 
    }

    handleClean(e){
        let dados = this.state.pedidos
        let filtro = []
        filtro.RAZAO_SOCIAL = ''
        filtro.CNPJ = ''
        let filtrados = dados
        this.setState({filtered: filtrados, filter: filtro}) 
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
                            <div className="FormField">
                                <label className="FormFilter__Label" htmlFor="RAZAO_SOCIAL">Razão Social:</label>
                                <input type="text" id="RAZAO_SOCIAL" className="FormFilter__Input" 
                                name="RAZAO_SOCIAL" value={this.state.filter.RAZAO_SOCIAL} onChange={this.handleChange}/>
                                <br/>
                                {/* <label className="FormFilter__Label" htmlFor="CNPJ">CNPJ:</label>
                                <input type="text" id="CNPJ" className="FormFilter__Input" 
                                name="CNPJ" value={this.state.filter.CNPJ} onChange={this.handleChange}/>*/}
                                <div>
                                    <button className="FormField__Button" onClick={this.handleRefresh}>Filtrar</button>  
                                    <button className="FormField__Button" onClick={this.handleClean}>Limpar</button> 
                                </div>
                            </div>
                            <div>
                                
                                <br/>
                                {this.hideShow()}
                                <LinkContainer to={"/pedidos/registro"}><button className="FormField__Button__Fix" onClick={this.handleShow}><SvgIcon className='FormField__Icon__Fix' size={24} icon={plus}/></button></LinkContainer>                       
                            </div>
                            <div>                    
                                <ListGroup>
                                    {listData}
                                </ListGroup>
                            </div>  
                        {/* </form>  */}
                    </div>
                </div>
            </div>

    );} else { return <Redirect exact to="/"/>}
  }
}




export default Example;
