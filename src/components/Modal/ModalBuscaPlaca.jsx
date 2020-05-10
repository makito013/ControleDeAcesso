import React from "react";
import {
    Button, 
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Table,
  } from "reactstrap";

  import { post } from "../../utils/api.js";
  import { toast, Slide  } from 'react-toastify';
  import { injectIntl } from "react-intl";



  class ModalBuscaPlaca extends React.Component{
    constructor(props) {
        super(props); 
        this.data = new Date();
        this.state = {
            modal: false,
            achou: false,
            info: [],
        };

        this.toggle = this.toggle.bind(this);
        this.handleSendPlaca = this.handleSendPlaca.bind(this);
        this.handleConfirmaAcesso = this.handleConfirmaAcesso.bind(this);
    
        //traduz strings
        this.stringTranslate = this.stringTranslate.bind(this);
    }

    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }
    
    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    handleSendPlaca(){
    if(document.getElementById("entrada").value.length < 6){
        toast.warn(this.stringTranslate("Monitor.modalPlaca.toast.minCaracter"), {
        transition: Slide,
        position: "top-center", 
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        });
        return;
    }

    const body={
        cmd: "procuraplaca",
        placa: this.props.placa,
        token: sessionStorage.getItem("token")
    };
    post(body).then(data => {
        const dados= data;
        console.log(dados);
        this.setState(() =>({
            achou: dados.retorno,
            
        }))

        if (this.state.achou){
            
            this.setState(() =>({
                info: [dados.dados.nomePessoa, dados.dados.AcessoExtra.NumAcompanhantes, dados.dados.AcessoExtra.PlacaCarro, dados.dados.AcessoExtra.ModeloCarro, dados.dados.CodPessoa],
            }))
            console.log(this.state.info[4]);
        }
        else
        {
            toast.warn(this.stringTranslate("Monitor.modalPlaca.toast.veiculoNaoEncontrado"), {
                position: "top-center",
                transition: Slide,
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
            });
        }
    })
    };

    handleConfirmaAcesso(){
        const placa = this.state.info[2];
        const body={
            cmd: "confirmaracessoplaca",
            placa: placa,
            codcoletor: "9",
            codpessoa: this.state.info[4],
            token: sessionStorage.getItem("token"),
        };
        post(body).then(data => {
            const dados = data;
            if (dados.retorno === true){
                this.toggle();
                toast.success(this.stringTranslate("Monitor.modalPlaca.toast.acessoPermitido"), {
                    position: "top-center",
                    transition: Slide,
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                });
            }else{
                this.toggle();
                toast.error(this.stringTranslate("Monitor.modalPlaca.toast.acessoNegado"), {
                    position: "top-center",
                    transition: Slide,
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                });
            }
        });
    }

    render(){
        let conteudo;
        if (this.state.achou === true){
            conteudo = 
            <>
                <ModalHeader toggle={onclick}>{this.data.getDate()+"/"+this.data.getMonth()+"/"+this.data.getFullYear()}</ModalHeader>
                <ModalBody>
                    <Table size="sm">
                        {this.state.info[0] !== undefined ? (
                        <tr>
                            <th scope="row">{this.stringTranslate("Monitor.modalPlaca.nomePessoa")}</th>
                            <td>{this.state.info[0]}</td>
                        </tr>) : null}

                        {this.state.info[1] !== undefined ? (
                        <tr>
                            <th scope="row">{this.stringTranslate("Monitor.modalPlaca.numAcompanhantes")}</th>
                            <td>{this.state.info[1]}</td>
                        </tr>) : null}

                        {this.state.info[2] !== undefined ? (
                        <tr>
                            <th scope="row">{this.stringTranslate("Monitor.modalPlaca.placaCarro")}</th>
                            <td>{this.state.info[2]}</td>
                        </tr>) : null}

                        {this.state.info[3] !== undefined ? (
                        <tr>
                            <th scope="row">{this.stringTranslate("Monitor.modalPlaca.modeloCarro")}</th>
                            <td>{this.state.info[3]}</td>
                        </tr>) : null}

                        {/*///////Última linha///////*/}
                    </Table>
                </ModalBody>
                <ModalFooter>
                    <Button color='primary' onClick={this.handleConfirmaAcesso}>{this.stringTranslate("Monitor.modalPlaca.botao.confirmarAcesso")}</Button>{' '}
                    <Button color='secondary' onClick={this.toggle}>{this.stringTranslate("Monitor.modalPlaca.botao.cancelar")}</Button>
                </ModalFooter>
            </>
        }
        return(
            <>
                <Button
                href="#"
                style={{marginTop:"-2px"}}
                onClick={this.handleSendPlaca}
                block
                className="btn-fill"
                color="info"
                
                >
                    {this.stringTranslate("Monitor.card.botaoBuscar")}
                </Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} style={{minWidth:"50%"}}>
                    {conteudo}
                </Modal>
            </>
        );
    };
  }
  export default injectIntl(ModalBuscaPlaca);