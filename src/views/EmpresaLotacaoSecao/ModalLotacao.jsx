import React from "react";
import {
    Row,
    Col,
    Button, 
    Label,
    Modal,
    ModalHeader,
    ModalBody,
    Input,
    FormGroup,
    ModalFooter,
  } from "reactstrap";
import { injectIntl } from "react-intl";
import { postAdonis } from "utils/api";
import { toast, Slide } from 'react-toastify';
import InputMask from 'react-input-mask';
import { Spin } from "antd";

const toastOptions = {
    transition: Slide,
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true
};

class ModalLotacao extends React.Component{
    constructor(props){
        super(props)
        this.state ={
            modal: false,
            salvando: false,
            empresa: (this.props.tipo !== "add" ? this.props.dados.nomeEmpresa : this.props.dados.Nome),
            nome: (this.props.tipo !== "add" ? this.props.dados.data.nome : null),
            sigla: (this.props.tipo !== "add" ? this.props.dados.data.numeroSigla : null),
            bloco: (this.props.tipo !== "add" ? this.props.dados.data.blocoApto : null),
            publica: null,
            latitude: (this.props.tipo !== "add" ? this.props.dados.data.latitude : null),
            longitude:(this.props.tipo !== "add" ? this.props.dados.data.longitude : null),
            totVagas: (this.props.tipo !== "add" ? this.props.dados.data.numVaga : 0),
            totVagasUso: (this.props.tipo !== "add" ? this.props.dados.totVagasUso : 0),
            modalConfirme: false
        }
        this.icone =  null;
        this.editavel = true;
        this.toggle = this.toggle.bind(this);
        this.tipo = this.props.tipo;

        this.handleChangeNome = this.handleChangeNome.bind(this);
        this.handleChangeSigla = this.handleChangeSigla.bind(this);
        this.handleChangeBloco = this.handleChangeBloco.bind(this);
        this.handleChangeLatitude = this.handleChangeLatitude.bind(this);
        this.handleChangeLongitude = this.handleChangeLongitude.bind(this);
        this.handleChangeTotVagas = this.handleChangeTotVagas.bind(this);
        this.handleChangeTotVagasUso = this.handleChangeTotVagasUso.bind(this);
        this.handleClickSalvar = this.handleClickSalvar.bind(this);
        this.handleClickExcluir = this.handleClickExcluir.bind(this);
        this.stringTranslate = this.stringTranslate.bind(this);
        this.toggleConfirme = this.toggleConfirme.bind(this);
    }

    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }

    handleChangeNome(event){
        this.setState({nome: event.target.value})
    }
    handleChangeSigla(event){
        this.setState({sigla: event.target.value})
    }
    handleChangePublica(event){
        this.setState({publica: event.target.value})
    }
    handleChangeBloco(event){
        this.setState({bloco: event.target.value})
    }
    handleChangeLatitude(event){
        this.setState({latitude: event.target.value})
    }
    handleChangeLongitude(event){
        this.setState({longitude: event.target.value})
    }
    handleChangeTotVagas(event){
        this.setState({totVagas: event.target.value})
    }
    handleChangeTotVagasUso(event){
        this.setState({totVagasUso: event.target.value})
    }

    handleClickExcluir(){
            const body = {
                "cmd": "excluirLotacao",
                "token": sessionStorage.getItem("token"),
                "codigo": this.props.dados.codLotacao,
            }
            postAdonis(body,"/Lotacao/Excluir").then(data => {
                if (data.retorno !== false){          
                    toast.dismiss();
                    toast.success(this.stringTranslate("Sucesso.Lotacao.Excluir"), toastOptions);                        
                    this.props.atualizaTable();
                }else{
                    if(data.error === 1){
                        toast.dismiss();
                        toast.warn(this.stringTranslate("Warning.LotacaoComSecao"), toastOptions);   
                    }
                    else if(data.error === 2){
                        toast.dismiss();
                        toast.warn(this.stringTranslate("Warning.LotacaoNaoEncontrada"), toastOptions);  
                    }
                    else{
                        toast.dismiss();
                        toast.error("Error: "+data.mensagem, toastOptions);    
                    }    
                }
            })
            this.props.toggle();
    }

    handleClickSalvar(){
        this.setState({salvando: true});
        if (this.props.tipo === "add"){
            const body = {
                "cmd": "incluirLotacao",
                "token": sessionStorage.getItem("token"),
                "codLotacao": 0,
                "codEmpresa":this.props.dados.codEmpresa,
                "sigla": this.state.sigla,
                "publica": this.state.publica,
                "nome": this.state.nome,
                "bloco": this.state.bloco,
                "latitude": this.state.latitude,
                "longitude": this.state.longitude,
                "totVagas": this.state.totVagas,
                "totVagasUso":this.state.totVagasUso,
            }

            postAdonis(body,"/Lotacao/Salvar").then(data => {
                if (data.retorno !== false){
                    this.props.atualizaTable();
                    this.props.toggle();
                    toast.dismiss();
                    toast.success(this.stringTranslate("Sucesso.Lotacao.Cadatro"), toastOptions);       
                }else{
                    toast.error("Error: "+data.msg,toastOptions);    
                }
                this.setState({salvando: false});
            })
        }else{
            const body = {
                "cmd": "incluirLotacao",
                "token": sessionStorage.getItem("token"),
                "codLotacao": this.props.dados.codLotacao,
                "codEmpresa":this.props.dados.codEmpresa,
                "sigla": this.state.sigla,
                "publica": this.state.publica,
                "nome": this.state.nome,
                "bloco": this.state.bloco,
                "latitude": this.state.latitude,
                "longitude": this.state.longitude,
                "totVagas": this.state.totVagas,
                "totVagasUso":this.state.totVagasUso,
            }

            postAdonis(body, "/Lotacao/Salvar").then(data => {
                if (data.retorno !== false){
                    this.props.atualizaTable();
                    this.props.toggle();
                    toast.dismiss();
                    toast.success(this.stringTranslate("Sucesso.Lotacao.Editado"), toastOptions);          
                }else{
                    toast.error("Error: "+data.msg, toastOptions);    
                }
                this.setState({salvando: false});
            })
        }
    }

    toggle() {
        this.state.modal = !this.state.modal;
        this.setState(() => ({
            modal: this.state.modal
        }));
    }

    toggleConfirme() {
        if(this.state.modalConfirme === true)
            this.props.toggle();
        
        this.setState({
            modalConfirme: !this.state.modalConfirme,
        });
    }

    render(){
        switch(this.tipo){
            case "add":
                //this.icone = <> <i id={"addSec"+this.props.dados.codEmpresa} onClick={this.toggle} className="tim-icons icon-simple-add" style={{top:"0", paddingLeft: "10px", color:"green", cursor:"pointer"}} />
                                 //<UncontrolledTooltip placement="top" target={"addSec"+this.props.dados.codEmpresa}>{this.stringTranslate("EmpresaLS.Lotacao.add")}</UncontrolledTooltip></>;
                break;
            case "edit":
                //this.icone = <> <i id={"editLot"+this.props.dados.codLotacao} onClick={this.toggle} className="tim-icons icon-pencil" style={{top:"0", paddingLeft: "10px", color:"orange", cursor:"pointer"}} /> 
                                 //<UncontrolledTooltip placement="top" target={"editLot"+this.props.dados.codLotacao}>{this.stringTranslate("EmpresaLS.Lotacao.editar")}</UncontrolledTooltip></>;
                break;
            case "view":
                //this.icone = <> <i id={"viewLot"+this.props.dados.codLotacao} onClick={this.toggle} className="tim-icons icon-zoom-split" style={{top:"0", paddingLeft: "10px", color:"black", cursor:"pointer"}} />
                                 //<UncontrolledTooltip placement="top" target={"viewLot"+this.props.dados.codLotacao}>{this.stringTranslate("EmpresaLS.Lotacao.visualizar")}</UncontrolledTooltip></>;
                this.editavel = false;
                break;
            case "del":
                if(this.state.modalConfirme === false){
                    this.setState({
                        modalConfirme: !this.state.modalConfirme,
                    });
                }
                return (
                    <Modal modalTransition={{timeout:0}} backdropTransition={{timeout:0}} style={{zIndex: 10000}} isOpen={this.state.modalConfirme}>
                        <ModalHeader style={{marginBottom:"0px"}} toggle={() =>this.toggleConfirme()}><h4>{this.stringTranslate("EmpresaLS.Excluir.Lotacao")}</h4></ModalHeader>
                        <ModalBody style={{paddingTop:"0px", paddingBottom:"0px"}}>   
                        {this.stringTranslate("Label.vocetemCerteza")}
                        </ModalBody>
                        <ModalFooter style={{paddingTop: "15px"}}>
                            <Button color="secondary" onClick={() => this.toggleConfirme()}> {this.stringTranslate("Botao.Cancelar")} </Button>
                            <Button color="danger" onClick={() => {this.handleClickExcluir(); this.toggleConfirme()}}>{this.stringTranslate("Botao.Excluir")}</Button>
                        </ModalFooter>
                    </Modal>
                );
            default:
                this.icone = null;
                break;
        }

        if (this.editavel){
            this.footer = <>
            <Row>
                <Col>
                    <Spin spinning={this.state.salvando}>
                        <Button onClick={this.handleClickSalvar} block>{this.stringTranslate("EmpresaLS.Lotacao.salvar")}</Button>
                    </Spin>
                </Col>
                <Col>
                    <Button onClick={this.props.toggle} block>{this.stringTranslate("EmpresaLS.Lotacao.cancelar")}</Button>
                </Col>
            </Row></>;
        }else{
            this.footer = <>
            <Row>
                <Col>
                    <Button onClick={this.props.toggle} block>{this.stringTranslate("EmpresaLS.Lotacao.sair")}</Button>
                </Col>
            </Row>
            </>
        }       

        return(
            <>
                {this.icone}
                <Modal isOpen={this.props.isOpened} style={{minWidth:"75%", top:"-15%"}}>
                    <ModalHeader toggle={this.props.toggle}>
                        <h3>{this.stringTranslate("EmpresaLS.Lotacao.lotacao")}: {this.state.nome}</h3>
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col>
                                <h4>{this.stringTranslate("EmpresaLS.Lotacao.empresa")}: {this.state.empresa}</h4>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={8}>
                                <FormGroup>
                                    <Label>{this.stringTranslate("EmpresaLS.Lotacao.nome")}</Label>
                                    <Input onChange={this.handleChangeNome} value={this.state.nome} type="text" disabled={!this.editavel} />
                                </FormGroup>
                            </Col>
                            <Col xs={4}>
                                <FormGroup>
                                    <Label>{this.stringTranslate("EmpresaLS.Lotacao.sigla")}</Label>
                                    <Input onChange={this.handleChangeSigla} value={this.state.sigla} type="text" disabled={!this.editavel} />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4}>
                                <FormGroup>
                                    <Label>{this.stringTranslate("EmpresaLS.Lotacao.bloco")}</Label>
                                    <Input onChange={this.handleChangeBloco} value={this.state.bloco} type="text" disabled={!this.editavel} />
                                </FormGroup>
                            </Col>
                            <Col xs={4}>
                                <FormGroup>
                                    <Label>{this.stringTranslate("EmpresaLS.Lotacao.latitude")}</Label>
                                    <Input onChange={this.handleChangeLatitude} value={this.state.latitude} type="text" disabled={!this.editavel}
                                     mask="99.9999999999" maskChar={null}
                                     tag={InputMask} />
                                </FormGroup>
                            </Col>
                            <Col xs={4}>
                                <FormGroup>
                                    <Label>{this.stringTranslate("EmpresaLS.Lotacao.longitude")}</Label>
                                    <Input onChange={this.handleChangeLongitude} value={this.state.longitude} type="text" disabled={!this.editavel}
                                     mask="99.9999999999" maskChar={null}
                                     tag={InputMask} />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label>{this.stringTranslate("EmpresaLS.Lotacao.numVagas")}</Label>
                                    <Input onChange={this.handleChangeTotVagas} value={this.state.totVagas} type="text" disabled={!this.editavel} />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label>{this.stringTranslate("EmpresaLS.Lotacao.numVagasUso")}</Label>
                                    <Input onChange={this.handleChangeTotVagasUso} value={this.state.totVagasUso} type="text" disabled={!this.editavel} />
                                </FormGroup>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        {this.footer}
                    </ModalFooter>
                </Modal>
            </>
        )
    }
}

export default injectIntl(ModalLotacao);