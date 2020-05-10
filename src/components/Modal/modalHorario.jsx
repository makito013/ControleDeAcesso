import React from "react";
import {
    Modal,
    ModalHeader,
    ModalBody,
    Table,
    ModalFooter
} from "reactstrap";

import { postAdonis } from "utils/api.js";
import { toast, Slide  } from 'react-toastify';
import { injectIntl } from "react-intl";
import { Tooltip, Button, Icon, TimePicker, Spin } from "antd";
import moment from "moment"

const toastOptions = {
    transition: Slide,
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true
};



class ModalHorario extends React.Component{
    constructor(props) {
        super(props); 

        this.state = {
            modal: false,
            tipo: "",
            loadingSave: false,
        };

        //traduz strings  
        this.totalHorario = 0;   
        this.horariosEntrada = [];
        this.horariosSaida = [];           
        this.handleChange = this.handleChange.bind(this);
        this.addHorario = this.addHorario.bind(this);
        this.removeHorario = this.removeHorario.bind(this);
        this.stringTranslate = this.stringTranslate.bind(this);
        this.postNovoHorario = this.postNovoHorario.bind(this);
        if(this.props.statusModal === "Novo")
        {
            this.horariosEntrada[0] =  this.horariosSaida[0] = moment('00:00', "HH:mm");
        }
        else if(this.props.statusModal === "Editar" || this.props.statusModal === "Copiar" || this.props.statusModal === "Ver") 
        {
            var array = props.data.split('/');
            var x = 0;
            var entrada = [];
            var saida = [];
            for(var i = 0; i < array.length; i = i+2){
                entrada[x] = moment(array[i], "hh:mm");
                saida[x] = moment(array[i+1], "hh:mm");
                x++;
            }            
            this.horariosEntrada = entrada;
            this.horariosSaida = saida
            this.totalHorario = x-1;
            //this.setState({horariosEntrada: entrada, horariosSaida: saida, totalHorario: x})           
        }       
    }

