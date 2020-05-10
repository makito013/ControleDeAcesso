import React from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Nav,
  Collapse
} from "reactstrap";
import { FormGroup, Label, CustomInput  } from 'reactstrap';
import { postAdonis } from "utils/api";
import InputMask from 'react-input-mask';
import { toast, Slide } from 'react-toastify';
import { injectIntl } from "react-intl";
import { Tree, Skeleton, TreeSelect, Spin } from 'antd';
import { Select, Switch, DatePicker, Empty, Row, Col, Form } from 'antd';
import { Button, Tooltip, Tabs, Table, Input} from 'antd';
import moment from 'moment';
import { element } from "prop-types";

const { Option } = Select;
const { TabPane } = Tabs;
const toastOptions = {
  transition: Slide,
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true
};

function colheFilhosRecursivamente (no, vetor){
    var i = 0;
	while (no.children[i]){
        colheFilhosRecursivamente (no.children[i].props, vetor)
		vetor.push(no.children[i].key);
		i++;
	}
	return;
}

function ModalUsuario(props){

}
           
class PerfisAcesso extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            salvando: false,   
            selectedPerfis: [],
            expandedPerfis: [],
            checkedPerfis: [],
            selectedPermissoes: [],
            expandedPermissoes: [],
            checkedPermissoes: [],
            perfis: [],
            permissoes: [],
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
        postAdonis(body, '/PerfisAcesso/Index').then((data) =>{
            var vetorPf = [], vetorPm = [];
            vetorPf = data.dados.perfis;
            vetorPm = data.dados.permissoes;
            this.setState({perfis: vetorPf, permissoes: vetorPm});
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
        if (tree === 'selectedPerfis' && selectedKeys[0] && selectedKeys[0].split('-').length === 1){
            const index = this.state.perfis.findIndex(element => element.key === selectedKeys[0]);
            this.state['checkedPermissoes'] = this.state.perfis[index].permissoes;
        }
        else{
            this.state['checkedPermissoes'] = [];
        }
        this.state[tree] = selectedKeys;
        this.setState(this.state);
    } 

    onCheckTree(checkedKeys, info, tree){
        if (!this.state.selectedPerfis[0])
            return;
        const index = this.state.perfis.findIndex(element => element.key === this.state.selectedPerfis[0]);
        if (tree === 'checkedPermissoes'){
            var keys = checkedKeys.checked;
            if (!info.checked){     
                //Desmarca os nos filhos quando um pai é desmarcado
                var del = [];
                del.push(info.node.props.eventKey);
                colheFilhosRecursivamente(info.node.props, del);
                keys = keys.filter((element) => {
                    return(del.findIndex((prop) => prop === element) === -1)
                })
            }else{
                //Desmarca pais e filhos que já estão marcados...
                var pos = info.node.props.eventKey.split('-').length-3;
                while (pos > 0){
                    var rad = '';
                    for (var i = 0; i < pos; i++){
                        rad += info.node.props.eventKey.split('-')[i] + '-';
                    }
                    rad += info.node.props.eventKey.split('-')[pos];
                    keys = keys.filter((element) => {
                        return(!(element === (rad + '-0')))})
                    pos--;
                }
                var rad = info.node.props.eventKey.substring(0, info.node.props.eventKey.length-2);
                if (info.node.props.eventKey[info.node.props.eventKey.length-1] === "0"){
                    keys = keys.filter((element) => {
                        return(!(element.indexOf(rad) === 0 && element[rad.length] === "-" || element === info.node.props.eventKey || element === rad))})
                }
                else {
                    keys = keys.filter((element) => {
                        return(!((element.indexOf(rad) === 0 && element[rad.length] === "-" && element[element.length - 1] === "0") || element === info.node.props.eventKey || element === rad))})
                }
                //E remarca junto com os que ainda não estavam marcados
                var add = [];
                var keyAtual = info.node.props.eventKey.split('-');
                if (keyAtual[keyAtual.length - 1] !== "0")
                    add.push(keyAtual.join('-'));
                keyAtual.pop();
                while (keyAtual.length && keyAtual.length > 1){ 
                    add.push(keyAtual.join('-') + '-0');
                    keyAtual.pop();
                }
                colheFilhosRecursivamente(info.node.props, add);
                keys = keys.concat(add);
            }
            this.state.perfis[index].permissoes = keys;
        }
        var aux = this.state.perfis;
        this.state.perfis = [];
        this.state.perfis = aux;
        this.state[tree] = keys;
        this.setState(this.state);
    }

    handleClickSalvar(){
        this.state.salvando = true;
        this.setState({salvando: this.state.salvando});
        const body = {
            cmd: "salvarPerfis",
            token: sessionStorage.getItem('token'),
            perfis: this.state.perfis
        }
        postAdonis(body, '/PerfisAcesso/Salvar').then((data) =>{
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
                            <CardHeader><h4>{this.stringTranslate("Label.Perfis")}</h4></CardHeader>
                            <CardBody>
                                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                    <Col md={12} sm={24}>
                                        <Card>
                                            <CardHeader>{this.stringTranslate('Label.Perfis')}</CardHeader>
                                            <CardBody>
                                                <Tree 
                                                autoExpandParent={true}
                                                onSelect={(selectedKeys, info) => this.onSelectTree(selectedKeys, info, 'selectedPerfis')}
                                                selectedKeys={this.state.selectedPerfis}
                                                treeData={this.state.perfis}
                                                />
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col md={12} sm={24}>
                                        <Card>
                                            <CardHeader>{this.stringTranslate('Label.Permissoes')}</CardHeader>
                                            <CardBody>
                                                <Tree
                                                checkable
                                                checkStrictly
                                                autoExpandParent={true}
                                                onCheck={(checkedKeys, info) => this.onCheckTree(checkedKeys, info, 'checkedPermissoes')}
                                                checkedKeys={this.state.checkedPermissoes}
                                                onExpand={(expandedKeys) => this.onExpandTree(expandedKeys, 'expandedPermissoes')}
                                                expandedKeys={this.state.expandedPermissoes}
                                                onSelect={(selectedKeys, info) => this.onSelectTree(selectedKeys, info, 'selectedPermissoes')}
                                                selectedKeys={this.state.selectedPermissoes}
                                                treeData={this.state.permissoes}
                                                />
                                                <Spin spinning={this.state.salvando} delay={0}>
                                                    <Button block onClick={this.handleClickSalvar}>{this.stringTranslate('Label.Salvar')}</Button>
                                                </Spin>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Row>
                </div> 
            </>
        );
    }
}

export default injectIntl(PerfisAcesso);
