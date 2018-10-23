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
import { readTable, editData, appendData, geraInput, removeAcento } from "./Utils";
import {ic_keyboard_arrow_left} from 'react-icons-kit/md/ic_keyboard_arrow_left'
import {ic_keyboard_arrow_right} from 'react-icons-kit/md/ic_keyboard_arrow_right'
import {ic_search} from 'react-icons-kit/md/ic_search'








class Example extends React.Component {
    constructor(props, context) {
    super(props, context);
    this.state = {
        clientes  : [],
        show: false,
        now : {PK_CLI: 0, RAZAO_SOCIAL: '', NOME_FANTASIA: '', CNPJ: '', FONE1: '', CODIGO_REPRESENTADA:'', CIDADE:'', BAIRRO:'', ENDEREÇO: '', CEP: '', NUMERO:'', FONE2:'', DDD1:'', DDD2:'', INSCRICAO_ESTADUAL:'', INSCRICAO_MUNICIPAL:'', SUFRAMA:'', EMAIL:'', EMAIL_FINANCEIRO:''},
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
    this.enviaCEP = this.enviaCEP.bind(this);
  }
  
    saveBtn(ok) {
        if (ok === false){
            return (<input type="submit" className="FormField__Button mr-20" value="Salvar" onSubmit={this.handleSubmit}/>)
        } else {
            return (<input type="submit" className="FormField__ButtonDisabled mr-20" value="Salvar"/>)
        }
    }

    appBar(mostra){
        if (mostra){
            return(
                <div className='App__Aside'>
                        <div>   
                            <SideNav highlightColor='white' highlightBgColor='#506b55' defaultSelected='clientes'
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
        if (pathname.includes('clientes')) {           
            if (this.state.isLoading === true) {
                if (this.props.location.pathname !== '/clientes/registro') {
                    let ID = this.props.location.pathname.replace('/clientes/registro/','');
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
            if (this.state.append === true) {
                appendData('clientes', this.state.now)     
                this.setState({ok: true})    
            } else {
                editData('clientes', this.state.now, this.state.id)
                this.setState({ok: true})  
            }
        }

    }

  handleChange(e){
        let target = e.target
        let value = target.type === 'checkbox' ? target.checked : target.value
        let name = target.name
        if (name !== 'PK_CLI'){
            let reg = this.state.now
            reg[name] = value.toUpperCase()
                this.setState({
                    now : reg
                })
        }
  }

    enviaCEP(e){
        e.preventDefault()
        if (this.state.now.CEP.length >= 8){
            let cep = this.state.now.CEP
            fetch('https://viacep.com.br/ws/'+cep.replace(/[^\d]/, '')+'/json/').then(r => r.json()).then(r => {
                console.log(r)
                let bairro = removeAcento(r.bairro).toUpperCase()
                let logradouro = removeAcento(r.logradouro).toUpperCase()
                let localidade = removeAcento(r.localidade).toUpperCase()
                let registro = this.state.now
                registro.CIDADE = localidade
                registro.BAIRRO = bairro
                registro.ENDERECO = logradouro
                registro.NUMERO = ''
                this.setState({now: registro})
            })
        }
    }

 render() {
    let bar = this.appBar(this.state.show);
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
                                    <h1 className="FormTitle__Link--Active">Registro de Clientes</h1>
                                </div>
                                {geraInput('PK_CLI','CÓDIGO',this.state.now.PK_CLI, ()=>{})}
                                <form className="FormFields" onSubmit={this.handleSubmit}>
                                <div className="FormField">
                                    <label className="FormField__Label" htmlFor="RAZAO_SOCIAL">Razão Social</label>
                                    <input type="text" id="RAZAO_SOCIAL" className="FormField__Input" 
                                    name="RAZAO_SOCIAL" value={this.state.now.RAZAO_SOCIAL} onChange={this.handleChange}/>
                                </div>
                                <div className="FormField">
                                    <label className="FormField__Label" htmlFor="NOME_FANTASIA">NOME FANTASIA</label>
                                    <input type="text" id="NOME_FANTASIA" className="FormField__Input" 
                                    name="NOME_FANTASIA" value={this.state.now.NOME_FANTASIA} onChange={this.handleChange}/>
                                </div>
                                <div className="FormField">
                                    <label className="FormField__Label" htmlFor="CNPJ">CNPJ</label>
                                    <input type="text" id="CPNJ" className="FormField__Input" 
                                    name="CNPJ" value={this.state.now.CNPJ} onChange={this.handleChange}/>
                                </div>
                                {geraInput('INSCRICAO_ESTADUAL','INSCRIÇÃO ESTADUAL',this.state.now.INSCRICAO_ESTADUAL, this.handleChange)}
                                {geraInput('INSCRICAO_MUNICIPAL','INSCRIÇÃO MUNICIPAL',this.state.now.INSCRICAO_MUNICIPAL, this.handleChange)}
                                {geraInput('SUFRAMA','SUFRAMA',this.state.now.SUFRAMA, this.handleChange)}
                                ENDEREÇO
                                <div className='box_inverted'>
                                    <div className="FormField">
                                        <label className="FormField__Label" htmlFor="CEP">CEP</label>
                                        <input type="text" id="CEP" className="FormField__Input" style={{width: '100px'}}
                                        name="CEP" value={this.state.now.CEP} onChange={this.handleChange}/>
                                        <button id='buscaCEP' className='ButtonIcon' onClick={this.enviaCEP}><SvgIcon style={{transform: 'translate(0%, 30%)'}} size={26} icon={ic_search}/></button>
                                    </div>
                                    {geraInput('ENDERECO','LOGRADOURO',this.state.now.ENDERECO, this.handleChange)}
                                    {geraInput('NUMERO','Nº',this.state.now.NUMERO, this.handleChange, '100px')}
                                    {geraInput('BAIRRO','BAIRRO',this.state.now.BAIRRO, this.handleChange)}
                                    {geraInput('CIDADE','CIDADE',this.state.now.CIDADE, this.handleChange)}
                                </div>
                                CONTATO
                                <div className='box_inverted'>
                                    <div className="FormField">
                                        <label className="FormField__Label" htmlFor="FONE1">FONE 1</label>
                                        <input type="text" id="DDD1" className="FormField__Input" style={{width: '60px', margin: '0px 5px 0px 0px'}}
                                        name="DDD1" value={this.state.now.DDD1} onChange={this.handleChange}/>
                                        <input type="text" id="FONE1" className="FormField__InputTelefone"
                                        name="FONE1" value={this.state.now.FONE1} onChange={this.handleChange}/>
                                    </div>
                                    <div className="FormField">
                                        <label className="FormField__Label" htmlFor="FONE2">FONE 2</label>
                                        <input type="text" id="DDD2" className="FormField__Input" style={{width: '60px', margin: '0px 5px 0px 0px'}}
                                        name="DDD2" value={this.state.now.DDD2} onChange={this.handleChange}/>
                                        <input type="text" id="FONE2" className="FormField__InputTelefone"
                                        name="FONE2" value={this.state.now.FONE1} onChange={this.handleChange}/>
                                    </div>
                                    {geraInput('EMAIL','EMAIL NFE',this.state.now.EMAIL, this.handleChange)}
                                    {geraInput('EMAIL_FINANCEIRO','EMAIL FINANCEIRO',this.state.now.EMAIL_FINANCEIRO, this.handleChange)}
                                </div>


                                {this.hideShow()}
                                <LinkContainer to="/clientes"><button className="FormField__Button mr-20">Voltar</button></LinkContainer>
                                {this.saveBtn(this.state.ok)}
                            </form>
                            </div>
                        </div>
                    </div>
            )
    } else { return <Redirect exact to="/"/>}
  }
}




export default Example;
