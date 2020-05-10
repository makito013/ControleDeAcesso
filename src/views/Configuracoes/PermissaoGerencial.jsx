import React from "react";

// reactstrap components
import {
    Card,
    CardHeader,
    CardBody,
} from "reactstrap";
import { postAdonis } from "utils/api";
import { toast, Slide } from 'react-toastify';
import { injectIntl } from "react-intl";
import { Tree, Spin } from 'antd';
import { Select, Row, Col } from 'antd';
import { Button, Tabs} from 'antd';


const { TabPane } = Tabs;

           
class PermissaoGerencial extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            salvando: false,      
            selectedUser: [],
            expandedUser: [],
            checkedUser: [],
            selectedELS: [],
            expandedELS: [],
            checkedELS: [],
            selectedLocal: [],
            expandedLocal: [],
            checkedLocal: [],
            usuarios: [],
            els: [],
        };
        this.stringTranslate = this.stringTranslate.bind(this);  
        this.onCheckTree = this.onCheckTree.bind(this);
        this.onExpandTree = this.onExpandTree.bind(this);
        this.onSelectTree = this.onSelectTree.bind(this);
        this.preencheValores = this.preencheValores.bind(this);
        this.handleClickSalvar = this.handleClickSalvar.bind(this);

        this.preencheValores();
    }

    preencheValores(){
        const body = {
            cmd: 'permissoesGerencia',
            token: sessionStorage.getItem('token')
        };
        postAdonis(body, '/PermissaoGerencia/Index').then((data) =>{
            var vetorU = [], vetorE = [], vetorL = [];
            vetorU = data.dados.usuarios;
            vetorE = data.dados.empresas;
            vetorL = data.dados.locais;
            this.setState({usuarios: vetorU, els: vetorE, locais: vetorL});
        })
    }

    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }

    onExpandTree(expandedKeys, tree){
        this.state[tree] = expandedKeys;
        this.setState(this.state);
    }

    onSelectTree(selectedKeys, info, tree){
        if (tree === 'selectedUser' && selectedKeys[0]){
            const index = this.state.usuarios.findIndex(element => element.key === selectedKeys[0]);
            this.state['checkedELS'] = this.state.usuarios[index].permissoesELS
            this.state['checkedLocal'] = this.state.usuarios[index].permissoesLocal
        }
        else{
            this.state['checkedELS'] = []
            this.state['checkedLocal'] = []
        }
        this.state[tree] = selectedKeys;
        this.setState(this.state);
    }

    onCheckTree(checkedKeys, tree){
        if (!this.state.selectedUser[0])
            return;
        const index = this.state.usuarios.findIndex(element => element.key === this.state.selectedUser[0]);
        if (tree === 'checkedELS'){
            this.state.usuarios[index].permissoesELS = checkedKeys;
        }
        else if (tree === 'checkedLocal'){
            this.state.usuarios[index].permissoesLocal = checkedKeys;
        }
        var aux = this.state.usuarios;
        this.state.usuarios = [];
        this.state.usuarios = aux;
        console.log(checkedKeys);
        this.state[tree] = checkedKeys;
        this.setState(this.state);
    }

    handleClickSalvar(){
        this.state.salvando = true;
        this.setState({salvando: this.state.salvando});
        const body = {
            cmd: "salvarPermissoes",
            token: sessionStorage.getItem('token'),
            usuarios: this.state.usuarios
        }
        postAdonis(body, '/PermissaoGerencia/Salvar').then((data) =>{
            if (data.retorno){
                toast.success(data.mensagem, {
                    transition: Slide,
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    pauseOnVisibilityChange: false
                    });  
            }else{
                var msg = data.msg === undefined ? data.dados.erro : data.msg;
                toast.error("Error: "+msg, {
                    transition: Slide,
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    pauseOnVisibilityChange: false
                    });  
            }
            this.state.salvando = false;
            this.setState({salvando: this.state.salvando});
        })
    }
 
    render() {    
        return (
            <>
                <div className="content">
                    <Row>
                    </Row>
                    <Row>
                        <Card>
                            <CardHeader>{this.stringTranslate("Label.PermissoesGerenciais")}</CardHeader>
                            <CardBody>
                                <Tabs>
                                    <TabPane tab={this.stringTranslate('Label.VisaoPorUsuario')} key={1}>
                                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                            <Col md={12} sm={24}>
                                                <Card>
                                                    <CardHeader>{this.stringTranslate('Label.Usuarios')}</CardHeader>
                                                    <CardBody>
                                                        <Tree 
                                                        onSelect={(selectedKeys, info) => this.onSelectTree(selectedKeys, info, 'selectedUser')}
                                                        selectedKeys={this.state.selectedUser}
                                                        treeData={this.state.usuarios}
                                                        />
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                            <Col md={12} sm={24}>
                                                <Card>
                                                    <CardHeader>{this.stringTranslate('Label.Permissoes')}</CardHeader>
                                                    <CardBody>
                                                        <Tabs>
                                                            <TabPane tab={this.stringTranslate('Label.Empresa')} key={1}>
                                                                <Tree
                                                                checkable
                                                                autoExpandParent={true}
                                                                onCheck={(checkedKeys) => this.onCheckTree(checkedKeys, 'checkedELS')}
                                                                checkedKeys={this.state.checkedELS}
                                                                onExpand={(expandedKeys) => this.onExpandTree(expandedKeys, 'expandedELS')}
                                                                expandedKeys={this.state.expandedELS}
                                                                onSelect={(selectedKeys, info) => this.onSelectTree(selectedKeys, info, 'selectedELS')}
                                                                selectedKeys={this.state.selectedELS}
                                                                treeData={this.state.els}
                                                                />
                                                            </TabPane>
                                                            <TabPane tab={this.stringTranslate('Label.LocalAcesso')} key={2}>
                                                                <Tree 
                                                                checkable
                                                                autoExpandParent={true}
                                                                onCheck={(checkedKeys) => this.onCheckTree(checkedKeys, 'checkedLocal')}
                                                                checkedKeys={this.state.checkedLocal}
                                                                onExpand={(expandedKeys) => this.onExpandTree(expandedKeys, 'expandedLocal')}
                                                                expandedKeys={this.state.expandedLocal}
                                                                onSelect={(selectedKeys, info) => this.onSelectTree(selectedKeys, info, 'selectedLocal')}
                                                                selectedKeys={this.state.selectedLocal}
                                                                treeData={this.state.locais}
                                                                />
                                                            </TabPane>
                                                        </Tabs>
                                                        <Spin spinning={this.state.salvando} delay={0}>
                                                            <Button block onClick={this.handleClickSalvar}>{this.stringTranslate('Label.Salvar')}</Button>
                                                        </Spin>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </TabPane>
                                    {/* <TabPane tab={this.stringTranslate('Label.VisaoPorLocal')} key={2}>
                                        <Row>
                                            <Col md={12} sm={24}>
                                                <Card>
                                                    <CardHeader>{this.stringTranslate('Label.Empresas')}</CardHeader>
                                                    <CardBody>
                                                        <Tabs>
                                                            <TabPane tab={this.stringTranslate('Label.Empresas')} key={1}>
                                                                <Tree
                                                                autoExpandParent={true}
                                                                onExpand={(expandedKeys) => this.onExpandTree(expandedKeys, 'expandedELS')}
                                                                expandedKeys={this.state.expandedELS}
                                                                onSelect={(selectedKeys, info) => this.onSelectTree(selectedKeys, info, 'selectedELS')}
                                                                selectedKeys={this.state.selectedELS}
                                                                treeData={this.els}
                                                                />
                                                            </TabPane>
                                                            <TabPane tab={this.stringTranslate('Label.Locais')} key={2}>
                                                                <Tree
                                                                autoExpandParent={true}
                                                                onExpand={(expandedKeys) => this.onExpandTree(expandedKeys, 'expandedLocal')}
                                                                expandedKeys={this.state.expandedLocal}
                                                                onSelect={(selectedKeys, info) => this.onSelectTree(selectedKeys, info, 'selectedLocal')}
                                                                selectedKeys={this.state.selectedLocal}
                                                                treeData={this.locais}
                                                                />
                                                            </TabPane>
                                                        </Tabs>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                            <Col md={12} sm={24}>
                                                <Card>
                                                    <CardHeader>{this.stringTranslate('Label.Usuarios')}</CardHeader>
                                                    <CardBody>
                                                        <Tree 
                                                        checkable
                                                        onCheck={(checkedKeys) => this.onCheckTree(checkedKeys, 'checkedUser')}
                                                        checkedKeys={this.state.checkedUser}
                                                        treeData={this.state.usuarios}
                                                        />
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </TabPane> */}
                                </Tabs>
                            </CardBody>
                        </Card>
                    </Row>
                </div> 
            </>
        );
    }
}

export default injectIntl(PermissaoGerencial);
