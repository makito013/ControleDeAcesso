import React from "react";
import {
    Button, 
    Modal,
    ModalHeader,
    ModalBody,
    Input,
    Table,
    ModalFooter,
    FormGroup,
    Label,
    Form,
    CustomInput,
    InputGroup,
    InputGroupAddon,
    InputGroupText
} from "reactstrap";
import { Spin } from 'antd';
import { postAdonis } from "utils/api.js";
import { toast, Slide  } from 'react-toastify';
import { injectIntl } from "react-intl";

const toastOptions = {
    transition: Slide,
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true
};



class ModalJornada extends React.Component{
    constructor(props) {
        super(props); 

        this.state = {
            modal: false,
            tipo: "",
            passos: 0,
            dados: [],
            mesmoHorario: true,
            dias: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
            dadosPeriodos: [],                         
            nome: "",
            idJornada: 0,
            loadingSave: false,
        };
        this.informacoes = [0,0,0,0,0,0,0];
        this.informacaoCompleta = [0,0,0,0,0,0,0]; 
        this.montaTabela = this.montaTabela.bind(this);
        this.contador = 0;
        this.state.dados["qDias"] = 7;
        this.state.dados["mesmoHorario"] = "Sim";
        this.totalDePassos = 3;
        //traduz strings                
        this.handleChange = this.handleChange.bind(this);
        this.stringTranslate = this.stringTranslate.bind(this);
        this.onclick = this.onclick.bind(this);
        this.onChange = this.onChange.bind(this);    
        this.postGravarJornada = this.postGravarJornada.bind(this);

        if(this.props.statusModal !== "Novo")
        {
            this.state.nome = this.props.data.Nome;
            this.state.idJornada = this.props.data.CodJornada;

            this.props.data.LinhaJornada.map((prop,key) => {
                if(prop.pivot.Dia < 8){
                    if(prop.pivot.tipoDia === 5){                        
                        this.informacaoCompleta[prop.pivot.Dia-1] = 0;
                        this.informacoes[prop.pivot.Dia-1] = 0;
                    }
                    else{
                        this.informacoes[prop.pivot.Dia-1] = prop.CodHorario;
                        this.informacaoCompleta[prop.pivot.Dia-1] = prop;
                    }
                        
                }
                return null
            });
        }
        
        // Monta Options
        this.options = this.props.horarios.map((prop) => {                                           
            this.state.dadosPeriodos[prop.CodHorario] = prop.Periodos;
            return (<option value={prop.CodHorario}>{prop.Periodos}</option>)
        })        
    }

    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }


    onclick(comando, codigo){        
        if(comando === "avancar"){
            if(this.state.passos === 2){
                if(this.state.nome.length < 5){
                    toast.dismiss();
                    toast.warn("O nome tem que ter pelo menos 5 digitos!", toastOptions);
                }                            
                else
                    this.setState({passos: this.state.passos+1})
            }
            else
                this.setState({passos: this.state.passos+1})
        }
        
        else if(comando === "voltar")
            this.setState({passos: this.state.passos-1});
        else if(comando === "gravar") {
            if(this.props.statusModal === "Copiar" && this.state.nome === this.props.data.Nome)
            {
                toast.dismiss();
                toast.warn(this.stringTranslate("Jornada.Erro.NomeDuplicado"), toastOptions);
                return;
            }
            else{
                this.postGravarJornada(codigo);
            }
        }    
    }

    onChange(e){     
        this.state.dados[e.target.name] = e.target.value;
        this.setState({dados : this.state.dados});
    }

    handleChange(e){
        if(e.target.name === "todos")
        {            
            for(var i = 0; i < this.state.dias.length; i++){                
                this.informacoes[i] = parseInt(e.target.value);  
            }
        }
        else if(e.target.name === "nome")
        {
            this.setState({nome: e.target.value})
        }
        else
        {            
            this.informacoes[e.target.name] = parseInt(e.target.value);            
        }
    }


    async postGravarJornada(codigo){
        this.setState({loadingSave: true});
        const body={
            cmd:"IncluirJornada",
            codigo:codigo,
            nome: this.state.nome,
            listadeHorarios: this.informacoes,
            token: sessionStorage.getItem("token"),
        }
    
        postAdonis(body,"/Jornada/Salvar").then(lista =>{
            
            if(lista.error === undefined)
            {
                this.setState({loadingSave: false});
                toast.dismiss();
                toast.success(this.stringTranslate("Sucesso.JornadaSalva"), toastOptions);
                this.props.onclick("sucesso")
            }
            else
            {   
                this.setState({loadingSave: false});
                toast.dismiss();
                toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);                
            }
        }).catch((error) => {
            this.setState({loadingSave: false});
            toast.dismiss();
            toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
        })
    }


    montaTabela(){
        var gambirra = [0,0,0,0,0,0,0];
        var statusModal = this.props.statusModal;
        var retorno = gambirra.map((x, key) => {

            if(statusModal !== "Ver")
            {
            return(<tr style={{border: "none"}}>
                <th scope="row" style={{textAlign:"center"}}>{key+1}</th>
                <td>{this.state.dias[key]}</td>
                <td>
                <CustomInput style={{color:"#000", border: "none", boxShadow:"none"}} type="select" onChange={(e) => this.handleChange(e)} name={key} defaultValue={this.informacoes[key]}>
                    <option value={0}>{this.stringTranslate("Jornada.Selecao.SemAcesso")}</option>
                    {this.options}
                </CustomInput >
                </td>                                                                                    
                </tr>
            )  
            }else{
                var linhajornada = this.informacaoCompleta[key];
                var tipoDia;
                if(linhajornada === 0) tipoDia = 5;   
                else tipoDia = linhajornada.pivot.tipoDia           
                return(
                <tr style={{border: "none"}} >
                    <th scope="row" style={{textAlign:"center"}}>{key+1}</th>
                    <td>{this.state.dias[key]}</td>                            
                    <td>{tipoDia !== 5 ?  linhajornada.Periodos : "Sem Acesso" }</td>
                </tr>)
            }          
        })
        return retorno;
    }


    render(){    
        if(this.props.statusModal === "Novo")  
        {
            return(
                <Modal modalTransition={{timeout:0}} backdropTransition={{timeout:0}}  isOpen={this.props.modal} style={{minHeight:"60%"}}>
                <ModalHeader toggle={() =>this.props.onclick("")}><h4>{this.stringTranslate("Jornada.Cadastro.AssitenteTitulo")}</h4></ModalHeader>
                    <ModalBody>   
                        {this.state.passos === 0 ? (
                            ///// PASSO 0
                            <>                               
                                <Form inline>
                                    <FormGroup>
                                        <Label for="mesmoHorario" style={{marginRight: "10px"}}>{this.stringTranslate("Jornada.Selecao.MesmoHorario")}</Label>
                                        <Input type="select" style={{padding: "0px"}} name="mesmoHorario" id="mesmoHorario" value={this.state.dados["mesmoHorario"]} onChange={e => this.onChange(e)} bsSize="sm"> 
                                            <option selected>{this.stringTranslate("Selecao.Sim")}</option>
                                            <option>{this.stringTranslate("Selecao.Nao")}</option>
                                        </Input>
                                    </FormGroup>                                
                                </Form>
                            </>
                        ): this.state.passos === 1 ? ( 
                            <>
                            {this.state.dados["mesmoHorario"] === "Sim" ? ( 
                                <FormGroup>
                                    <Label for="mesmoHorario" style={{marginRight: "10px"}}>{this.stringTranslate("Jornada.Selecao.SelecioneHorario")}</Label>
                                    <td>
                                        <CustomInput style={{color:"#000"}} type="select" onChange={(e) => this.handleChange(e)} name="todos" defaultValue={this.informacoes[0]}>
                                            <option value={0}>{this.stringTranslate("Jornada.Selecao.SemAcesso")}</option>
                                            {this.options}
                                        </CustomInput >
                                        </td>   
                                </FormGroup> 
                            ) : (                                
                            <>
                            <Label for="mesmoHorario" style={{marginRight: "10px"}}>{this.stringTranslate("Jornada.Selecao.SelecioneHorarios")}</Label>
                            <Table size="sm">
                                <thead>
                                    <tr style={{textAlign:"center"}}>
                                        <th>#</th>
                                        <th>{this.stringTranslate("Jornada.Tabela.Dias")}</th>
                                        <th>{this.stringTranslate("Jornada.Tabela.Horarios")}</th>                            
                                    </tr>
                                </thead>
                                <tbody>
                                {this.state.dias.map((prop, key) => {                                    
                                return (
                                    <tr style={{border: "none"}} >
                                        <th scope="row" style={{textAlign:"center"}}>{key+1}</th>
                                        <td>{prop}</td>
                                        <td>
                                        <CustomInput style={{color:"#000", border: "none", boxShadow:"none"}} type="select" onChange={(e) => this.handleChange(e)} name={key} defaultValue={this.informacoes[key]}>
                                            <option value={0}>{this.stringTranslate("Jornada.Selecao.SemAcesso")}</option>
                                            {this.options}
                                        </CustomInput >
                                        </td>                                                                                    
                                    </tr>
                                    );
                                })}
                                </tbody>
                                </Table>
                            </>
                            )}
                            </>
                            ) : this.state.passos === 2 ? (
                                <>
                                    <Label for="nome" style={{marginRight: "10px"}}>{this.stringTranslate("Jornada.Novo.Nome")}</Label>     
                                    <Input type="text" style={{paddingLeft: "10px"}} name="nome" id="nome" placeholder="Insira um Nome" onChange={e => this.handleChange(e)} value={this.state.nome}/>
                                </>
                            ) : (
                                <>
                                <Label style={{marginRight: "10px"}}>{this.stringTranslate("Jornada.Novo.Confirme")}</Label>    
                                <InputGroup size="sm">
                                    <InputGroupAddon addonType="prepend">
                                    <InputGroupText style={{paddingLeft: "5px", paddingRight:"8px"}}>{this.stringTranslate("Jornada.Nome")} </InputGroupText>
                                    </InputGroupAddon>
                                    <Input style={{paddingLeft: "10px"}} type="text" name="nome" id="nome" value={this.state.nome}/> 
                                </InputGroup>
                                
                                <Table size="sm">
                                <thead>
                                    <tr>
                                        <th style={{textAlign:"center"}}>#</th>
                                        <th>{this.stringTranslate("Jornada.Tabela.Dias")}</th>
                                        <th>{this.stringTranslate("Jornada.Tabela.Horarios")}</th>                            
                                    </tr>
                                </thead>
                                <tbody>                                    
                                {this.informacoes.map((prop, key) => {                                
                                return (
                                    <tr style={{border: "none"}} >
                                        <th scope="row" style={{textAlign:"center"}}>{key+1}</th>                                        
                                        <td>{this.state.dias[key]}</td>                
                                        <td>{prop === 0 ? "Sem Acesso" : this.state.dadosPeriodos[prop]}</td>                                                                    
                                    </tr>
                                    );
                                })}
                                </tbody>
                                </Table>
                                </>
                            )}
                        
                    </ModalBody>
                    <ModalFooter>

                    {this.state.passos != 0 ? (<Button color="warning" onClick={() => this.onclick("voltar")}>{this.stringTranslate("Botao.Voltar")}</Button>) : null}
                    {this.state.passos < this.totalDePassos ? (<Button color="info" onClick={() => this.onclick("avancar")}>{this.stringTranslate("Botao.Avancar")}</Button>) : null}
                    {this.state.passos === this.totalDePassos ? (<Spin spinning={this.state.loadingSave}><Button color="success" onClick={() => this.onclick("gravar", 0)}>{this.stringTranslate("Botao.Gravar")}</Button></Spin>) : null}

                    </ModalFooter>
                </Modal>
            );
        }  
        else if(this.props.statusModal === "Editar")  {            
        return(
            <>         
                <Modal modalTransition={{timeout:0}} backdropTransition={{timeout:0}}  isOpen={this.props.modal} style={{minHeight:"60%"}}>
                    <ModalHeader toggle={() =>this.props.onclick("")}><h4>{this.stringTranslate("Jornada.Editar.Titulo")}</h4></ModalHeader>
                    <ModalBody>    
                        <InputGroup size="sm">
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText style={{paddingLeft: "5px", paddingRight:"8px"}}>{this.stringTranslate("Jornada.Nome")} </InputGroupText>
                            </InputGroupAddon>
                            <Input style={{paddingLeft: "5px"}} type="text" name="nome" id="nome" onChange={e => this.handleChange(e)} value={this.state.nome}/> 
                        </InputGroup>
                        
                        <Table size="sm">
                        <thead>
                            <tr>
                                <th style={{textAlign:"center"}}>#</th>
                                <th>{this.stringTranslate("Jornada.Tabela.Dias")}</th>
                                <th>{this.stringTranslate("Jornada.Tabela.Horarios")}</th>                              
                            </tr>
                        </thead>
                        <tbody>
                        {this.montaTabela()}
                        </tbody>
                        </Table>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={() => this.props.onclick("")}>{this.stringTranslate("Botao.Cancelar")}</Button>
                        <Spin spinning={this.state.loadingSave}><Button color="success" onClick={() => this.onclick("gravar", this.state.idJornada)}>{this.stringTranslate("Botao.Gravar")}</Button></Spin>
                    </ModalFooter>
                </Modal>
            </>
            );
        }
        else if(this.props.statusModal === "Copiar")  {            
            return(
                <>         
                    <Modal modalTransition={{timeout:0}} backdropTransition={{timeout:0}}  isOpen={this.props.modal} style={{minHeight:"60%"}}>
                    <ModalHeader toggle={() =>this.props.onclick("")}><h4>{this.stringTranslate("Jornada.Botao.Copiar")} {this.stringTranslate("Jornada.Titulo")}</h4></ModalHeader>
                    <ModalBody>     
                        <InputGroup size="sm">
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText style={{paddingLeft: "5px", paddingRight:"8px"}}>{this.stringTranslate("Jornada.Nome")} </InputGroupText>
                            </InputGroupAddon>
                            <Input style={{paddingLeft: "5px"}} type="text" name="nome" id="nome" onChange={e => this.handleChange(e)} value={this.state.nome}/> 
                        </InputGroup>
                        
                        <Table size="sm">
                        <thead>
                            <tr>
                                <th style={{textAlign:"center"}}>#</th>
                                <th>{this.stringTranslate("Jornada.Tabela.Dias")}</th>
                                <th>{this.stringTranslate("Jornada.Tabela.Horarios")}</th>                           
                            </tr>
                        </thead>
                        <tbody>
                        {this.montaTabela()}                    
                        </tbody>
                        </Table>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={() => this.props.onclick("")}>{this.stringTranslate("Botao.Cancelar")}</Button>
                        <Spin spinning={this.state.loadingSave}><Button color="success" onClick={() => this.onclick("gravar", 0)}>{this.stringTranslate("Botao.Gravar")}</Button></Spin>
                    </ModalFooter>
                </Modal>
            </>
            );
        }
        else if(this.props.statusModal === "Ver")  {            
            return(
                <>         
                <Modal modalTransition={{timeout:0}} backdropTransition={{timeout:0}}  isOpen={this.props.modal} style={{minHeight:"60%"}}>
                    <ModalHeader toggle={() =>this.props.onclick("")}><h4>{this.stringTranslate("Jornada.Botao.Ver")} {this.stringTranslate("Jornada.Titulo")}</h4></ModalHeader>
                    <ModalBody>     
                        <InputGroup size="sm">
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText style={{paddingLeft: "5px", paddingRight:"8px"}}>{this.stringTranslate("Jornada.Nome")}</InputGroupText>
                            </InputGroupAddon>
                            <Input style={{paddingLeft: "5px"}} type="text" name="nome" id="nome" value={this.state.nome}/> 
                        </InputGroup>
                        
                        <Table size="sm">
                        <thead>
                            <tr>
                                <th style={{textAlign:"center"}}>#</th>
                                <th>{this.stringTranslate("Jornada.Tabela.Dias")}</th>
                                <th>{this.stringTranslate("Jornada.Tabela.Horarios")}</th>                             
                            </tr>
                        </thead>
                        <tbody>
                        {this.montaTabela()}                        
                        </tbody>
                        </Table>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={() => this.props.onclick("")}>{this.stringTranslate("Botao.Voltar")}</Button>
                    </ModalFooter>
                </Modal>
                </>
                );
            }
    };
  }
  export default injectIntl(ModalJornada);