import React from "react";
import {
    Button, 
    Modal,
    ModalHeader,
    ModalBody,
    Input,
    Table,
    ModalFooter,
    Row,
    Col,
    Label,
    FormGroup,
    UncontrolledTooltip
  } from "reactstrap";
  import MaskedInput from 'react-text-mask'
 // import {Spin } from 'antd';
    import { Select, Spin } from 'antd';
  import Select1 from "react-select"
  import AsyncSelect from 'react-select/async';
  import { postAdonis } from "utils/api.js";
  import { toast, Slide  } from 'react-toastify';
  import { injectIntl } from "react-intl";
  import { localstorageObjeto } from "utils/Requisicoes";
  import Switch from "react-switch";
  import InputMask from 'react-input-mask';

  const { Option } = Select;
  const toastOptions = {
    transition: Slide,
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,    
  };




  class ModalVeiculos extends React.Component{
    constructor(props) {
        super(props); 

        this.state = {
            valores: {"Proprietario":""},
            steps: 0,
            corBotao: ["primary", "link", "link"],
            disabledBotao: [false],
            collapseToggle: false,
            hexaToggle: true,
            maskNserie: "*** - *****",
            motorista: [],         
            motoristaTabela: [],   
            cartoes: [],
            resultadoSoDisponiveis: true,
            link: [],
            fetching: false,
            pesquisaPessoa:[],
            disabled : false,
			loadingSave : false,
            value:'',
        };
        this.timePost = [];
        this.state.valores["PIN"] = "";
        this.state.valores["motoristas"] = [];
        this.state.valores["numeroCartao1"] = this.state.valores["numeroCartao2"] = "";
        this.state.valores["qualquerParte"] = this.state.valores["soDisponiveis"] = true;
        this.state.valores["codigo"] = 0;
        this.carregaValores = this.carregaValores.bind(this);
        this.vinculaCartao = this.vinculaCartao.bind(this);
        this.options = this.options.bind(this);
        this.toggleConsultaCartao = this.toggleConsultaCartao.bind(this);
        this.onChange = this.onChange.bind(this);
        this.stringTranslate = this.stringTranslate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.preencherOptions = this.preencherOptions.bind(this);
        this.changeStep = this.changeStep.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);
        this.hexaToggled = this.hexaToggled.bind(this);
        this.onChangeWiegand = this.onChangeWiegand.bind(this);
        this.wiegandCalc = this.wiegandCalc.bind(this);
        this.handleChangeMotorista = this.handleChangeMotorista.bind(this);
        this.handleChangeMulti = this.handleChangeMulti.bind(this);
        this.addMotorista = this.addMotorista.bind(this);
        this.loadOptionsSelect = this.loadOptionsSelect.bind(this);
        this.delMotorista=this.delMotorista.bind(this);

        this.state.valores["tipoProprietarioModal"] = this.props.preencherOptions("tipoProprietarioModal")[0];
        this.state.valores["tipoCartao"] = this.options("tipoCartao")[0];
        this.state.valores["locaisAcesso"] = this.props.preencherOptions("locaisAcesso");
        this.state.valores["tipoPesquisaCartao"] = this.options("tipoPesquisaCartao")[0];        

        if(this.props.statusModal != "Novo")
            this.carregaValores();
    }

    handleChangeMotorista(e){
        if(e != null){
            console.log(e);
            this.state.valores["novoMotorista"] = e.props; 
            this.setState({valores: this.state.valores}); 
        }
    }
    //MARK: CARREGA VALORES
    carregaValores(){
        console.log(this.props.data)
        this.state.valores["codigo"] = this.props.data.CodVeiculo;
        this.state.valores["placa"] = this.props.data.Placa
        this.state.valores["modelo"] = this.props.data.Modelo
        this.state.valores["marca"] = this.props.preencherOptions("marca",this.props.data.TextoMarca);
        this.state.valores["cor"] = this.props.preencherOptions("cor",this.props.data.TextoCor);
        this.state.valores["categoria"] = this.props.preencherOptions("categoria",this.props.data.TextoCategoria);
        this.state.valores["tipoProprietarioModal"] = this.props.preencherOptions("tipoProprietarioModal", this.props.data.TipoProprietario);
        
        if(this.props.data.TipoProprietario === 1)
            this.state.valores["Proprietario"] = {value: this.props.data.Codempresa, label: this.props.data.ProprietarioEmpresa};
        else if(this.props.data.TipoProprietario === 2)
            this.state.valores["Proprietario"] = {value: this.props.data.Codproprietario, label: this.props.data.Proprietario};
        
        this.state.valores["locaisAcesso"] = [];
        this.props.data.locaisAcesso.forEach((prop) => {
            this.state.valores["locaisAcesso"].push({value: prop.CodLocalAcesso, label: this.props.local[prop.CodLocalAcesso]})
        })


        this.props.data.motoristas.forEach((prop) => {
            this.state.motorista.push({codigo: prop.CodPessoa, pin: prop.pivot.PIN});
            this.state.motoristaTabela.push({nome: prop.Nome, pin: prop.pivot.PIN});
        })

        if (this.props.data.cartoes.CodIdentificador !== undefined){
            this.state.valores["tipoCartao"] =  this.options("tipoCartao")[this.props.data.cartoes.Tipo];
            this.state.valores["numeroCartao2"] = this.props.data.cartoes.Conteudo;
            this.state.valores["numeroCartao1"] = this.props.data.cartoes.NumSerie;
            this.state.valores["codIdentificador"] = this.props.data.cartoes.CodIdentificador;
        }
        
                
        if(this.state.valores["numeroCartao2"] !== ""  && this.state.valores["numeroCartao2"] !== undefined)
            this.wiegandCalc(this.state.valores["numeroCartao2"], 2);                       
        else
            this.state.valores["Wiegand2"] = "";

        if(this.state.valores["numeroCartao1"] !== ""  && this.state.valores["numeroCartao2"] !== undefined)
            this.wiegandCalc(this.state.valores["numeroCartao1"], 1);                       
        else
            this.state.valores["Wiegand1"] = "";

        this.setState({valores: this.state.valores})
    }

    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }

    //MARK: VINCULA CARTAO
    vinculaCartao(valor, key){
        console.log('------------------')
        console.log(valor)
        console.log(key)
        console.log('------------------')
        var valores = ["","","","",""];        

        if(this.state.link[key] !== true){
            this.state.link[this.state.link.indexOf(true)] = false
            this.state.link[key] = true;
            valores = valor;
        }else
        this.state.link[key] = false;

        this.state.valores["tipoCartao"] = this.options("tipoCartao")[valores[1]];
        this.state.valores["numeroCartao2"] = valores[0];                             
        this.state.valores["numeroCartao1"] = valores[4];
        this.state.valores["codIdentificador"] = parseInt(valores[5]);
        
                
        if(valores[0] !== "")
            this.wiegandCalc(valores[0], 2);                       
        else
            this.state.valores["Wiegand2"] = "";

        if(valores[4] !== "")
            this.wiegandCalc(valores[4], 1);                       
        else
            this.state.valores["Wiegand1"] = "";

        this.setState({valores: this.state.valores, hexaToggle: false, link: this.state.link});        
    }

    addMotorista(){
        console.log(this.state.valores["PIN"]);
        console.log(this.state.valores["novoMotorista"]);
       if (this.state.valores["novoMotorista"] !== null  &&  this.state.valores["PIN"] !== "" )
       {

       
        var   podeincluir = true;
        console.log(this.state.motorista);    
          this.state.motorista.forEach(item =>  {
            
            if(item.codigo === this.state.valores["novoMotorista"].value || this.state.valores["PIN"] === item.pin ){
                podeincluir = false;
            }
        })
        if (podeincluir === true){
        this.state.motorista.push({codigo: this.state.valores["novoMotorista"].value, nome: this.state.valores["novoMotorista"].title,pin: this.state.valores["PIN"]});
       
        this.state.motoristaTabela = this.state.motorista;//push({codigo: this.state.valores["novoMotorista"].value,nome: this.state.valores["novoMotorista"].title, pin: this.state.valores["PIN"]});
        this.state.valores["novoMotorista"] = null;
        this.state.valores["PIN"] = ""
        this.setState({motorista: this.state.motorista, motoristaTabela: this.state.motoristaTabela, valores: this.state.valores,value:''});
        }
        else
        toast.error(this.stringTranslate("Veiculo.Erro.IncluirMotorista"), toastOptions);    
        }
        else 
          toast.error(this.stringTranslate("Veiculo.Erro.IncluirMotoristaDadosInvalidos"), toastOptions);   
    }
    delMotorista(prop){
        console.log(this.state.motorista);
        var index =  this.state.motorista.indexOf(prop);
        console.log(index);
        this.state.motorista.splice(index,1);
        // this.state.motorista= this.state.motorista.map(item =>  {
        //     console.log(item);
        //     if(item.codigo !== prop.codigo){
        //        return item
        //     }
        // })
       console.log(this.state.motorista); 
        this.state.motorista=this.state.motorista === undefined ? [] : this.state.motorista ;
        this.state.motoristaTabela=this.state.motorista;
        this.setState({motorista: this.state.motorista, motoristaTabela: this.state.motoristaTabela})
  //      key = array_search(prop, this.state.motoristaTabela);   
    }

    toggleCollapse(){
        this.setState({collapseToggle: !this.state.collapseToggle})
    }

    toggleConsultaCartao(e, name){
        this.state.valores[name] = e;
        this.setState({valores: this.state.valores});
        console.log(e)
    }

    hexaToggled(){
        this.state.valores["numeroCartao1"] = this.state.valores["Wiegand1"]  = "";
        this.setState({hexaToggle: !this.state.hexaToggle, valores: this.state.valores});
    }

    onChange(e){        
        this.state.valores[e.target.name] = e.target.value;
        this.setState({valores: this.state.valores});
        console.log(e.target.name);
    }
    
    postCadastroVeiculo(){
		if(this.state.valores["Proprietario"] === ""){
			toast.dismiss();
			toast.warning(this.stringTranslate("Warning.ProprietarioVazio"), toastOptions);  
			return;
		}
		
		if(this.state.valores["placa"].length < 4){
			toast.dismiss();
			toast.warning(this.stringTranslate("Warning.PlacaDigito"), toastOptions);  
			return;
		}
				
		
		this.setState({loadingSave : true});
        var locais = [];
        this.state.valores["locaisAcesso"].forEach((prop) => {
            locais.push(parseInt(prop.value))
        })

        if (this.state.valores["Proprietario"]===undefined)
            toast.error(this.stringTranslate("Veiculo.CadastroVeiculoProprietario.undefined"), toastOptions);   
        else if (this.state.valores["modelo"]===undefined)
            toast.error(this.stringTranslate("Veiculo.CadastroVeiculomodelo.undefined"), toastOptions);      
        else if (this.state.valores["marca"]===undefined)
            toast.error(this.stringTranslate("Veiculo.CadastroVeiculomarca.undefined"), toastOptions);      
        else if (this.state.valores["cor"]===undefined)
            toast.error(this.stringTranslate("Veiculo.CadastroVeiculocor.undefined"), toastOptions);     
        else if (this.state.valores["categoria"]===undefined)
            toast.error(this.stringTranslate("Veiculo.CadastroVeiculocategoria.undefined"), toastOptions);  
        else{
        //MARK: CADASTRO VEICULO
            const body={
                cmd:"incluirVeiculo",
                token: sessionStorage.getItem("token"),
                codigo: this.state.valores["codigo"],
                placa: this.state.valores["placa"],
                tipoproprietario: this.state.valores["tipoProprietarioModal"].value,
                codproprietario: this.state.valores["Proprietario"].value,
                modelo: this.state.valores["modelo"],
                marca: this.state.valores["marca"] === undefined ? "" : this.state.valores["marca"].value,
                cor: this.state.valores["cor"] === undefined ? "" : this.state.valores["cor"].value,
                categoriaveiculo: this.state.valores["categoria"] === undefined ? "" : this.state.valores["categoria"].value,
                motoristas: this.state.motorista,
                listalocais: locais,
                identificador: {
                    codigoIdentificador: this.state.collapseToggle === true ? this.state.valores["codIdentificador"] : 0,
                    numserie: this.state.valores["numeroCartao1"],
                    conteudo: this.state.valores["numeroCartao2"],
                    tecnologia: this.state.valores["tipoCartao"].value,
                    tipouso: 10,
                }
            }
            console.log(body);
            postAdonis(body,"/Veiculos/Salvar").then(lista =>{     
                toast.dismiss();
                if(lista.error === undefined)
                {
                    this.props.onclick("");
                    toast.success(this.stringTranslate("Veiculo.Requisicao.CadastroVeiculo.Sucesso"), toastOptions);                  
                }                
                else
                {   if(lista.error === 1)
                        toast.warning(this.stringTranslate("Warning.CartaoJaExiste"), toastOptions);
                    else if(lista.error === 2)
                        toast.warning(this.stringTranslate("Warning.CartaoJaVinculado"), toastOptions);
                    else if(lista.error === 3)
                        toast.error(this.stringTranslate("Veiculo.Requisicao.CadastroVeiculo.Erro1"), toastOptions);      
                    else
                        toast.error(this.stringTranslate("Veiculo.Requisicao.CadastroVeiculo.Erro2"), toastOptions);      
                }
                this.setState({loadingSave : false});			
            }).catch(e => { 
                toast.dismiss();
                toast.warning(this.stringTranslate("Erro.aoSalvarDados"), toastOptions);  
                this.setState({loadingSave : false});
            });
        }
    }
    //MARK: CONSULTA CARTOES
    postConsultaCartoes(){
        const body={
            'cmd': 'consultaCartoes',
            'tipo': this.state.valores["tipoPesquisaCartao"].value,
            'conteudo': this.state.valores["tipoPesquisaCartao"].value === 1 ? this.state.valores["ConteudoCartao"] : "",
            'numSerie': this.state.valores["tipoPesquisaCartao"].value !== 1 ? this.state.valores["ConteudoCartao"] : "",
            'qualquerParte': this.state.valores["qualquerParte"],
            'soDisponiveis': this.state.valores["soDisponiveis"],
            "token": sessionStorage.getItem("token"),
        }
        console.log(body);
        postAdonis(body,"/Cartoes/Consulta").then(lista =>{     
            console.log(lista);
        
            if(lista.dados.error === undefined)
            {
                var array = lista.dados.map((item, key) => {
                    this.state.link[key] = false
                    var usoRecebido = parseInt(item.Uso);
                    var Uso =   usoRecebido === 1 ? this.stringTranslate("Veiculo.USOID.Nenhum") : 
                                usoRecebido === 2 ? this.stringTranslate("Veiculo.USOID.Qualquer") :
                                usoRecebido === 3 ? this.stringTranslate("Veiculo.USOID.Autorizado") :
                                usoRecebido === 4 ? this.stringTranslate("Veiculo.USOID.Funcionario") :
                                usoRecebido === 5 ? this.stringTranslate("Veiculo.USOID.Acesso") :
                                usoRecebido === 6 ? this.stringTranslate("Veiculo.USOID.Ponto") :
                                usoRecebido === 7 ? this.stringTranslate("Veiculo.USOID.Refeitorio") :
                                usoRecebido === 8 ? this.stringTranslate("Veiculo.USOID.Provisorio") :
                                usoRecebido === 9 ? this.stringTranslate("Veiculo.USOID.Provisorio") :
                                usoRecebido === 10 ? this.stringTranslate("Veiculo.USOID.Veiculo") : "";
                    var pessoaVeiculo = item.Nome != null ? item.Nome : item.Placa != null ? item.Placa + " - " + item.Modelo : ""; 
                    var Numserie = item.NumSerie != undefined ? item.NumSerie : "";
                    console.log(item)
                    return[item.Conteudo, item.Tecnologia, Uso, pessoaVeiculo, Numserie, item.codIdentificador]
                })
                var SoDisponiveis = this.state.valores["soDisponiveis"];
                this.setState({cartoes: array, resultadoSoDisponiveis: SoDisponiveis, link: this.state.link});                 
            }                
            else
            {
                toast.error(this.stringTranslate("Veiculo.Erro.Cartao.NaoEncontrado") , toastOptions);  
            }})
    }


    onChangeWiegand(e, key){         
        if(e.target.name === "nserie" || e.target.name == "conteudo"){         
            var valor = e.target.value;

            if(this.state.hexaToggle === true)
                valor = parseInt(valor, 16);
            else    
                valor = parseInt(valor);
                
            this.state.valores["numeroCartao"+key] = e.target.value;

            if(e.target.value !== "")
                this.wiegandCalc(valor, key);                       
            else
                this.state.valores["Wiegand"+key] = "";

            this.setState({valores: this.state.valores});
        }
        else if(e.target.name === "WiegandNS" || e.target.name === "WiegandC"){          
            this.state.valores["Wiegand"+key] = e.target.value;            

            if(e.target.value === "")
                this.state.valores["numeroCartao"+key] = "";

            var valor = "";    
            valor = parseInt(this.state.valores["Wiegand"+key].substring(0, 3).padStart(3, '0')).toString(16);
            valor += parseInt(this.state.valores["Wiegand"+key].substring(6, 11).padStart(5, '0')).toString(16);
            
            if(this.state.hexaToggle === false || e.target.name === "WiegandC")
                valor = parseInt(valor,16);

            this.state.valores["numeroCartao"+key] = valor;
            this.setState({valores: this.state.valores});
        }
        else{
            this.state.valores[e.target.name] = e.target.value;
            this.setState({valores: this.state.valores});
            console.log(e.target.name);
        }
    }

    wiegandCalc(valor, key){     
        var wiegand; 
        var convertido1, convertido2;     
        if (valor!== undefined){
        wiegand = valor.toString(16);

        console.log(wiegand.substring(wiegand.length - 4, wiegand.length).padStart(4, '0'));

        console.log(parseInt(wiegand.substring(wiegand.length - 4, wiegand.length).padStart(5, '0'), 16))
        
        this.state.valores["Wiegand" + key] = parseInt(wiegand.substring(wiegand.length - 6, wiegand.length - 4).padStart(3, '0'),16).toString().padStart(3, '0');
        this.state.valores["Wiegand" + key] += parseInt(wiegand.substring(wiegand.length - 4, wiegand.length).padStart(5, '0'), 16).toString();
               
        
        console.log(this.state.valores["Wiegand" + key]);
        }
    }

    changeStep(pagina){
        var step;
        if(pagina === "veiculo")
            step = 0;            
        else if(pagina === "motorista")
            step = 1;        
        else if(pagina === "cartao")
            step = 2;  
        else if(pagina === "avancar")
            step = this.state.steps + 1;
        else if(pagina === "voltar")
            step = this.state.steps - 1;                    
        else if(pagina === "gravar")
        {
            this.postCadastroVeiculo();
        }                

        if(step === 0)        
            this.setState({steps: 0, corBotao: ["primary", "link", "link"]})
        else if(step === 1)
            this.setState({steps: 1, corBotao: ["link", "primary", "link"]})
        else if(step === 2)
            this.setState({steps: 2, corBotao: ["link", "link", "primary"]})   

    }
    pesquisaPessoa(value){
        var array=[];
        const body={        
            nome: value,
            resumo: true,
            incluirPreAutorizado:true,
            incluirresidente:true,
            incluirNaoResidenteAutorizado:true,
            token: sessionStorage.getItem("token"),
        }
        postAdonis(body,"/Geral/ConsultaPessoaP").then(lista =>{     
        if(lista.error === undefined)
        {            
            console.log(lista.dados);
            
            array = lista.dados.map((item) => {
            return{value: item.codigo, text: item.nome, name: "Proprietario", name2: "novoMotorista"}
        //    return{value: item.codigo, label: item.nome, name: "Proprietario", name2: "novoMotorista"}
            })
            this.setState({pesquisaPessoa: array, fetching: false});
        
        }                
        else
        {
            this.state.mensagemErro = this.stringTranslate("proprietario.erro");
        }
        });
    }

    loadOptionsSelect = value => {
        if(value.length > 2){      
          clearInterval(this.timePost);
          
          this.timePost = setTimeout(() => this.pesquisaPessoa(value)
           , 500);
        }    
      };

    handleChange(e){
         if(e.name === "tipoProprietarioModal"){
             this.state.valores["Proprietario"] = "";
         }
         if(e.name === "empresa"){
            e.name = "Proprietario"
        }
        console.log(e)
        this.state.valores[e.name] = e; 
        this.setState({valores: this.state.valores});        
    }

    handleChangeMulti(e, key){
        this.state.valores[key] = e; 
        this.setState({valores: this.state.valores});        
    }

    preencherOptions(){ 
               
      //  var locaisAcesso = localstorageObjeto("locaisAcesso");
     //   const opcoes = locaisAcesso.map((prop, key) => {
       //     return({value:prop[1],label:prop[0], name: "locais"});})
        console.log("entrei")
      //  return opcoes           
    }

    options(valor){
        switch (valor){
            case "tipoCartao":
            return [
                { value: 0, label: this.stringTranslate("Veiculo.Modal.TipoCartao.Opcao1"), name: "tipoCartao"}, // Desconhecida / qualquer
                { value: 1, label: this.stringTranslate("Veiculo.Modal.TipoCartao.Opcao2"), name: "tipoCartao"}, // Mifare
                { value: 2, label: this.stringTranslate("Veiculo.Modal.TipoCartao.Opcao3"), name: "tipoCartao"}, // RFID               
                { value: 3, label: this.stringTranslate("Veiculo.Modal.TipoCartao.Opcao4"), name: "tipoCartao"}, // Controle Remoto
                { value: 4, label: this.stringTranslate("Veiculo.Modal.TipoCartao.Opcao5"), name: "tipoCartao"}, // Código de Barra
            ]

            case "tipoPesquisaCartao":
            return [
                { value: 1, label: this.stringTranslate("Veiculo.Modal.PesquisaCartao.Opcao1"), name: "tipoPesquisaCartao"},
                { value: 2, label: this.stringTranslate("Veiculo.Modal.PesquisaCartao.Opcao2"), name: "tipoPesquisaCartao"},
                { value: 3, label: this.stringTranslate("Veiculo.Modal.PesquisaCartao.Opcao3"), name: "tipoPesquisaCartao"},
            ] 

        }
    }

    render(){
        var disabled = false;    
        if (this.props.statusModal ==="Ver")
            disabled= true

  
        console.log(this.state.pesquisaPessoa);
        return(
        <>         
            <Modal fade isOpen={this.props.modal}  size="lg" style={{minHeight: "600px", marginTop: "-70px"}}>
            <ModalHeader toggle={() =>this.props.onclick("")}><h4>{this.props.statusModal} {this.stringTranslate("Cadastro.Modal.Titulo")}</h4>            
            </ModalHeader>
                <ModalBody style={{paddingTop: "0px", minHeight: "480px"}}> 
                <div style={{textAlign: "center"}}>
                    <Button color={this.state.corBotao[0]} size="sm" style={{borderRadius: "50px"}} onClick={() => this.changeStep("veiculo")} >Veículo</Button> 
                    <Button color={this.state.corBotao[1]} size="sm" style={{borderRadius: "50px"}} onClick={() => this.changeStep("motorista")}>Motoristas</Button> 
                    <Button color={this.state.corBotao[2]} size="sm" style={{borderRadius: "50px"}} onClick={() => this.changeStep("cartao")}>Cartão</Button>
                </div>
                    {this.state.steps === 0 ? (
                    <>
                        <Row>
                        <Col>
                        <FormGroup>                      
                            <Label>{this.stringTranslate("Veiculo.Modal.Cadastro.Placa")}</Label>   
            
                            <Input type="text"
                                mask =  {[/[1-9]/]}
                                name= "placa" 
                                value= {this.state.valores["placa"]}
                                onChange={(e) => this.onChange(e)}
                                onKeyPress={this.onKeyPress}
                                id="placa"
                                disabled= {disabled}
                                formatChars={{ "*":"[A-Za-z0-9]"}} mask="********" maskChar={null} tag={InputMask}
                            />                        
                        </FormGroup>
                        </Col>
                        <Col>
                        <FormGroup>                      
                            <Label>{this.stringTranslate("Veiculo.Modal.Cadastro.Modelo")}</Label>          
                            <Input type="text"
                                name= "modelo" 
                                value= {this.state.valores["modelo"]}
                                onChange={(e) => this.onChange(e)}
                                onKeyPress={this.onKeyPress}
                                id="modelo"
                                disabled= {disabled}
                            />                                      
                        </FormGroup>
                        </Col>
                        </Row>
                        <Row>
                        <Col>
                        <FormGroup>                      
                            <Label>{this.stringTranslate("Veiculo.Modal.Cadastro.Marca")}</Label>    
                            <Select1               
                                options={this.props.preencherOptions("marca")}
                                placeholder=""
                                value = {this.state.valores["marca"]}
                                onChange={(e) => this.handleChange(e)}
                                id="marca"
                                isDisabled= {disabled}
                            />                                             
                        </FormGroup>
                        </Col>
                        <Col>
                        <FormGroup>                      
                            <Label>{this.stringTranslate("Veiculo.Modal.Cadastro.Cor")}</Label>    
                            <Select1               
                            options={this.props.preencherOptions("cor")}
                            placeholder=""
                            value = {this.state.valores["cor"]}
                            onChange={(e) => this.handleChange(e)}
                            id="cor"
                            isDisabled= {disabled}
                            />                                             
                        </FormGroup>
                        </Col>
                        <Col>
                        <FormGroup>                      
                            <Label>{this.stringTranslate("Veiculo.Modal.Cadastro.Categoria")}</Label>    
                            <Select1               
                            value = {this.state.valores["categoria"]}
                            options={this.props.preencherOptions("categoria")}
                            placeholder=""
                            onChange={(e) => this.handleChange(e)}
                            id="categoria"
                            isDisabled={disabled}
                            />                                             
                        </FormGroup>
                        </Col>
                        </Row>

                        <Row>
                            <Col md="4">
                            <FormGroup>                      
                                <Label>{this.stringTranslate("Veiculo.Modal.Cadastro.TipoProprietário")}</Label>    
                                <Select1      
                                    value = {this.state.valores["tipoProprietarioModal"]}         
                                    options={this.props.preencherOptions("tipoProprietarioModal")}
                                    placeholder=""
                                    onChange={(e) => this.handleChange(e)}
                                    id="tipoProprietarioModal"
                                    isDisabled={disabled}
                                />                                             
                            </FormGroup>
                            </Col>

                            <Col>
                            {this.state.valores["tipoProprietarioModal"].value === 0 ? (
                            <FormGroup>                      
                                <Label>{this.stringTranslate("Veiculo.Modal.Cadastro.Proprietário")}</Label>    
                                <Select1              
                                value = {this.state.valores["Proprietario"]}
                                options={this.props.preencherOptions("empresa")}
                                placeholder=""
                                onChange={(e) => this.handleChange(e)}
                                id="ProprietarioEmpresa"
                                isDisabled={disabled}
                                />                                             
                            </FormGroup>) : this.state.valores["tipoProprietarioModal"].value === 1 ? (
                            <FormGroup>                      
                                <Label>{this.stringTranslate("Veiculo.Modal.Cadastro.Proprietário")}</Label>    
                                <AsyncSelect
                                    cacheOptions
                                    loadOptions={this.props.pesquisaPessoa}
                                        onChange={(e) => this.handleChange(e)}
                                    isLoading={true}
                                    isClearable={true}
                                    value={this.state.valores["Proprietario"]}
                                    placeholder=""
                                    id="novoMotorista"
                                    isDisabled={disabled}
                                />                                          
                            </FormGroup>
                        ) : (
                            <FormGroup>
                                <Label>{this.stringTranslate("Veiculo.Modal.Cadastro.Proprietário")}</Label>    
                                <Input disabled={true} />   
                                {console.log(this.state.valores["tipoProprietarioModal"])}                                              
                            </FormGroup>
                            
                        )}                      
                            
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label>{this.stringTranslate("Veiculo.Modal.Cadastro.LocaisPermitidos")}</Label>
                                   
                                    { <Select1
                                        isMulti
                                        closeMenuOnSelect={false}                       
                                        isClearable={true}
                                        isSearchable={true}
                                        value = {this.state.valores["locaisAcesso"]}
                                        id="cor"
                                        onChange={(e) => this.handleChangeMulti(e, "locaisAcesso")}
                                        options={this.props.preencherOptions("locaisAcesso")}
                                        placeholder=""
                                        isDisabled={disabled}
                                    /> }
                                    
                                </FormGroup>
                            </Col>
                        </Row>
                    </>) :
                    this.state.steps === 1 ? (
                        <>
                            <Row>
                                <Col md="7">
                                    <FormGroup>                      
                                        <Label>{this.stringTranslate("Veiculo.Modal.Tabela.Motorista")}</Label>    
                                         <Select
                                          
                                            showSearch
                                            showArrow={false}
                                            size="large"
                                            placeholder=""
                                            notFoundContent={this.state.fetching ? <Spin size="small" /> : null}
                                            filterOption={false}
                                            onSearch={this.loadOptionsSelect}
                                            onChange={(e,o) => this.handleChangeMotorista(o)}
                                            style={{ width: '100%' }}
                                            allowClear={true}
                                            disabled={disabled}
                                            value={this.state.valores['novoMotorista']===undefined  || this.state.valores['novoMotorista']===null  ? '' : this.state.valores['novoMotorista'].title }
                                            >
                                            {
                                                this.state.pesquisaPessoa.map(d => (
                                                    <Option value={d.value} title={d.text}>{d.text}</Option>
                                            ))}
                                        </Select> 
                                        {/* <AsyncSelect
                                            cacheOptions
                                            loadOptions={this.props.pesquisaPessoa}
                                            onChange={(e) => this.handleChangeMotorista(e)}
                                            isLoading={true}
                                            isClearable={true}
                                            value={this.state.valores["novoMotorista"]}
                                            placeholder=""
                                            id="novoMotorista"
                                        />                                             } */}
                                    </FormGroup>
                                </Col> 
                                <Col>
                                    <FormGroup>                      
                                        <Label>{this.stringTranslate("Veiculo.Modal.Cadastro.Pin")}</Label>    
                                        <Input type="text"
                                            name= "PIN" 
                                            value= {this.state.valores["PIN"]}
                                            onChange={(e) => this.onChange(e)}
                                            onKeyPress={this.onKeyPress}
                                            id="PIN"
                                            disabled={disabled}
                                        />                                          
                                    </FormGroup>
                                </Col> 
                                <Col md="2">
                                    <FormGroup>                      
                                        <Button block color="success" style={{marginTop: "33px", marginBottom: "20px"}} onClick={() => this.addMotorista()}><i className="fas fa-plus"/></Button>                                           
                                    </FormGroup>
                                </Col>    
                            </Row>
                            <Row>
                                <Col>
                                    <Table style={{marginTop: "10px"}}>
                                        {/*//MARK: TABELA MOTORISTAS  */}
                                        <thead>
                                                <tr>
                                                <th>#</th>
                                                <th>{this.stringTranslate("Veiculo.Modal.Tabela.Motorista")}</th>
                                                <th>{this.stringTranslate("Veiculo.Modal.Tabela.PIN")}</th> 
                                                </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.motoristaTabela.map((prop, key) => {
                                                console.log(prop)
                                                return(
                                                    <tr>
                                                    <th scope="row">{key+1}</th>
                                                    <td>{prop.nome}</td>      
                                                    <td>{prop.pin}</td>
                                                    <td><i id={"Excluir"+key} className="far fa-trash-alt ef-pulse-grow" onClick={() => this.delMotorista(prop)} style={{top:"0", marginLeft: "10px", color:"#E24E42", cursor:"pointer"}}/></td>
                                                    </tr> );
                                            })}
                                                                                        
                                        </tbody>                                       
                                    </Table>        
                                </Col>    
                            </Row>

                        </>
                    ) : (
                        <>                            
                            <Row>   
                                <Col>
                                    <FormGroup style={{marginTop: "20px"}}> 
                                            <Switch 
                                                onChange={this.toggleCollapse} 
                                                checked={this.state.collapseToggle}  
                                                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)" 
                                                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)" 
                                                height={20}
                                                width={40}
                                                className="react-switch"    
                                                disabled={disabled}                                           
                                            /> <Label onClick={this.toggleCollapse} >{this.stringTranslate("Veiculo.Modal.Cartao.JaCadastradoCartao")}</Label>
                                    </FormGroup>  
                                </Col>                                     
                            </Row>

                            {this.state.collapseToggle === false ? ( 
                            <>
                            <Row>
                                <Col>
                                    <FormGroup>                       
                                        <Label>Tipo do Cartão</Label>    
                                        <Select1               
                                            name="proprietario"
                                            options={this.options("tipoCartao")}                                                
                                            id="tipoCartao"
                                            value={this.state.valores["tipoCartao"]}
                                            placeholder=""
                                            onChange={(e) => this.handleChange(e)}
                                            isDisabled={disabled}
                                        />                                             
                                    </FormGroup>
                                </Col>
                                <Col md="3">
                                    <Button block color="info" style={{marginTop: "35px", marginBottom: "20px"}} disabled={disabled} >Ler Cartão</Button>
                                </Col>
                            </Row>
                            { this.state.valores["tipoCartao"].value === 3 || this.state.valores["tipoCartao"].value === 5 ? this.state.valores["numeroCartao1"] = this.state.valores["Wiegand1"] = "" : 
                                <Row>                                             
                                    <Col md={5}>
                                        <FormGroup>
                                            <Label for="nserie">Número de Série</Label>                                      
                                                {this.state.hexaToggle === true ? (
                                                    <Input disabled={disabled} type="text" name="nserie" id="nserie" value={this.state.valores["numeroCartao1"]} onChange={e => this.onChangeWiegand(e, "1")} formatChars={{ "*":"[A-Fa-f0-9]"}} mask="*************" maskChar={null} tag={InputMask}/>
                                                ) : (
                                                    <Input disabled={disabled} type="text" name="nserie" id="nserie" value={this.state.valores["numeroCartao1"]} onChange={e => this.onChangeWiegand(e, "1")} formatChars={{ "*":"[0-9]"}} mask="*************" maskChar={null} tag={InputMask}/>)}
                                        </FormGroup>
                                    </Col>
                                    <Col md={2} style={{paddingTop: "40px"}}>
                                        <FormGroup> 
                                                <Switch 
                                                    onChange={this.hexaToggled} 
                                                    checked={this.state.hexaToggle}  
                                                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)" 
                                                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)" 
                                                    height={20}
                                                    width={40}
                                                    className="react-switch"
                                                    disabled={disabled}
                                                /> <Label onClick={this.hexaToggled} > HEXA</Label>
                                        </FormGroup>
                                    </Col>
                                        <Col md={5}>
                                        <FormGroup>
                                            <Label for="WiegandNS">Wiegand</Label>
                                            <Input disabled={disabled} type="text" name="WiegandNS" value={this.state.valores["Wiegand1"]} onChange={e => this.onChangeWiegand(e, "1")} id="WiegandNS"  mask="999 - 99999" maskChar={null} tag={InputMask}/>
                                        </FormGroup>
                                        </Col>
                                </Row> 
                            }

                            <Row>                                             
                                <Col md={7}>
                                    <FormGroup>
                                        <Label for="conteudo">Conteúdo</Label>
                                        <Input disabled={disabled} type="text" name="conteudo" id="conteudo" value={this.state.valores["numeroCartao2"]} onChange={e => this.onChangeWiegand(e, "2")} formatChars={{ "*":"[0-9]"}} mask="*************" maskChar={null} tag={InputMask}/>
                                    </FormGroup>
                                </Col>
                                    <Col md={5}>
                                    <FormGroup>
                                        <Label for="WiegandC">Wiegand</Label>
                                        <Input disabled={disabled} type="text" name="WiegandC" id="WiegandC" value={this.state.valores["Wiegand2"]} onChange={e => this.onChangeWiegand(e, "2")} id="WiegandNS"  mask="999 - 99999" maskChar={null} tag={InputMask}/>
                                    </FormGroup>
                                    </Col>
                            </Row>
                            </>) : 
                            <>
                                <Row>
                                    <Col>
                                        <FormGroup>                       
                                            <Label>Pesquisar por:</Label>    
                                            <Select1               
                                                name="proprietario"
                                                options={this.options("tipoPesquisaCartao")}                                                
                                                id="tipoPesquisaCartao"
                                                value={this.state.valores["tipoPesquisaCartao"]}
                                                placeholder=""
                                                onChange={(e) => this.handleChange(e)}
                                                isDisabled={disabled}
                                            />                                             
                                        </FormGroup>
                                    </Col>
                                    <Col md="5" style={{marginTop: "20px"}}>
                                        <Row>
                                            <Col>                                          
                                                <Switch 
                                                    onChange={ (e) => this.toggleConsultaCartao(e, "soDisponiveis")} 
                                                    checked={this.state.valores["soDisponiveis"]}  
                                                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)" 
                                                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)" 
                                                    height={20}
                                                    width={40}
                                                    className="react-switch"
                                                    disabled={disabled}
                                                /> 
                                                <Label style={{marginLeft: "7px"}} onClick={() => this.toggleConsultaCartao(!this.state.valores["soDisponiveis"], "soDisponiveis")}> {this.stringTranslate("Veiculo.Modal.SoDisponiveis")}</Label>                                    
                                            </Col>
                                        </Row>
                                        <Row> 
                                            <Col>
                                                <Switch 
                                                    onChange={(e) => this.toggleConsultaCartao(e, "qualquerParte")} 
                                                    checked={this.state.valores["qualquerParte"]}  
                                                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)" 
                                                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)" 
                                                    height={20}
                                                    width={40}
                                                    className="react-switch"
                                                    disabled={disabled}
                                                /> 
                                                <Label style={{marginLeft: "7px"}} onClick={() => this.toggleConsultaCartao(!this.state.valores["qualquerParte"], "qualquerParte")}> {this.stringTranslate("Veiculo.Modal.QualquerParte")}</Label>
                                            </Col>                                           
                                        </Row>                                        
                                    </Col>
                                </Row>

                                <FormGroup row>
                                    <Label for="exampleEmail" sm={2} style={{ marginTop: "10px"}}>{this.state.valores["tipoPesquisaCartao"].value === 1 ? this.stringTranslate("Veiculo.PesquisaCartao.Coteudo") : this.stringTranslate("Veiculo.PesquisaCartao.NumSerie")} </Label>
                                    <Col sm={7} style={{ marginTop: "10px"}}>
                                        <Input disabled={disabled} type="text" name="ConteudoCartao" id="ConteudoCartao" placeholder="" onChange={(e) => this.onChange(e)} />
                                    </Col>
                                    <Col sm={3}>
                                        <Button block color="info" style={{  marginTop: "8px", marginBottom: "20px"}} onClick={() => this.postConsultaCartoes()}>{this.stringTranslate("Veiculos.Campo.Pesquisar")}</Button>
                                    </Col>
                                </FormGroup>

                                <Row>
                                    <Col>
                                    <Table style={{marginTop: "10px"}}>
                                        {/*//MARK: TABELA CARTOES  */}
                                        <thead>
                                                <tr>
                                                <th>#</th>
                                                <th>{this.state.valores["tipoPesquisaCartao"].value === 1 ? this.stringTranslate("Veiculo.PesquisaCartao.Coteudo") : this.stringTranslate("Veiculo.PesquisaCartao.NumSerie")}</th>
                                                <th>{this.stringTranslate("Veiculo.Modal.TabelaCartoes.Tecnologia")}</th>
                                                <th>{this.stringTranslate("Veiculo.Modal.TabelaCartoes.Uso")}</th>
                                                {this.state.resultadoSoDisponiveis === false ? <th>{this.stringTranslate("Veiculo.Modal.TabelaCartoes.Autorizado/veiculo")}</th> : null}
                                                </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.cartoes.map((prop, key) => {
                                                return(
                                                    //  //item.Conteudo, tecnologia, Uso, pessoaVeiculo
                                                    
                                                    <tr>
                                                        {console.log(prop)}
                                                    <th scope="row">{key+1}</th>
                                                    <td>{prop[0]}</td>      
                                                    <td>{this.options("tipoCartao")[prop[1]].label}</td>
                                                    <td>{this.state.link[key] === true ? "Vinculado" : prop[2]}</td>
                                                    {this.state.resultadoSoDisponiveis === false ? <td>{prop[3]}</td> : null}
                                                    <td><i class={this.state.link[key] === true ? "fad fa-unlink" : "fad fa-link"} id={"vincular"+key} onClick={() => this.vinculaCartao(prop, key)} style={{cursor: "pointer"}}/><UncontrolledTooltip placement="right" target={"vincular"+key}> {this.state.link[key] === true ? this.stringTranslate("Veiculo.Modal.TabelaCartoes.Desvincular") : this.stringTranslate("Veiculo.Modal.TabelaCartoes.Vincular")} </UncontrolledTooltip></td>
                                                    </tr> );
                                            })}
                                                                                        
                                        </tbody>                                       
                                    </Table>          
                                    </Col>    
                                </Row>

                            </>
                            }
                        </>
                    )
                
                
                }
                </ModalBody>
                <ModalFooter>
                    {this.state.steps != 0 ? (<Button color="warning" style={{width: "100px"}} onClick={() => this.changeStep("voltar")}>{this.stringTranslate("Botao.Voltar")}</Button>) : null}
                    {this.state.steps < 2 ? (<Button color="info" style={{width: "100px"}} onClick={() => this.changeStep("avancar")}>{this.stringTranslate("Botao.Avancar")}</Button>) : null}
                    {this.state.steps === 2 && this.props.statusModal != "Ver" ? (<Button color="success" style={{width: "100px"}} onClick={() => this.changeStep("gravar", "0")}>{this.stringTranslate("Botao.Gravar")}</Button>) : null}
                </ModalFooter>
            </Modal>
        </>
        );
    
    };
  }
  export default injectIntl(ModalVeiculos);