    timeToInt(horario){
        var valor = horario.hours()*100 + horario.minutes();
        return valor;
    }

    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }

    handleChange(event, key, index){        
        if(index === "entrada"){
            var valor = this.horariosEntrada;
            valor[key] = event;
        }
        else if(index === "saida"){
            var valor2 = this.horariosSaida;
            valor2[key] = event;   
        }
    }

    validaInformacaoHorarios(){
        var periodos = "";
        
        return periodos;
    }

    postNovoHorario(){     
        var periodos = "";

        for(var i = 0; i <= this.totalHorario; i++){
            if(this.horariosEntrada[i] !== undefined && this.horariosEntrada[i] !== "" && this.horariosEntrada[i] !== null){
                if(i > 0 && this.timeToInt(this.horariosEntrada[i]) <= this.timeToInt(this.horariosSaida[i-1])){
                    toast.dismiss();
                    toast.warning(this.stringTranslate("Label.Saida") + " " + (i+1) + " " + 
                        this.stringTranslate("Label.MaiorQue") + " " +
                        this.stringTranslate("Label.Entrada") + " " + (i), 
                        toastOptions);
                    return 0;
                }

                if(this.timeToInt(this.horariosEntrada[i]) >= this.timeToInt(this.horariosSaida[i])){
                    toast.dismiss();
                    toast.warning(this.stringTranslate("Warning.HorarioIgualOuMaior") + (i+1), toastOptions);
                    return 0;
                }
                
                periodos += this.horariosEntrada[i].format("HH:mm") + "/" + this.horariosSaida[i].format("HH:mm");

                if(i < this.totalHorario)
                    periodos += "/";
            }
            else{
                toast.dismiss();
                toast.warning(this.stringTranslate("Warning.CampoVazio"), toastOptions);
                return 0;
            }
        }
        
        const body={
            Periodos: periodos,
            NumPeriodos: this.totalHorario + 1,
            token: sessionStorage.getItem("token"),
            codigo: this.props.codigo,
        }

        postAdonis(body,"/Horario/Salvar").then(lista =>{
            if(lista.error === undefined)
            {
                if(lista.retorno === true){
                    var mensagem = this.props.statusModal === "Editar" ? this.stringTranslate("Horario.Sucesso.EditarHorario") : this.props.statusModal === "Novo" ? this.stringTranslate("Horario.Sucesso.NovoHorario") : this.stringTranslate("Horario.Sucesso.CopiadoHorario");
                    toast.dismiss();
                    toast.success(mensagem, toastOptions);
                }
                this.props.onclick("sucesso", "", "");
            }
            else
            {
                toast.dismiss();
                toast.error(this.stringTranslate("Horario.Erro.Servidor"), toastOptions);
            }
            
        });
    }

    addHorario(key){
        if(this.horariosEntrada[key] !== "" && this.horariosSaida[key] !== "" && this.totalHorario < 4)
        {
            this.totalHorario++;
            this.horariosEntrada[key+1] = moment('00:00', "HH:mm");
            this.horariosSaida[key+1] = moment('00:00', "HH:mm");
            this.setState({true:true});
        }
    }

    removeHorario(key){            
        this.totalHorario--;
        this.horariosEntrada.splice(key, 1);
        this.horariosSaida.splice(key, 1);
        this.setState({true:true});
    }


    render(){        
        return(
        <>         
            <Modal modalTransition={{timeout:0}} backdropTransition={{timeout:0}}  isOpen={this.props.modal} style={{width:"400px"}}>
            <ModalHeader toggle={() =>this.props.onclick("")}><h4>{this.stringTranslate("Horario.Botao."+this.props.statusModal)} {this.stringTranslate("Horario.Titulo")} </h4></ModalHeader>
                <ModalBody>   
                {this.props.statusModal === "Ver" ? (
                    <Table size="sm">
                        <thead>
                            <tr>
                                <th style={{textAlign:"center"}}>#</th>
                                <th style={{textAlign:"center"}}>{this.stringTranslate("Horario.Tabela.Entrada")}</th>
                                <th style={{textAlign:"center"}}>{this.stringTranslate("Horario.Tabela.Saida")}</th>                            
                            </tr>
                        </thead>
                        <tbody>
                            {this.horariosEntrada.map((prop, key) => {
                            return (
                                <tr>
                                    <th scope="row" style={{textAlign:"center"}}>{key+1}</th>
                                    <td style={{textAlign:"center"}}>{this.horariosEntrada[key]._i}</td>
                                    <td style={{textAlign:"center"}}>{this.horariosSaida[key]._i}</td>                                
                                </tr>
                                );
                            })}                                                
                        </tbody>
                    </Table>
                    ) : (
                    <>
                    <Table size="sm">
                        <thead>
                            <tr style={{textAlign:"center"}}>
                                <th>#</th>
                                <th style={{textAlign:"center"}}>{this.stringTranslate("Horario.Tabela.Entrada")}</th>
                                <th style={{textAlign:"center"}}>{this.stringTranslate("Horario.Tabela.Saida")}</th>                            
                            </tr>
                        </thead>
                        <tbody>        
                            {this.horariosEntrada.map((prop, key) => {
                            return (<>
                                <tr style={{border: "none"}} >
                                    <th scope="row" style={{textAlign:"center", border: "none"}}>{key+1}</th>
                                    <td style={{border: "none"}}>
                                        <TimePicker defaultValue={this.horariosEntrada[key]} onChange={(event) => this.handleChange(event, key, "entrada")}
                                        format={"HH:mm"} style={{width: "100%"}} allowClear={false}
                                        />                                        
                                    </td>
                                    <td style={{border: "none"}}>
                                        <TimePicker defaultValue={this.horariosSaida[key]} onChange={(event) => this.handleChange(event, key, "saida")}
                                        format={"HH:mm"} style={{width: "100%"}} allowClear={false}
                                        />   
                                    </td>   
                                    {this.totalHorario === 0 ? ( null
                                    ) : (                                                                             
                                    <tr style={{border: "none"}}><Tooltip placement="right" title="Excluir horário" overlayStyle={{fontSize: "12px"}}>                                      
                                        <Icon
                                        className="dynamic-delete-button"
                                        type="minus-circle"
                                        style={{ fontSize: '18px', marginTop: "10px", color: '#e24e42' }} theme="outlined"                                          
                                        onClick={() => this.removeHorario(key)}/>
                                        </Tooltip>
                                    </tr>
                                    )}                                                                        
                                </tr>                                
                                </>
                                );
                            })}
                            {this.horariosEntrada.length === 0 ? (<> <tr>
                                    <th scope="row" style={{textAlign:"center"}}>1</th>
                                    <td style={{border: "none"}}>
                                        <TimePicker defaultValue={this.horariosEntrada[0]} onChange={(event) => this.handleChange(event, 0, "entrada")}
                                        format={"HH:mm"} style={{width: "100%"}} allowClear={false}
                                        />                                        
                                    </td>
                                    <td style={{border: "none"}}>
                                        <TimePicker defaultValue={this.horariosSaida[0]} onChange={(event) => this.handleChange(event, 0, "saida")}
                                        format={"HH:mm"} style={{width: "100%"}} allowClear={false}
                                        />   
                                    </td>                                                                        
                                </tr>
                                </>) : null}                      
                        </tbody>                                              
                    </Table>
                    {this.totalHorario < 4? ( 
                    <Table>
                        <tbody>
                        <tr>                         
                        <td style={{border: "none"}}><Button onClick={() => this.addHorario(this.totalHorario)}  type="dashed" size="sm" block> {this.stringTranslate("Horario.Tabela.NovoHorario")} </Button></td>
                        </tr>
                        </tbody>  
                    </Table>
                    ) : (null
                        )}
                    </>
                )}
                </ModalBody>
                <ModalFooter>
                {this.props.statusModal === "Ver" ? (<Button color="secondary" onClick={() => this.props.onclick("")}> {this.stringTranslate("Botao.Voltar")} </Button>) : (
                    <>
                         <Spin spinning={this.state.loadingSave}><Button type="default" onClick={() => this.props.onclick("")}> {this.stringTranslate("Botao.Cancelar")} </Button></Spin>
                        <Spin spinning={this.state.loadingSave}><Button type="primary" onClick={() => this.postNovoHorario()}> {this.stringTranslate("Botao.Gravar")} </Button></Spin>
                    </>
                )}
                </ModalFooter>
            </Modal>
        </>
        );

    };
}
export default injectIntl(ModalHorario);