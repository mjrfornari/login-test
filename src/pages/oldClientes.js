import React from "react";
// import { render } from "react-dom";
import { Redirect } from 'react-router-dom';
import SideNav, { Nav, NavIcon, NavText } from 'react-sidenav';
import SvgIcon from 'react-icons-kit';
import _ from "lodash";
import { ic_account_box } from 'react-icons-kit/md/ic_account_box';
import { ic_home } from 'react-icons-kit/md/ic_home'
import { ic_add_shopping_cart } from 'react-icons-kit/md/ic_add_shopping_cart';
import { ic_exit_to_app } from 'react-icons-kit/md/ic_exit_to_app'
import {ic_build} from 'react-icons-kit/md/ic_build'
import {ic_sync} from 'react-icons-kit/md/ic_sync'
import {ic_assignment} from 'react-icons-kit/md/ic_assignment'
import { exportaData, syncData } from "./Utils";
// import { PouchDB, Find } from "react-pouchdb";
// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";


//  const rawData = syncData()










class Example extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      pages: null,
      loading: true,
      json: [],
      onCadastro: false
    };
    this.trocaCadastro = this.trocaCadastro.bind(this);
    // this.componentDidMount = this.componentDidMount.bind(this);
  }

  // componentDidMount(){
  //   exportaData(databaseData => {
  //     console.log(databaseData)
  //     this.setState({json: databaseData})}) 
      
  //     // this.setState({ loading: false });
  // }
  trocaCadastro(){
    this.setState({
      onCadastro : !this.state.onCadastro})
      // console.log(this.state.onCadastro)
  }


  render() {
    const { data, pages, loading } = this.state;
    let logou = localStorage.getItem("logou");
    if (logou === "true") {
    let cadastro = null
    if (this.state.onCadastro) {
      // console.log(this.state.onCadastro)
      cadastro = <p>Oi</p>;
    }
    return (
              <div className="App">
                <div className="App__Aside">
                    {/* <div className="App__Aside__BG"></div> */}
                    <div> 
                        <SideNav highlightColor='white' highlightBgColor='#506b55' defaultSelected='clientes' 
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
                         
                        <input type="button" className="FormField__Button mr-20" value="Cadastro" onClick={this.trocaCadastro}/>

                        {cadastro}
                        </form>
                    </div>
                </div>
            </div>

    );} else { return <Redirect exact to="/"/>}
  }
}

export default Example;