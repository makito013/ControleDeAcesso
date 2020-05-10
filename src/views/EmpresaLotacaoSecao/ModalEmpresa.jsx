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
    ModalFooter
  } from "reactstrap";
import { toast, Slide } from 'react-toastify';
import { injectIntl } from "react-intl";
import InputMask from 'react-input-mask';
import { Spin } from "antd";
import { postAdonis } from "utils/api";

function cleanMask(string){
    if (Boolean(string) === true){
        let res = "";
        res = string.replace(/[/]/g, "");
        res = res.replace(/-/g, "");
        res = res.replace(/\./g, "");
        return res; 
    }else{
        return null;
    }
}

const toastOptions = {
    transition: Slide,
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true
  };

class ModalEmpresa extends React.Component{
    constructor(props){
        super(props)
        this.state ={
            salvando: false,
            modal: false,
            modalConfirme: false,
            numero: (this.props.tipo !== "add" ? this.props.dados.Numero : this.props.numEmpresa),
            numeroFolha: (this.props.tipo !== "add" ? this.props.dados.NumeroFolha : 0),
            cnae: (this.props.tipo !== "add" ? this.props.dados.Cnae: null),
            nome: (this.props.tipo !== "add" ? this.props.dados.data.nome : null),
            cnpj:(this.props.tipo !== "add" ? this.props.dados.CNPJ : null),
            cei: (this.props.tipo !== "add" ? this.props.dados.CEI : null),
            endereco: (this.props.tipo !== "add" ? this.props.dados.Endereco : null),
            dataInicioMes: (this.props.tipo !== "add" ? this.props.dados.DiaInicioMes : null),
            dataFimMes: (this.props.tipo !== "add" ? this.props.dados.DiaFimMes : null),
            numeroVagas: (this.props.tipo !== "add" ? this.props.dados.data.numVaga : null),
            codEmpresa: (this.props.tipo !== "add" ? this.props.dados.codEmpresa : null),
        }
        this.numero =0;
        this.toggle = this.toggle.bind(this);
        this.handleChangeNome = this.handleChangeNome.bind(this);
        this.handleChangeNumero = this.handleChangeNumero.bind(this);
        this.handleChangeNumeroFolha = this.handleChangeNumeroFolha.bind(this);
        this.handleChangeNumeroVagas = this.handleChangeNumeroVagas.bind(this);
        this.handleChangeCnae = this.handleChangeCnae.bind(this);
        this.handleChangeCnpj = this.handleChangeCnpj.bind(this);
        this.handleChangeCei = this.handleChangeCei.bind(this);
        this.handleChangeDataInicioMes = this.handleChangeDataInicioMes.bind(this);
        this.handleChangeDataFimMes = this.handleChangeDataFimMes.bind(this);
        this.handleChangeEndereco = this.handleChangeEndereco.bind(this);
        this.handleClickSalvar = this.handleClickSalvar.bind(this);
        this.handleClickExcluir = this.handleClickExcluir.bind(this);
        this.stringTranslate = this.stringTranslate.bind(this);
        this.toggleConfirme = this.toggleConfirme.bind(this);
        
        this.icone = null;
        this.footer = null;
        this.editavel = true;
        this.tipo = this.props.tipo;


        this.listaErros = [
            this.stringTranslate("Empresa.erro.0"),
            this.stringTranslate("Empresa.erro.1"),
            this.stringTranslate("Empresa.erro.2"),
        ]
    }



    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }

    handleChangeNome(event){
        this.setState({nome: event.target.value});
    }

    handleChangeNumero(event){
       this.state.numero = event.target.value;
       this.numero = this.state.numero;
        this.setState({numero: this.state.numero});
    }

    handleChangeNumeroFolha(event){
        this.setState({numeroFolha: event.target.value});
    }
    handleChangeCnae(event){
        this.setState({cnae: event.target.value});
    }
    handleChangeCnpj(event){
        this.setState({cnpj: event.target.value});
    }
    handleChangeCei(event){
        this.setState({cei: event.target.value});
    }
    handleChangeEndereco(event){
        this.setState({endereco: event.target.value});
    }
    handleChangeDataInicioMes(event){
        this.setState({dataInicioMes: event.target.value});
    }
    handleChangeDataFimMes(event){
        this.setState({dataFimMes: event.target.value});
    }
    handleChangeNumeroVagas(event){
        this.setState({numeroVagas: event.target.value});
    }

    handleClickExcluir(){
        if (this.props.tipo === "del"){
            const body = {
                "cmd": "excluirEmpresa",
                "token": sessionStorage.getItem("token"),
                "codigo": this.props.dados.codEmpresa,
            }
            postAdonis(body, "/Empresa/Excluir").then(data => {
                if (data.retorno !== false){
                    toast.dismiss();
                    toast.success(this.stringTranslate("Sucesso.Empresa.Excluir"), toastOptions )
                    this.props.atualizaTable();
                }else{
                    if(data.error === 1){
                        toast.dismiss();
                        toast.warn(this.stringTranslate("Warning.EmpresaComLotacao"), toastOptions);   
                    }
                    else{
                        toast.dismiss();
                        toast.error("Error: "+data.mensagem, toastOptions);    
                    }
                }
            })
        }
        this.props.toggle();
    }
    

    handleClickSalvar(){
       // this.setState({salvando: true})
        if (this.props.tipo === "add"){
            const body = {
                "cmd": "IncluirEmpresa",
                "token": sessionStorage.getItem("token"),
                "codigo": 0,
                "numero": this.state.numero,
                "numeroFolha": this.state.numeroFolha,
                "cnae": cleanMask(this.state.cnae),
                "nome": this.state.nome,
                "cnpj": cleanMask(this.state.cnpj),
                "cei": cleanMask(this.state.cei),
                "endereco": this.state.endereco,
                "dataInicioMes": this.state.dataInicioMes,
                "dataFimMes": this.state.dataFimMes,
                "numeroVagas": this.state.numeroVagas,
            }
            postAdonis(body, "/Empresa/Salvar").then(data => {
                if(data.retorno !== false){
                    this.props.atualizaTable();
                    this.props.toggle();
                    toast.dismiss();
                    toast.success(this.stringTranslate("Sucesso.Empresa.Cadatro"), toastOptions )   
                }else{
                    toast.dismiss()
                    toast.error("Error: "+data.msg, toastOptions);    
                }
                this.setState({salvando: false});
            })
        }else{
            const body = {
                "cmd": "IncluirEmpresa",
                "token": sessionStorage.getItem("token"),
                "codigo": this.state.codEmpresa,
                "numero": this.state.numero,
                "numeroFolha": this.state.numeroFolha,
                "cnae": cleanMask(this.state.cnae),
                "nome": this.state.nome,
                "cnpj": cleanMask(this.state.cnpj),
                "cei": cleanMask(this.state.cei),
                "endereco": this.state.endereco,
                "dataInicioMes": this.state.dataInicioMes,
                "dataFimMes": this.state.dataFimMes,
                "numeroVagas": this.state.numeroVagas,
            }
            postAdonis(body,"/Empresa/Salvar").then(data => {
                if (data.retorno !== false){
                    this.props.atualizaTable();
                    this.props.toggle();
                    toast.dismiss();
                    toast.success(this.stringTranslate("Sucesso.Empresa.Editado"), toastOptions ) 
                }else{
                    toast.dismiss()
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

    componentWillUpdate(){
        // if(this.tipo === "add" && this.state.numero !== this.props.numEmpresa)
        //     this.setState({numero: this.props.numEmpresa});
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
                //this.icone = <> <Button onClick={this.toggle} style={{float:"right"}}>{this.stringTranslate("EmpresaLS.Empresa.add")}</Button></>;
                break;
            case "edit":
                //this.icone = <> <i id={"editEmp"+this.props.dados.codEmpresa} onClick={this.toggle} className="tim-icons icon-pencil" style={{top:"0", paddingLeft: "10px", color:"orange", cursor:"pointer"}} /> 
                                // <UncontrolledTooltip placement="top" target={"editEmp"+this.props.dados.codEmpresa}>{this.stringTranslate("EmpresaLS.Empresa.editar")}</UncontrolledTooltip></>;
                break;
            case "view":
                //this.icone = <> <i id={"viewEmp"+this.props.dados.codEmpresa} onClick={this.toggle} className="far fa-eye" style={{top:"0", paddingLeft: "10px", color:"black", cursor:"pointer"}} />
                                 //<UncontrolledTooltip placement="top" target={"viewEmp"+this.props.dados.codEmpresa}>{this.stringTranslate("EmpresaLS.Empresa.visualizar")}</UncontrolledTooltip></>;
                this.editavel = false;
                break;
            case "del":
                //this.icone = <> <i id={"delEmp"+this.props.dados.codEmpresa} onClick={this.handleClickExcluir} className="tim-icons icon-trash-simple" style={{top:"0", paddingLeft: "10px", color:"red", cursor:"pointer"}} />
                                //<UncontrolledTooltip placement="top" target={"delEmp"+this.props.dados.codEmpresa}>{this.stringTranslate("EmpresaLS.Empresa.deletar")}</UncontrolledTooltip></>;
                if(this.state.modalConfirme === false){
                    this.setState({
                        modalConfirme: !this.state.modalConfirme,
                    });
                }
                return (
                    <Modal modalTransition={{timeout:0}} backdropTransition={{timeout:0}} style={{zIndex: 10000}} isOpen={this.state.modalConfirme}>
                        <ModalHeader style={{marginBottom:"0px"}} toggle={() =>this.toggleConfirme()}><h4>{this.stringTranslate("EmpresaLS.Excluir.Empresa")}</h4></ModalHeader>
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
                        <Button onClick={this.handleClickSalvar} block>{this.stringTranslate("EmpresaLS.Empresa.salvar")}</Button>
                    </Spin>
                </Col>
                <Col>
                    <Button onClick={this.props.toggle} block>{this.stringTranslate("EmpresaLS.Empresa.cancelar")}</Button>
                </Col>
            </Row></>;
        }else{
            this.footer = <>
            <Row>
                <Col>
                    <Button onClick={this.props.toggle} block>{this.stringTranslate("EmpresaLS.Empresa.sair")}</Button>
                </Col>
            </Row>
            </>
        }

        return(
            <>                                
                <Modal isOpen={this.props.isOpened} style={{minWidth:"75%", top:"-15%"}}>
                    <ModalHeader toggle={this.props.toggle}>
                        <h3>{this.stringTranslate("EmpresaLS.Empresa.empresa")}:</h3>
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label>{this.stringTranslate("EmpresaLS.Empresa.numero")}</Label>
                                        <Input onChange={e => this.handleChangeNumero(e)} value={this.state.numero} type="text" disabled={!this.editavel}
                                        mask="9999999999999999999" maskChar={null}
                                        tag={InputMask} />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label>{this.stringTranslate("EmpresaLS.Empresa.numeroFolha")}</Label>
                                    <Input onChange={this.handleChangeNumeroFolha} value={this.state.numeroFolha} type="text" disabled={!this.editavel}
                                    mask="9999999999999999999" maskChar={null}
                                    tag={InputMask} />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label>{this.stringTranslate("EmpresaLS.Empresa.CNAE")}</Label>
                                    <Input onChange={this.handleChangeCnae} value={this.state.cnae} type="text" disabled={!this.editavel} 
                                    mask="99.99-9/99" maskChar={null}
                                    tag={InputMask}/>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label>{this.stringTranslate("EmpresaLS.Empresa.nome")}</Label>
                                    <Input onChange={this.handleChangeNome} value={this.state.nome} type="text" disabled={!this.editavel} />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label>{this.stringTranslate("EmpresaLS.Empresa.CNPJ")}:</Label>
                                    <Input onChange={this.handleChangeCnpj} value={this.state.cnpj} type="text" disabled={!this.editavel}
                                    mask="99.999.999/9999-99" maskChar={null}
                                    tag={InputMask} />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label>{this.stringTranslate("EmpresaLS.Empresa.CEI")}:</Label>
                                    <Input onChange={this.handleChangeCei} value={this.state.cei} type="text" disabled={!this.editavel} 
                                    mask="99.999.99999/99" maskChar={null}
                                    tag={InputMask}/>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label>{this.stringTranslate("EmpresaLS.Empresa.endereco")}</Label>
                                    <Input onChange={this.handleChangeEndereco} value={this.state.endereco} type="text" disabled={!this.editavel} />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label>{this.stringTranslate("EmpresaLS.Empresa.diaInicioMes")}</Label>
                                    <Input onChange={this.handleChangeDataInicioMes} value={this.state.dataInicioMes} type="text" disabled={!this.editavel} />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label>{this.stringTranslate("EmpresaLS.Empresa.diaFimMes")}</Label>
                                    <Input onChange={this.handleChangeDataFimMes} value={this.state.dataFimMes} type="text" disabled={!this.editavel} />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label>{this.stringTranslate("EmpresaLS.Empresa.numVagas")}</Label>
                                    <Input onChange={this.handleChangeNumeroVagas} value={this.state.numeroVagas} type="text" disabled={!this.editavel} />
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

export default injectIntl(ModalEmpresa);