import React from "react";
import ReactDOM from "react-dom";
import Clock from 'react-live-clock';
import CRUDTable, {
  Fields,
  Field,
  CreateForm,
  UpdateForm,
  DeleteForm,
  Pagination
} from "react-crud-table";
import { Redirect } from 'react-router-dom';
import SideNav, { Nav, NavIcon, NavText } from 'react-sidenav';
import SvgIcon from 'react-icons-kit';
import _ from "lodash";
import { Icon } from 'react-icons-kit'
import { ic_account_box } from 'react-icons-kit/md/ic_account_box';
import { ic_home } from 'react-icons-kit/md/ic_home'
import { ic_add_shopping_cart } from 'react-icons-kit/md/ic_add_shopping_cart';
import { ic_exit_to_app } from 'react-icons-kit/md/ic_exit_to_app'
import {ic_build} from 'react-icons-kit/md/ic_build'
import {ic_sync} from 'react-icons-kit/md/ic_sync'
import {ic_assignment} from 'react-icons-kit/md/ic_assignment'
import {ic_more_horiz} from 'react-icons-kit/md/ic_more_horiz'

// Component's Base CSS
import "./Table.css";

const DescriptionRenderer = ({ field }) => <textarea {...field} />;

let tasks = [
  {
    id: 1,
    title: "Create an example",
    description: "Create an example of how to use the component"
  },
  {
    id: 2,
    title: "Improve",
    description: "Improve the component!"
  },
  {
    id: 3,
    title: "Create a pagination example",
    description: "Yeah!! It will be created."
  },
  {
    id: 4,
    title: "Sing a song",
    description: "La, la, laaaa"
  },
  {
    id: 5,
    title: "Write something",
    description: "Something"
  }
];

const SORTERS = {
  NUMBER_ASCENDING: mapper => (a, b) => mapper(a) - mapper(b),
  NUMBER_DESCENDING: mapper => (a, b) => mapper(b) - mapper(a),
  STRING_ASCENDING: mapper => (a, b) => mapper(a).localeCompare(mapper(b)),
  STRING_DESCENDING: mapper => (a, b) => mapper(b).localeCompare(mapper(a))
};

const getSorter = data => {
  const mapper = x => x[data.field];
  let sorter = SORTERS.STRING_ASCENDING(mapper);

  if (data.field === "id") {
    sorter =
      data.direction === "ascending"
        ? SORTERS.NUMBER_ASCENDING(mapper)
        : SORTERS.NUMBER_DESCENDING(mapper);
  } else {
    sorter =
      data.direction === "ascending"
        ? SORTERS.STRING_ASCENDING(mapper)
        : SORTERS.STRING_DESCENDING(mapper);
  }

  return sorter;
};

let count = tasks.length;
const service = {
  fetchItems: payload => {
    const { activePage, itemsPerPage } = payload.pagination;
    const start = (activePage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    let result = Array.from(tasks);
    result = result.sort(getSorter(payload.sort));
    return Promise.resolve(result.slice(start, end));
  },
  create: task => {
    count += 1;
    tasks.push({
      ...task,
      id: count
    });
    return Promise.resolve(task);
  },
  update: data => {
    const task = tasks.find(t => t.id === data.id);
    task.title = data.title;
    task.description = data.description;
    return Promise.resolve(task);
  },
  delete: data => {
    const task = tasks.find(t => t.id === data.id);
    tasks = tasks.filter(t => t.id !== task.id);
    return Promise.resolve(task);
  },
    fetchTotal: payload => {
    return Promise.resolve(tasks.length);
  }
};





const styles = {
  container: { margin: "auto", width: "fit-content" }
};

class Example extends React.Component {
    constructor() {
    super();
    this.state = {
      onCadastro: true
    };
    this.trocaCadastro = this.trocaCadastro.bind(this);
    // this.componentDidMount = this.componentDidMount.bind(this);
  }
  
  
  
  trocaCadastro(){
    this.setState({
      onCadastro : !this.state.onCadastro})
      // console.log(this.state.onCadastro)
  }

 render() {
    let logou = localStorage.getItem("logou");
    console.log('a '+logou)
    if (logou === "true") {
    let bar = "App__Form"
    if (this.state.onCadastro) {
      bar = "App__Form__Full";
    }
    return (        
              <div className="App">
                <div className="App__Aside">
                    <div> 
                        <SideNav highlightColor='white' highlightBgColor='#506b55' defaultSelected='clientes'
                         onItemSelection={ (id, parent) => {
                            if (id==='exit'){  
                                localStorage.setItem("logou", false);    
                                this.props.history.push('../')
                            } else {this.props.history.push('../'+id)
                        }
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
                <div className={bar}>
                    <div className="FormCenter">
                        <div className="FormTitle">
                            <Clock format={'DD/MM/YYYY - HH:mm'} ticking={true}/> 
                            <br/>
                            <h1 className="FormTitle__Link--Active">Clientes</h1>
                        </div>
                        {/* <form className="FormFields"> */}
                            
                            <div style={styles.container}>
                                <CRUDTable                                
                                fetchItems={payload => service.fetchItems(payload)}
                                >
                                <Fields>
                                    <Field name="id" label="Cód." hideInCreateForm />
                                    <Field name="title" label="Cód. Representada" placeholder="Cód. Representada" />
                                    <Field
                                    name="description"
                                    label="Razão Social"
                                    render={DescriptionRenderer}
                                    />
                                    <Field name="title" label="CNPJ" placeholder="CNPJ" />
                                    <Field name="title" label="Fone 1" placeholder="Fone 1" />
                                </Fields>
                                <CreateForm
                                    title="Registro de Cliente"
                                    message="Inclusão"
                                    trigger="Incluir"
                                    onSubmit={task => service.create(task)}
                                    submitText="Create"
                                    validate={values => {
                                    const errors = {};
                                    if (!values.title) {
                                        errors.title = "Please, provide task's title";
                                    }

                                    if (!values.description) {
                                        errors.description = "Please, provide task's description";
                                    }

                                    return errors;
                                    }}
                                />

                                <UpdateForm
                                    title="Registro de Cliente"
                                    message="Edição"
                                    trigger="Detalhar"
                                    onSubmit={task => service.update(task)}
                                    submitText="Update"
                                    validate={values => {
                                    const errors = {};

                                    if (!values.id) {
                                        errors.id = "Please, provide id";
                                    }

                                    if (!values.title) {
                                        errors.title = "Please, provide task's title";
                                    }

                                    if (!values.description) {
                                        errors.description = "Please, provide task's description";
                                    }

                                    return errors;
                                    }}
                                />

                                <DeleteForm
                                    title="Excluir Registro"
                                    message="Você tem certeza que deseja excluir o registro?"
                                    trigger="Excluir"
                                    onSubmit={task => service.delete(task)}
                                    submitText="Excluir"
                                    validate={values => {
                                    const errors = {};
                                    if (!values.id) {
                                        errors.id = "Please, provide id";
                                    }
                                    return errors;
                                    }}
                                />
                                <Pagination
                                    itemsPerPage={2}
                                    fetchTotalOfItems={payload => service.fetchTotal(payload)}
                                />
                                </CRUDTable>
                            </div>
                        {/* </form> */}
                    </div>
                </div>
                <button className="FormField__Button__Bar" onClick={this.trocaCadastro}> <Icon size={30} icon={ic_more_horiz}/></button>
            </div>
    );} else { return <Redirect exact to="/"/>}
  }
}




export default Example;
