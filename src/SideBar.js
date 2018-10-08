<SideNav highlightColor='white' highlightBgColor='#506b55' defaultSelected='clientes'
                         onItemSelection={ (id, parent) => {
                            if (id==='exit'){  
                                localStorage.setItem("logou", false);    
                                this.props.history.push('/')
                            } else {this.props.history.push('/'+id)
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