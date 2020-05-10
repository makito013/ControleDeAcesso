import React from "react";
import {
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
    Collapse,
    Form,
    FormFeedback,
  } from "reactstrap";

  import AsyncSelect from 'react-select/async';
  import {post, postAdonis} from "../../utils/api.js"
  import { toast, Slide, ToastType  } from 'react-toastify';
  import { injectIntl } from "react-intl";
  import InputMask from 'react-input-mask';
  import ModalCadastroBiometrico from "../../components/Modal/ModalCadastroBiometrico"
  import Webcam from "react-webcam";
  import { TreeSelect, Tooltip, Upload, Icon, Button, Select,Tree } from 'antd';
  import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
  import '../../assets/css/antd.css';
  import moment from 'moment';
  import Compress from 'compress.js';

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

    function converteOperacaoCheckListaLocais(opcoes){
        let lista = [0];
        for (var i = 0, j = opcoes.length; i < j; i++){
            if (Boolean(opcoes[i])){
                if (opcoes[i] === 1)
                    lista.push(i+1);
            }
        }
        return(lista);
    }

    function converteOperacaoCheckListaAcesso(opcoes){
        let lista = [];
        for (var i = 0, j = opcoes.length; i < j; i++){
            if (Boolean(opcoes[i])){
                if (opcoes[i] === 1)
                    lista.push(i+3);
            }
        }
        return(lista);
    }

  class ModalCadastro extends React.Component{
    constructor(props) {
        super(props); 

        this.state = {
            valores: [],
            steps: 0,
            corBotao: ["primary"],
            disabledBotao: [false],
            quantidadeSteps: 5,
            togglePreAutorizado: false,
            numeroBiometria: "",
            statePage: "index",
            fotoPerfil: [], 
            responsaveisTabela: [],
            responsaveis: [],    
            loadingInit: false,  
        };

        this.visualizar = false;
        this.stringTranslate = this.stringTranslate.bind(this);        
        this.changeStep = this.changeStep.bind(this);
        this.handleChangeMulti = this.handleChangeMulti.bind(this);
        this.pesquisaPessoa = this.pesquisaPessoa.bind(this)
        this.handleBiometria = this.handleBiometria.bind(this);
        this.addResponsavel = this.addResponsavel.bind(this);
        this.excluiResponsavel = this.excluiResponsavel.bind(this);
        this.excluiResponsavelNS = this.excluiResponsavelNS.bind(this);
        this.validaCampos = this.validaCampos.bind(this);
        this.step0 = this.step0.bind(this);
        this.step1 = this.step1.bind(this);
        this.step2 = this.step2.bind(this);
        this.step3 = this.step3.bind(this);
        this.options = this.options.bind(this);
        this.enviaCadastro = this.enviaCadastro.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.carregaValoresPadrao = this.carregaValoresPadrao.bind(this);
        this.consultaAutorizado = this.consultaAutorizado.bind(this);
        this.limpaValores = this.limpaValores.bind(this);
        this.adicionaSecao = this.adicionaSecao.bind(this);
        this.removeSecao = this.removeSecao.bind(this);

        if(this.props.statusModal !== "Novo"){
            if (this.props.statusModal === "Editar"){
                this.visualizar = false;
            }
			else
				 this.visualizar = true;
			 
            this.consultaAutorizado(this.props.codigo);
        }		
        else
            this.carregaValoresPadrao("");

        for(var i = 1; i < this.state.quantidadeSteps; i++)
            this.state.corBotao[i] = "link"
       
    }

    verificarcheck(index,array){



       if (array.indexOf(index) === -1)
        return false
       else return true; 
    }
    consultaAutorizado(key){
        const body={
            cmd:"consultaCodigoPessoa",
            codigo: key  ,            
            token:sessionStorage.getItem("token"),
          }
          postAdonis(body, '/Autorizado/Consulta').then(dados =>{     	
            if(dados.error === undefined)
            {
                var Pessoa = dados.dados.Pessoa[0];
                var Autorizado = dados.dados.Autorizado[0];
                var Locais = dados.dados.Locais;
                var Responsaveis = dados.dados.Responsaveis;
                var Foto = dados.dados.Fotos;
                var AutorizadoSecao = dados.dados.AutorizadoSecao;
                var valuePadrao=[];
                valuePadrao["nome"] = Pessoa.NOME;
                valuePadrao["codPessoa"] =  Pessoa.CODPESSOA;
                valuePadrao["CPF"] = Pessoa.CPF;
                valuePadrao["cnh"] = Pessoa.NumeroCNH;
                valuePadrao["validade"] = Pessoa.DataValidadeCNH ? moment(Pessoa.DataValidadeCNH).utc().format("YYYY-MM-DD") : null;//momente(DataValidadeCNH)
                valuePadrao["nascimento"] = Pessoa.DATANASCIMENTO ? moment(Pessoa.DATANASCIMENTO).utc().format("YYYY-MM-DD") : null;
                valuePadrao["nomeMae"] = Pessoa.NomeMae;
                valuePadrao["telefone"] = Pessoa.TELEFONE;
                valuePadrao["email"] = Pessoa.Email;
                valuePadrao["endereco"] = Pessoa.ENDERECO;
                valuePadrao["obs"] = Pessoa.OBSERVACAO;
                valuePadrao["categoria"] = Autorizado.CODCATEGORIAPESSOA;
                valuePadrao["senha"] = Pessoa.SENHAACESSO;
                valuePadrao["iButton"] = Pessoa.IBUTTON;
                valuePadrao["confirmeSenha"] = Pessoa.SENHAACESSO;
                valuePadrao["matricula"] =  Autorizado.MATRICULA;
                valuePadrao["pin"] = Autorizado.PIN;
                valuePadrao["tipoAutorizacao"] = Autorizado.TIPOAUTORIZACAO;
                valuePadrao["dataInicio"] =  Autorizado.DATAINICIOLIBERACAO ? moment(Autorizado.DATAINICIOLIBERACAO).utc().format("YYYY-MM-DD") : null;
                valuePadrao["dataFim"] =  Autorizado.DATAFIMLIBERACAO ? moment(Autorizado.DATAFIMLIBERACAO).utc().format("YYYY-MM-DD") : null;
                valuePadrao["responsavel"] = {value: Autorizado.CODPESSOARESPONSAVEL, label: Autorizado.NOMERESPONSAVEL};
                valuePadrao["secao"] =  Autorizado.CODSECAO;
                valuePadrao["lotacao"] = Autorizado.CODLOTACAO;
                valuePadrao["empresa"] = Autorizado.CODEMPRESA;
                valuePadrao["dataLimite"] =  Autorizado.DataLimiteSecao ? moment(Autorizado.DataLimiteSecao).utc().format("YYYY-MM-DD") : null;
                valuePadrao["JornadaAcesso"] = Autorizado.CODJORNADA;
                valuePadrao["sexo"] = Pessoa.SEXO;
                valuePadrao["codPessoa"] = Autorizado.CODPESSOA;
                
                console.log(valuePadrao);

                const treeDataLocais = this.props.locaisAcesso.map(prop =>{

                    return (
                        {
                            title: prop[1],
                            value: prop[0],
                            key: prop[0],
                         //   checkable: this.verificarcheck(prop[0],Locais.map(prop2=>{return prop2.codlocal}))
                        }
                    )

                });
      
                
                // [
                //     {
                //       title: {Locais.},
                //       value: '0-0',
                //       key: '0-0',
                //       children: [
                //         {
                //           title: 'Child Node1',
                //           value: '0-0-0',
                //           key: '0-0-0',
                //         },
                //       ],
                //     },

                valuePadrao["locais"] =Locais.map(prop2=>{return prop2.CODLOCALACESSO}); //select com checkbox não aceita ""
                this.state.responsaveis = Responsaveis.map(prop => {return({codigo: prop.CodResponsavel, tipo: prop.Parentesco})})
                this.state.responsaveisTabela = Responsaveis.map(prop => {
                    return(
                        [prop.NOMERESPONSAVEL, 
                        this.options("tipoResponsavel")[prop.Parentesco - 1].label,
                        <><i className="far fa-trash-alt ef-pulse-grow" style={{top:"0", marginLeft: "10px", color:"#E24E42", cursor:"pointer"}} onClick={() => this.excluiResponsavel(prop.CodAutorizadoResponsavel)}/></>
                        ]
                    )
                });

                valuePadrao["opcoesLocais"] = [];
                valuePadrao["opcoesLocais"].push(converteOperacaoCheckListaLocais(
                    [
                        Autorizado.EhTitular,
                        Autorizado.PermiteAutorizarVisita
                    ]
                )); //Ver [0]
                
                valuePadrao["dataLimite"] = [];
                if(Autorizado.DataLimiteSecao) 
                    valuePadrao["dataLimite"].push(moment(Autorizado.DataLimiteSecao).utc().format("YYYY-MM-DD"));
                
                valuePadrao["secao"] = []
                valuePadrao["secao"].push(Autorizado.CODSECAO);
 
                valuePadrao["lotacao"] = []
                valuePadrao["lotacao"].push(Autorizado.CODLOTACAO);

                valuePadrao["empresa"] = []
                valuePadrao["empresa"].push(Autorizado.CODEMPRESA);

                AutorizadoSecao.map(prop => {
                    console.log(prop)
                    valuePadrao["secao"].push(prop.SECAO);
                    valuePadrao["lotacao"].push(prop.LOTACAO);
                    valuePadrao["empresa"].push(prop.EMPRESA);
                    valuePadrao["dataLimite"].push(moment(prop.DATALIMITE).utc().format("YYYY-MM-DD"));
                    valuePadrao["opcoesLocais"].push(converteOperacaoCheckListaLocais(
                        [
                            prop.EHTITULAR,
                            prop.PERMITEAUTORIZARVISITA
                        ]
                    ));
                });
                valuePadrao["listalocais"] =treeDataLocais; //select com checkbox não aceita ""
 
                valuePadrao["opcoesAcesso"] = converteOperacaoCheckListaAcesso(
                    [
                        Pessoa.DisponivelOffline,
                        Pessoa.SemLimiteAcessosDia,
                        Pessoa.SemVerificacaoTempoAcesso,
                        Pessoa.PodeAbrirFecharSistema,
                        Pessoa.PersonaNonGrata,
                        Pessoa.UsaCartaoComSenha,
                        Pessoa.AutorizaSMS,
                        Pessoa.NaoUsaBiometria
                    ]
                ); // Ver
                this.state.fotoPerfil = Foto.Perfil.map((prop) => {return prop.IMAGEM});
                this.state.togglePreAutorizado = valuePadrao["tipoAutorizacao"] === 2 ? true : false;
                this.setState({valores:valuePadrao, responsaveis: this.state.responsaveis, responsaveisTabela: this.state.responsaveisTabela, fotoPerfil: this.state.fotoPerfil});                  
            }                
            else
            {
              toast.dismiss();
              toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
            } 
          }).catch(e => {
            toast.dismiss();
            toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
          });
    }

    limpaValores(campos){
        for(var i = 0; i < campos.length; i++){   
            var camp = campos[i].split('-');
            if (camp.length > 1){
                this.state.valores[camp[0]][camp[1]] = "";
            }
            else
                this.state.valores[campos[i]] = "";
        }
        this.setState({valores: this.state.valores})
    }

    carregaValoresPadrao(valores){
        var valuePadrao = this.state.valores;
        if(valores === ""){
           valuePadrao["nome"] = valuePadrao["codPessoa"] = valuePadrao["CPF"] = 
           valuePadrao["cnh"] = valuePadrao["validade"] = valuePadrao["nascimento"] = valuePadrao["nomeMae"] =
           valuePadrao["telefone"] = valuePadrao["email"] = valuePadrao["endereco"] = valuePadrao["obs"] =
           valuePadrao["categoria"] = valuePadrao["senha"] = valuePadrao["confirmeSenha"] = valuePadrao["categoria"] = 
           valuePadrao["matricula"] = valuePadrao["pin"] = valuePadrao["tipoAutorizacao"] = valuePadrao["dataInicio"] = 
           valuePadrao["dataFim"] = valuePadrao["responsavel"] = valuePadrao["secao"] = valuePadrao["dataLimite"] = 
           valuePadrao["JornadaAcesso"] = "";
           valuePadrao["sexo"] = "M";
           valuePadrao["codPessoa"] = 0;
           valuePadrao["locais"] = null; //select com checkbox não aceita ""
           valuePadrao["opcoesLocais"] = [0];
           valuePadrao["opcoesAcesso"] = [3];
           this.setState({valores: valuePadrao})
        }
    }

    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }

    handleChangeSelect(e, key){
        var newValue = this.state.valores;
        newValue[key] = e;
        this.setState({valores: newValue})
    }    

    handleChange(e){
        if(e.target.name === "validade"   || e.target.name === "nascimento" || 
           e.target.name === "dataInicio" || e.target.name === "dataFim" ){
            if(e.target.value.length > 10)
                return
        }
        else if (e.target.name.split('-')[0] === "dataLimite"){
            var key = e.target.name.split('-');
            this.state.valores["dataLimite"][key[1]] = e.target.value;
            this.setState({valores: this.state.valores})
            return;
        }

        this.state.valores[e.target.name] = e.target.value;
        this.setState({valores: this.state.valores})
    }

    handleBiometria(value){
        this.state.numeroBiometria += value + " , ";
        this.setState({
            numeroBiometria: this.state.numeroBiometria
        })
    }

    //MARK: ADD SECAO
    adicionaSecao(){
        this.state.valores["empresa"].push(null);
        this.state.valores["lotacao"].push(null);
        this.state.valores["secao"].push(null);
        this.state.valores["opcoesLocais"].push([]);
        this.state.valores["dataLimite"].push(null);
        this.setState({valores: this.state.valores});
    }

    //MARK: REMOVE SECAO
    removeSecao(index){
        this.state.valores["empresa"] = this.state.valores["empresa"].filter((element, ind) => ind !== index);
        this.state.valores["lotacao"] = this.state.valores["lotacao"].filter((element, ind) => ind !== index);
        this.state.valores["secao"] = this.state.valores["secao"].filter((element, ind) => ind !== index);
        this.state.valores["opcoesLocais"] = this.state.valores["opcoesLocais"].filter((element, ind) => ind !== index);
        this.state.valores["dataLimite"] = this.state.valores["dataLimite"].filter((element, ind) => ind !== index);
        this.setState({valores: this.state.valores});
    }
    
    //MARK: ADD RESPONSAVEL
    addResponsavel(){
        if(this.state.valores["tipoResponsavel"] !== undefined &&
            this.state.valores["responsavelParente"] !== undefined && this.state.valores["responsavelParente"].value !== undefined){

            this.state.responsaveis.push({codigo:this.state.valores["responsavelParente"].value, tipo:this.state.valores["tipoResponsavel"]})
            this.state.responsaveisTabela.push([this.state.valores["responsavelParente"].label, this.options("tipoResponsavel")[this.state.valores["tipoResponsavel"] - 1].label,
            <><i className="far fa-trash-alt ef-pulse-grow" style={{top:"0", marginLeft: "10px", color:"#E24E42", cursor:"pointer"}}
             onClick={() => this.excluiResponsavelNS(this.state.valores["responsavelParente"].value)}/></>
        ])
            this.setState({responsaveis: this.state.responsaveis, responsaveisTabela: this.state.responsaveisTabela, valores: this.state.valores})
            this.state.valores["tipoResponsavel"] = this.state.valores["responsavelParente"] = "";
        }
    }

    excluiResponsavelNS(value){
        const index = this.state.responsaveisTabela.findIndex((prop) => {return(prop === value)})
        this.state.responsaveisTabela = this.state.responsaveisTabela.filter((element, ind) => {
            return(ind !== index && ind !== index+1 && ind !== index+2)
        })
        this.setState({responsaveisTabela: this.state.responsaveisTabela})
    }

    //MARK: EXCLUI RESPONSAVEL
    excluiResponsavel(codRelacao){
        const body = {
            cmd: "excluiResponsavel",
            token: sessionStorage.getItem("token"),
            codigo: codRelacao
        }
        postAdonis(body, '/Autorizado/ExcluirResponsavel').then(data =>{
            if (data.retorno !== undefined){
                toast.success(data.mensagem, toastOptions);
                this.consultaAutorizado(this.state.valores["codPessoa"]);
            }
            else{
                toast.error(data.mensagem, toastOptions);
            }
        })
    }
    //MARK: Valida Campos
    validaCampos(){
        if(this.state.valores["senha"] !== this.state.valores["confirmeSenha"])
        {
            this.setState({steps: 3})
            return false
        }
    }

    //MARK: Funções Foto
    setRefPerfil = webcam => {
        this.webcamPerf = webcam;
    };

    setRefDocumento = webcam => {
        this.webcamDoc = webcam;
    };
 
    capturePerfil = () => {
        const imageSrc = this.webcamPerf.getScreenshot();
        this.state.fotoPerfil.push(imageSrc)
        this.setState({fotoPerfil: this.state.fotoPerfil})
        //console.log(imageSrc);
    };

    botaoNovaFoto(index){
        this.setState({statePage: index});
    }

    pesquisaPessoa (inputValue, callback) {
        if(inputValue.length > 2){
          clearInterval(this.state.timePost);
          this.state.timePost = setTimeout(() => {
            const body={
              cmd:"consultaPessoas",        
              qualquerparte: true,  
              nome: inputValue,
              resumo: true,
              token: sessionStorage.getItem("token"),
            }
            postAdonis(body, '/Autorizado/Index').then(lista =>{     
              if(lista.erro === undefined)
              {            
                
                if (lista.dados.length > 0){
                    var array = lista.dados.map((item) => {
                    return{value: item.CODPESSOA, label: item.NOME}
                    })
                }
                else
                    var array = [];
                callback(array);                   
              }                
              else
              {
                toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);                
              } 
            });
            //var teste = [{value:"1",label: "Bruno"}, {value:"10",label: "Andrade"}, {value:"100",label: "Almeida"}]
            //console.log(inputValue)
            
          }, 500);
        }    
      };
    //----------------------------------------------------------------------------------------//

    changeStep(pagina){
        for(var i = 0; i < this.state.quantidadeSteps; i++){
            this.state.corBotao[i] = "link"
        }
            
        this.state.corBotao[pagina] = "primary"
        
        this.setState({steps: pagina, corBotao: this.state.corBotao})   

    }


    handleChangeMulti(e, key){        
        if(e !== null){
            if(key === "categorias")
            this.state.valores["subCategorias"] = [];
    
            if(key === "tipoAutorizacao" && e === 2)
                this.setState({togglePreAutorizado: true})
            else if (key === "tipoAutorizacao")
                this.setState({togglePreAutorizado: false})

            if (key.split('-')[0] === "empresa"){
                this.state.valores['empresa'][key.split('-')[1]] = e;
                this.setState({valores: this.state.valores});
                return
            }
            else if (key.split('-')[0] === "lotacao"){
                this.state.valores['lotacao'][key.split('-')[1]] = e;
                this.setState({valores: this.state.valores});
                return
            }
            else if (key.split('-')[0] === "secao"){
                this.state.valores['secao'][key.split('-')[1]] = e;
                this.setState({valores: this.state.valores});
                return
            }
            else if (key.split('-')[0] === "opcoesLocais"){
                this.state.valores['opcoesLocais'][key.split('-')[1]] = e;
                this.setState({valores: this.state.valores});
                return
            }

            this.state.valores[key] = e; 
        }            
        else
            this.state.valores[key] = "";   
        
        this.setState({valores: this.state.valores});
    }

    //TODO: Salva Autorizado
    ///////////// Requisição Post que envia os dados para registro ///////////////////////////////////
    enviaCadastro(biometrico){        
        if(this.state.valores["nome"]===undefined || this.state.valores["nome"].length === 0){
            toast.dismiss();
            toast.warn(this.stringTranslate("Warning.CampoNome"), toastOptions);
            return;
        }

        var opcoes = [false,false,false,false,false,false,false,false,false,false,false];

        var opcoesLocais = [];
        for (var i = 0, j = this.state.valores["opcoesLocais"].length; i < j; i++){
            opcoesLocais.push([false, false, false]);
            this.state.valores["opcoesLocais"][i].forEach(prop => {console.log(prop); opcoesLocais[i][prop] = true })
        }
        this.state.valores["opcoesAcesso"].forEach(prop => { opcoes[prop] = true })


        const body={
            cmd:"incluirpessoa",
            nome: this.state.valores["nome"],
            codpessoa: this.state.valores["codPessoa"],
            sexo: this.state.valores["sexo"],
            cpf: cleanMask(this.state.valores["CPF"]),
            numerocnh: this.state.valores["cnh"],
            validadecnh: this.state.valores["validade"],
            datanascimento: this.state.valores["nascimento"],
            mae: this.state.valores["nomeMae"],
            telefone: this.state.valores["telefone"],
            email: this.state.valores["email"],
            endereco: this.state.valores["endereco"],
            observacao: this.state.valores["obs"],
            senha: this.state.valores["senha"],
            iButton: this.state.valores["iButton"],
            autorizasms: opcoes[9],
            naobriometrico: opcoes[10],
            disponiveloffline: opcoes[3],
            ignorarlimitedeacessos: opcoes[4],
            ignoratempominimoentreacesos: opcoes[5],
            permiteaberturafechamentodosistema: opcoes[6],
            personnongrata: opcoes[7],
            validarcartaosenha: opcoes[8],
            codcategoria: this.state.valores["categoria"] === " " ? null : this.state.valores["categoria"],
            matricula: this.state.valores["matricula"],
            pin : this.state.valores["pin"],
            tipoautorizacao: this.state.valores["tipoAutorizacao"],
            inicio: this.state.valores["dataInicio"],
            fim: this.state.valores["dataFim"],
            codresponsavel: this.state.valores["responsavel"].value,
            responsaveis: this.state.responsaveis,
            codsecao: this.state.valores["secao"],
            datalimitesecao: this.state.valores["dataLimite"],
            ehtitular: opcoesLocais.map((prop) => prop[1]),
            permiteautorizarvisita: opcoesLocais.map((prop) => prop[2]),
            codjornada: this.state.valores["JornadaAcesso"],
            listalocais: this.state.valores["locais"],
            fotos: {
                perfil: this.state.fotoPerfil,
                //Qualquer outro tipo: array
            },				
            token: sessionStorage.getItem("token")
        }
        postAdonis(body, '/Autorizado/Salvar').then(lista =>{

            if(lista.error !== undefined){   
                toast.dismiss();
                toast.error(this.stringTranslate("Erro.aoSalvarDados"), toastOptions);              
            }   
            else if(lista.retorno === false){
                toast.dismiss();
                toast.error(this.stringTranslate("Erro.aoSalvarDados"), toastOptions);     
            }                                
            else if(lista.retorno === true)
            {       
                toast.dismiss();     
                toast.success(this.stringTranslate("Sucesso.CadastroAutorizado"), toastOptions); 
                this.props.onclick("");    
            }
          
        });  
    }
    //MARK: Página de Dados Gerais
    step0(){
        return(
            <>
                <Row>
                    <Col md='8'>
                        <FormGroup>
                            <Label>{this.stringTranslate("Autorizado.Modal.Nome")}</Label>
                            <Input disabled={this.visualizar} type="text" value={this.state.valores["nome"]} id="nome" name="nome" onChange={e => this.handleChange(e)}/>                            
                        </FormGroup>
                    </Col>

                    <Col>
                        <FormGroup>
                            <Label>{this.stringTranslate("Autorizado.Modal.Sexo")}</Label>
                            <Select                         
                                style={{ width: '100%' }}
                                placeholder=""                          
                                size="large"    
                                onChange={e => this.handleChangeSelect(e, "sexo")}
                                value={this.state.valores["sexo"]}
                                allowClear={false}  
                                disabled={this.visualizar}
                            >                                  
                                {this.options("gender").map(prop => {
                                    return(
                                    <Option value={prop.value}> {prop.label}</Option> )
                                })}                                                                                                     
                            </Select>                            
                        </FormGroup>
                    </Col>
                </Row>


                <Row>                    
                    <Col md='5'>
                        <FormGroup>
                            <Label>{this.stringTranslate("Autorizado.Modal.CPF")}</Label>
                            <Input disabled={this.visualizar} type="text" name="CPF" value={this.state.valores["CPF"]} id="CPF" onChange={e => this.handleChange(e)} mask="999.999.999-99" maskChar={null} tag={InputMask}/>
                        </FormGroup>
                    </Col>

                    <Col md='4'>
                        <FormGroup>
                            <Label>{this.stringTranslate("Autorizado.Modal.CNH")}</Label>
                            <Input disabled={this.visualizar} type="text" name="cnh" value={this.state.valores["cnh"]} onChange={e => this.handleChange(e)} mask="999999999999" maskChar={null} tag={InputMask}/>
                        </FormGroup>
                    </Col>

                    <Col md='3'>
                        <FormGroup>
                            <Label>{this.stringTranslate("Autorizado.Modal.Validade")}</Label>
                            <Input disabled={this.visualizar} type="date" name="validade" value={this.state.valores["validade"]} onChange={(e) => this.handleChange(e)}/>
                        </FormGroup>
                    </Col>
                </Row>


                <Row>
                    <Col md='4'>
                        <FormGroup>
                            <Label>{this.stringTranslate("Autorizado.Modal.DataNascimento")}</Label>
                            <Input disabled={this.visualizar} type="date" onChange={e => this.handleChange(e)} value={this.state.valores["nascimento"]} name="nascimento" />
                        </FormGroup>
                    </Col>

                    <Col md='8'>
                        <FormGroup>
                            <Label>{this.stringTranslate("Autorizado.Modal.NomeMae")}</Label>
                            <Input disabled={this.visualizar} type="text" onChange={e => this.handleChange(e)} value={this.state.valores["nomeMae"]} name="nomeMae"/>
                        </FormGroup>
                    </Col>
                </Row>                

                <Row>
                    <Col>
                      <FormGroup> 
                      <Label for="categoria">{this.stringTranslate("Autorizado.Modal.Categoria")}</Label>  
                      <TreeSelect     
                        value= {this.state.valores["categoria"]}
                        onChange= {(value) => this.handleChangeSelect(value, "categoria")}
                        treeCheckable= {false}
                        searchPlaceholder= 'Selecione um Valor'
                        showSearch= {false}
                        size= "large"
                        style= {{ width: "100%", }}
                        dropdownStyle={{ maxHeight: 220, overflow: 'auto' }}
                        maxTagCount= {2} 
                        treeData={this.props.categorias}     
                        id="categoria"          
                        disabled={this.visualizar}   
                        />                        
                      </FormGroup>
                    </Col>                    
                  </Row>

                  <Row>                      
                      <Col>
                        <FormGroup>
                            <Label for="obs">{this.stringTranslate("Autorizado.Modal.Observacao")}</Label>                        
                            <Input disabled={this.visualizar} type="textarea" onChange={e => this.handleChange(e)} value={this.state.valores["obs"]} name="obs" id="obs"/>
                        </FormGroup>
                      </Col>
                  </Row>
            </>
        )
    }



    //MARK: Página de Contato / Acesso
    step1(){
        return(
            <>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label for="matricula">{this.stringTranslate("Autorizado.Modal.Matricula")}</Label>
                            <Input disabled={this.visualizar} type="text" onChange={e => this.handleChange(e)} value={this.state.valores["matricula"]} id="matricula" name="matricula"/>
                        </FormGroup>
                    </Col>

                    <Col>
                        <Form>
                            <FormGroup>
                                <Label for="pin">{this.stringTranslate("Autorizado.Modal.Pin")}</Label>
                                <Input disabled={this.visualizar} type="text" onChange={e => this.handleChange(e)} value={this.state.valores["pin"]} name="pin" id="pin"/>
                            </FormGroup>
                        </Form>
                    </Col>

                    {this.visualizar ? null : (
                    <Col md="4">
                        <FormGroup>
                            <Tooltip  placement="top" target="add" title="Desabilitado no Momento" overlayStyle={{fontSize: "12px"}}>
                            <Button block type="info" size="large" style={{top: "28px", marginBottom: "15px"}} >{this.stringTranslate("Botao.Cadastrar.Cartao")}</Button>
                            </Tooltip>
                        </FormGroup>
                    </Col>)}
                </Row>

                <Row>
                    <Col md='4'>
                        <FormGroup>
                            <Label for="telefone">{this.stringTranslate("Autorizado.Modal.Telefone")}</Label>
                            <Input disabled={this.visualizar} type="text" onChange={e => this.handleChange(e)} value={this.state.valores["telefone"]} id="telefone" name="telefone" mask="(99)9999-9999" maskChar={null} tag={InputMask}/>
                        </FormGroup>
                    </Col>

                    <Col md='8'>
                        <Form>
                            <FormGroup>
                                <Label for="email">{this.stringTranslate("Autorizado.Modal.Email")}</Label>
                                <Input disabled={this.visualizar} type="email" onChange={e => this.handleChange(e)} value={this.state.valores["email"]} name="email" id="email"/>
                            </FormGroup>
                        </Form>
                    </Col>
                </Row>

                <Row>
                        <Col>
                            <FormGroup>
                                <Label for="endereco">{this.stringTranslate("Autorizado.Modal.Endereco")}</Label>                        
                                <Input disabled={this.visualizar} type="textarea" onChange={e => this.handleChange(e)} value={this.state.valores["endereco"]} name="endereco" id="endereco" />
                            </FormGroup>
                        </Col>
                </Row>
            </>
        )
    }


    //MARK: Página de Autorizados
    step2(){
        // for(var i = 0, j = this.state.valores['secao'].length; i < j; i++){
        //     var num = ''+String(i);
        //     componente.push(
        //         <>
        //             <Row>
        //                 <Col md="4">
        //                 <FormGroup>
        //                     <Label>{this.stringTranslate("Autorizado.Modal.Empresa")}</Label>
        //                     <Select                         
        //                         style={{ width: '100%' }}
        //                         placeholder=""                          
        //                         size="large"    
        //                         defaultValue={this.state.valores["empresa"][i]}
        //                         onChange={(e) => {this.handleChangeMulti(e, "empresa-"+i); this.limpaValores(["lotacao-"+i, "secao-"+i])}}
        //                         allowClear={true}
        //                         disabled={this.visualizar}
        //                     >                                       
        //                         {this.options("empresas").map(prop => {
        //                             return(
        //                             <Option value={prop.value}> {prop.label}</Option> )
        //                         })}                                                                                                     
        //                     </Select> 
        //                 </FormGroup>
        //             </Col>

        //             <Col md="4">
        //                 <FormGroup>
        //                     <Label>{this.stringTranslate("Autorizado.Modal.Lotacao")}</Label>
        //                     <Select                         
        //                         style={{ width: '100%' }}
        //                         placeholder=""                          
        //                         size="large"    
        //                         defaultValue={this.state.valores["lotacao"][num]}
        //                         allowClear="true"
        //                         onChange={(e) => {this.handleChangeMulti(e, "lotacao-"+num); this.limpaValores(["secao-"+num])}}    
        //                         disabled={this.visualizar}
        //                     >                                     
        //                         {this.options("lotacao-"+num).map(prop => {
        //                             return(
        //                             <Option value={prop.value}> {prop.label}</Option> )
        //                         })}                                                                                                     
        //                     </Select> 
                            
        //                 </FormGroup>
        //             </Col>
        //             <Col md="4">
        //                 <FormGroup>
        //                     <Label>{this.stringTranslate("Autorizado.Modal.Secao")}</Label>                           
        //                     <Select                         
        //                         style={{ width: '100%' }}
        //                         placeholder=""                          
        //                         size="large"    
        //                         onChange={(e) => this.handleChangeMulti(e, "secao-"+i)}
        //                         value={this.state.valores["secao"][i]}
        //                         allowClear={true}  
        //                         disabled={this.visualizar}
        //                     >                                  
        //                         {this.options("secao-"+i).map(prop => {
        //                             return(
        //                             <Option value={prop.value}> {prop.label}</Option> )
        //                         })}                                                                                                     
        //                     </Select>     
        //                 </FormGroup>
        //             </Col>
        //         </Row>
        //         <Row>
        //             <Col>
        //                 <FormGroup>
        //                     <Label>{this.stringTranslate("Autorizado.Modal.opcoesLocais")}</Label>
        //                     <Select      
        //                         mode="multiple"                   
        //                         style={{ width: '100%' }}                        
        //                         placeholder=""                          
        //                         size="large"    
        //                         onChange={(e) => this.handleChangeMulti(e, "opcoesLocais-"+i)}
        //                         value={this.state.valores["opcoesLocais"][i]}
        //                         allowClear={true}  
        //                         disabled={this.visualizar}
        //                     >                                  
        //                         {this.options("opcoesLocais").map(prop => {
        //                             return(
        //                             <Option value={prop.value}> {prop.label}</Option> )
        //                         })}                                                                                                     
        //                     </Select>                              
        //                 </FormGroup>
        //             </Col>

        //             <Col md={4}>
        //                 <FormGroup>
        //                     <Label for="dataLimite">{this.stringTranslate("Autorizado.Modal.DataLimite")}</Label>
        //                     <Input
        //                         type="date"
        //                         name={"dataLimite-"+i}
        //                         id={"dataLimite-"+i}
        //                         value={this.state.valores["dataLimite"][i]}
        //                         onChange={e => this.handleChange(e)}
        //                         disabled={this.visualizar}
        //                         />
        //                 </FormGroup>
        //             </Col>
        //         </Row>
        //     </>
        //     )
        //}
        return(
            <>
                <Row>
                     <Col>
                        <FormGroup>
                            <Label for="tipoAutorizacao">{this.stringTranslate("Autorizado.Modal.tipoAutorizacao")}</Label>
                            <Select                         
                                style={{ width: '100%' }}
                                placeholder=""                          
                                size="large"    
                                onChange={(e) => this.handleChangeMulti(e, "tipoAutorizacao")}
                                value={this.state.valores["tipoAutorizacao"]}
                                allowClear={true}  
                                disabled={this.visualizar}
                            >                                  
                                {this.options("tipoAutorizacao").map(prop => {
                                    return(
                                    <Option value={prop.value}> {prop.label}</Option> )
                                })}                                                                                                     
                            </Select>                              
                        </FormGroup>
                    </Col>

                    <Col>
                        <FormGroup>
                            <Label>{this.stringTranslate("Autorizado.Modal.JornadaAcesso")}</Label>
                            <Select                         
                                style={{ width: '100%' }}
                                placeholder=""                          
                                size="large"    
                                onChange={(e) => this.handleChangeMulti(e, "JornadaAcesso")}
                                value={this.state.valores["JornadaAcesso"]}
                                allowClear={true}  
                                disabled={this.visualizar}
                            >                                  
                                {this.props.jornadas.map(prop => {
                                    return(
                                    <Option value={prop.value}> {prop.label}</Option> )
                                })}                                                                                                     
                            </Select>
                        </FormGroup>
                    </Col>
                </Row>

                {/* <Row>
                     <Col md="4">
                        <FormGroup>
                            <Label>{this.stringTranslate("Autorizado.Modal.Empresa")}</Label>
                            <Select                         
                                style={{ width: '100%' }}
                                placeholder=""                          
                                size="large"    
                                defaultValue={this.state.valores["empresa"]}
                                onChange={(e) => {this.handleChangeMulti(e, "empresa"); this.limpaValores(["lotacao", "secao"])}}
                                allowClear={true}
                                disabled={this.visualizar}
                            >                                       
                                {this.options("empresas").map(prop => {
                                    return(
                                    <Option value={prop.value}> {prop.label}</Option> )
                                })}                                                                                                     
                            </Select> 
                        </FormGroup>
                    </Col>

                    <Col md="4">
                        <FormGroup>
                            <Label>{this.stringTranslate("Autorizado.Modal.Lotacao")}</Label>
                            <Select                         
                                style={{ width: '100%' }}
                                placeholder=""                          
                                size="large"    
                                defaultValue={this.state.valores["lotacao"]}
                                allowClear="true"
                                onChange={(e) => {this.handleChangeMulti(e, "lotacao"); this.limpaValores(["secao"])}}    
                                disabled={this.visualizar}
                            >            
                                {console.log(this.state.valores["lotacao"])}                           
                                {this.options("lotacao").map(prop => {
                                    return(
                                    <Option value={prop.value}> {prop.label}</Option> )
                                })}                                                                                                     
                            </Select> 
                           
                        </FormGroup>
                    </Col>
                    <Col md="4">
                        <FormGroup>
                            <Label>{this.stringTranslate("Autorizado.Modal.Secao")}</Label>                           
                            <Select                         
                                style={{ width: '100%' }}
                                placeholder=""                          
                                size="large"    
                                onChange={(e) => this.handleChangeMulti(e, "secao")}
                                value={this.state.valores["secao"]}
                                allowClear={true}  
                                disabled={this.visualizar}
                            >                                  
                                {this.options("secao").map(prop => {
                                    return(
                                    <Option value={prop.value}> {prop.label}</Option> )
                                })}                                                                                                     
                            </Select>     
                        </FormGroup>
                    </Col>
                </Row> */}

                {this.state.valores['secao'].map((prop, i) =>{
                    return(
                        <>
                            <Row>
                                <Col md={11}>
                                    <Row>
                                        <Col md="4">
                                            <FormGroup>
                                                <Label>{this.stringTranslate("Autorizado.Modal.Empresa")}</Label>
                                                <Select                         
                                                    style={{ width: '100%' }}
                                                    placeholder=""                          
                                                    size="large"    
                                                    value={this.state.valores["empresa"][i]}
                                                    onChange={(e) => {this.handleChangeMulti(e, "empresa-"+i); this.limpaValores(["lotacao-"+i, "secao-"+i])}}
                                                    allowClear={true}
                                                    disabled={this.visualizar}
                                                >                                       
                                                    {this.options("empresas").map(prop => {
                                                        return(
                                                        <Option value={prop.value}> {prop.label}</Option> )
                                                    })}                                                                                                     
                                                </Select> 
                                            </FormGroup>
                                        </Col>

                                        <Col md="4">
                                            <FormGroup>
                                                <Label>{this.stringTranslate("Autorizado.Modal.Lotacao")}</Label>
                                                <Select                         
                                                    style={{ width: '100%' }}
                                                    placeholder=""                          
                                                    size="large"    
                                                    value={this.state.valores["lotacao"][i]}
                                                    allowClear="true"
                                                    onChange={(e) => {this.handleChangeMulti(e, "lotacao-"+i); this.limpaValores(["secao-"+i])}}    
                                                    disabled={this.visualizar}
                                                >                                     
                                                    {this.options("lotacao-"+i).map(prop => {
                                                        return(
                                                        <Option value={prop.value}> {prop.label}</Option> )
                                                    })}                                                                                                     
                                                </Select> 
                                                
                                            </FormGroup>
                                        </Col>
                                        <Col md="4">
                                            <FormGroup>
                                                <Label>{this.stringTranslate("Autorizado.Modal.Secao")}</Label>                           
                                                <Select                         
                                                    style={{ width: '100%' }}
                                                    placeholder=""                          
                                                    size="large"
                                                    value={this.state.valores["secao"][i]}  
                                                    allowClear={true}
                                                    onChange={(e) => this.handleChangeMulti(e, "secao-"+i)}
                                                    disabled={this.visualizar}
                                                >                                  
                                                    {this.options("secao-"+i).map(prop => {
                                                        return(
                                                        <Option value={prop.value}> {prop.label}</Option> )
                                                    })}                                                                                                     
                                                </Select>     
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={1}>
                                    {this.state.valores["secao"].length > 1 ? 
                                    <FormGroup>
                                        <Label style={{visibility:"hidden"}}>{"a"}</Label>
                                        <Tooltip  placement="top" target="add" title="Remover Secao" overlayStyle={{fontSize: "12px"}}>
                                            <Button type="danger" id="add" onClick={() => this.removeSecao(i)} size="sm"><i id="add" onClick={() => this.adicionaSecao()} className="tim-icons icon-simple-remove" style={{top:"-2px", color:"#fff",fontWeight:"bold", cursor:"pointer", fontSize:"10px"}} /></Button>
                                        </Tooltip> 
                                    </FormGroup> 
                                    : null}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label>{this.stringTranslate("Autorizado.Modal.opcoesLocais")}</Label>
                                        <Select      
                                            mode="multiple"                   
                                            style={{ width: '100%' }}                        
                                            placeholder=""                          
                                            size="large"    
                                            onChange={(e) => this.handleChangeMulti(e, "opcoesLocais-"+i)}
                                            value={this.state.valores["opcoesLocais"][i]}
                                            allowClear={true}  
                                            disabled={this.visualizar}
                                        >                                  
                                            {this.options("opcoesLocais").map(prop => {
                                                return(
                                                <Option value={prop.value}> {prop.label}</Option> )
                                            })}                                                                                                     
                                        </Select>                              
                                    </FormGroup>
                                </Col>

                                <Col md={4}>
                                    <FormGroup>
                                        <Label for="dataLimite">{this.stringTranslate("Autorizado.Modal.DataLimite")}</Label>
                                        <Input
                                            type="date"
                                            name={"dataLimite-"+i}
                                            id={"dataLimite-"+i}
                                            value={this.state.valores["dataLimite"][i]}
                                            onChange={e => this.handleChange(e)}
                                            disabled={this.visualizar}
                                            />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </>
                        )
                    })
                }
                <Row>
                    <Col>
                        <Tooltip  placement="top" target="add" title="Inserir Responsável" overlayStyle={{fontSize: "12px"}}>
                            <Button style={{float:"right"}} type="success" id="add" onClick={() => this.adicionaSecao()} size="sm"><i id="add" onClick={() => this.adicionaSecao()} className="tim-icons icon-simple-add" style={{top:"-2px", color:"#fff",fontWeight:"bold", cursor:"pointer", fontSize:"10px"}} /></Button>
                        </Tooltip> 
                    </Col>
                </Row>

                {/* <Row>
                    <Col>
                        <FormGroup>
                            <Label>{this.stringTranslate("Autorizado.Modal.opcoesLocais")}</Label>
                            <Select      
                                mode="multiple"                   
                                style={{ width: '100%' }}                        
                                placeholder=""                          
                                size="large"    
                                onChange={(e) => this.handleChangeMulti(e, "opcoesLocais")}
                                value={this.state.valores["opcoesLocais"]}
                                allowClear={true}  
                                disabled={this.visualizar}
                            >                                  
                                {this.options("opcoesLocais").map(prop => {
                                    return(
                                    <Option value={prop.value}> {prop.label}</Option> )
                                })}                                                                                                     
                            </Select>                              
                        </FormGroup>
                    </Col>

                    <Col md={4}>
                        <FormGroup>
                            <Label for="dataLimite">{this.stringTranslate("Autorizado.Modal.DataLimite")}</Label>
                            <Input
                                type="date"
                                name="dataLimite"         
                                id="dataLimite"                       
                                value={this.state.valores["dataLimite"]}      
                                onChange={e => this.handleChange(e)}    
                                disabled={this.visualizar}                    
                                />
                        </FormGroup>
                    </Col>
                </Row> */}

                <Collapse isOpen={this.state.togglePreAutorizado}>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label for="dataInicio">{this.stringTranslate("Autorizado.Modal.DataInicio")}</Label>
                                <Input
                                    type="date"
                                    name="dataInicio"                                
                                    id="dataInicio"                       
                                    value={this.state.valores["dataInicio"]}      
                                    onChange={e => this.handleChange(e)}       
                                    disabled={this.visualizar}                       
                                    />
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Label for="dataFim">{this.stringTranslate("Autorizado.Modal.DataFim")}</Label>
                                <Input
                                    type="date"
                                    name="dataFim"                                
                                    id="dataFim"                       
                                    value={this.state.valores["dataFim"]}      
                                    onChange={e => this.handleChange(e)}      
                                    disabled={this.visualizar}                         
                                    />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>                      
                                <Label>{this.stringTranslate("Autorizado.Modal.Responsavel")}</Label>    
                                <AsyncSelect
                                    cacheOptions
                                    loadOptions={this.pesquisaPessoa}
                                    onChange={(e) => this.handleChangeMulti(e, "responsavel")}
                                    isLoading={true}
                                    isClearable={true}
                                    value={this.state.valores["responsavel"]}
                                    placeholder=""
                                    disabled={this.visualizar}
                                    />                                               
                            </FormGroup>
                        </Col>
                    </Row>
                </Collapse>
            </>
        )
    }


    //MARK: Controle de Acesso
    step3(){
        return(
            <>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label>{this.stringTranslate("Autorizado.Modal.LocaisPermitidos")}</Label>                         
                            <TreeSelect                                 
                                value= {this.state.valores["locais"]}
                                onChange= {(value) => this.handleChangeSelect(value, "locais")}
                                treeCheckable= {true}
                                searchPlaceholder= 'Selecione um Valor'
                                showSearch= {false}
                                size= "large"
                                style= {{ width: "100%", }}
                                dropdownStyle={{ maxHeight: 220, overflow: 'auto' }}
                                maxTagCount= {2} 
                               // treeData={this.state.valores["listaLocais"]}
                                treeData={this.options("locais")}      
                                disabled={this.visualizar}               
                            />
                        </FormGroup>
                    </Col>
                    {this.visualizar === true ? null : (
                        <>
                    <Col md="2" style={{paddingRight: "5px"}}>
                        <Button  block size="large" color="warning" style={{marginTop: "32px"}} onClick={() => {this.state.valores["locais"] = null; this.setState({valores: this.state.valores})}}>{this.stringTranslate("Botao.Nenhum")}</Button>
                    </Col>
                    <Col md="2" style={{paddingLeft: "5px"}}>
                        <Button block size="large" type="info" style={{marginTop: "32px"}} onClick={() => {
                        var newValue = this.state.valores;
                        newValue["locais"] = []; 
                        this.options("locais").forEach((prop) => {
                        newValue["locais"].push(prop.value)}); 
                        this.setState({valores: newValue})}}
                        >
                        {this.stringTranslate("Botao.Todos")}</Button>
                    </Col>
                    </>)}
                </Row>


                <Row>
                    <Col md="4">
                        <FormGroup>
                            <Label>{this.stringTranslate("Autorizado.Modal.Senha")}</Label>
                            <Input disabled={this.visualizar} type="password" id="senhaCadastro" name="senhaCadastro" onChange={e => this.handleChange(e)}/>
                        </FormGroup>
                    </Col>
                    <Col md="4">
                        <FormGroup>
                            <Label>{this.stringTranslate("Autorizado.Modal.ConfirmeSenha")}</Label>
                            <Input disabled={this.visualizar} type="password" id="confirmeSenhaCadastro" name="confirmeSenhaCadastro" onChange={e => this.handleChange(e)} invalid={this.state.valores["confirmeSenhaCadastro"] !== this.state.valores["senhaCadastro"] ? true : false}/>
                            {this.state.valores["confirmeSenhaCadastro"] !== this.state.valores["senhaCadastro"] ? <FormFeedback tooltip>{this.stringTranslate("Autorizado.Modal.ConfirmeSenhaError")}</FormFeedback> : null}
                        </FormGroup>
                    </Col>
                    <Col md="4">
                        <FormGroup>
                            <Label>{this.stringTranslate("Autorizado.Modal.iButton")}</Label>
                            <Input disabled={this.visualizar} type="text" id="iButton" name="iButton" onChange={e => this.handleChange(e)}/>
                        </FormGroup>
                    </Col>
                </Row>


                <Row>
                    <Col>
                        <FormGroup>
                            <Label>{this.stringTranslate("Autorizado.Modal.OpcoesDeAcesso")}</Label>
                            <Select                        
                                mode="multiple" 
                                style={{ width: '100%' }}
                                placeholder={this.stringTranslate("Select.Nenhum")}                            
                                size="large"    
                                onChange={(e) => this.handleChangeMulti(e, "opcoesAcesso")}
                                value={this.state.valores["opcoesAcesso"]}
                                allowClear={true} 
                                disabled={this.visualizar} 
                            >                                  
                                {this.options("controleDeAcesso").map(prop => {
                                    return(
                                    <Option value={prop.value}> {prop.label}</Option> )
                                })}                                                                                                     
                            </Select>                             
                        </FormGroup>
                    </Col>
                    {this.visualizar ? null : (
                    <Col md="4" style={{paddingTop:"28px"}}>                        
                        <ModalCadastroBiometrico id={0} handleBiometria={this.handleBiometria} cadastrarPessoa={this.enviaCadastro} pessoa={this.state.valores} />                        
                    </Col>)}
                </Row>
                            

                <Row>
                    <Col>
                        <Table style={{marginTop: "10px"}}>
                            <thead>
                                <tr>
                                <th style={{width:"15px"}}>#</th>
                                <th style={{minWidth:"60%"}}>{this.stringTranslate("Autorizado.Modal.Responsavel")}</th>
                                <th style={{minWidth:"30%"}}>{this.stringTranslate("Autorizado.Modal.TipoResponsavel")}</th>
                                <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.responsaveisTabela.map((prop, key) => {
                                    return(
                                        <tr>
                                            <th scope="row">{key+1}</th>
                                            <td>{prop[0]}</td>
                                            <td>{prop[1]}</td>
                                            <td>{prop[2]}</td>
                                            <td></td>
                                        </tr>
                                    )
                                })}
                                {this.visualizar ? null : (
                                <tr>
                                    <th scope="row">{this.state.responsaveisTabela.length + 1}</th>
                                    <td><AsyncSelect
                                            cacheOptions
                                            loadOptions={this.pesquisaPessoa}
                                            onChange={(e) => this.handleChangeMulti(e, "responsavelParente")}
                                            isLoading={true}
                                            isClearable={true}
                                            value={this.state.valores["responsavelParente"]}
                                            placeholder=""
                                        />
                                    </td>
                                    <td>
                                         <Select                         
                                            style={{ width: '100%' }}
                                            placeholder={this.stringTranslate("Select.Nenhum")}                           
                                            size="large"    
                                            onChange={(e) => this.handleChangeMulti(e, "tipoResponsavel")}
                                            value={this.state.valores["tipoResponsavel"]}
                                            allowClear={true}  
                                        >                                  
                                            {this.options("tipoResponsavel").map(prop => {
                                                return(
                                                <Option value={prop.value}> {prop.label}</Option> )
                                            })}                                                                                                     
                                        </Select>  
                                    </td>  
                                    <td>
                                        <Tooltip  placement="top" target="add" title="Inserir Responsável" overlayStyle={{fontSize: "12px"}}>
                                        <Button type="success" id="add" onClick={() => this.addResponsavel()} size="sm"><i id="add" onClick={() => this.addResponsavel()} className="tim-icons icon-simple-add" style={{top:"-2px", color:"#fff",fontWeight:"bold", cursor:"pointer", fontSize:"10px"}} /></Button>
                                        </Tooltip>    
                                    </td>
                                </tr>  )}                                   
                            </tbody>
                        </Table>        
                    </Col>    
                </Row>
            </>
        )
    }

    getBase64(file) {
        return new Promise((resolve, reject) => {
            const Compressor = new Compress ();
            Compressor.compress([file], {
                quality: 0.6,
                maxWidth: 1024,
                maxHeight: 700,
            }).then((result) =>{
                resolve(result[0].prefix + result[0].data); 
            }).catch((e)=> {
                reject(e.message);
            });
        })
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      }


    async handlePreview(file) {
        file.preview = await this.getBase64(file);
        this.state.fotoPerfil = [];
        this.state.fotoPerfil.push(file.url || file.preview)
        this.setState({
            fotoPerfil: this.state.fotoPerfil,
        });
      };

    //MARK: Fotos
    step4(){
        const videoConstraints = {
            width: 300,
            height: 700,
            facingMode: "user"
          };
        
        return(
            <div style={{marginTop: "20px"}}>
            {this.state.statePage === "index" ? ( <>
                {/* PAGINA INICIAL DO MODAL */}                    
                <Row>
                    <Col align="center">                       
                        <img
                            height="300px"
                            alt="..."
                            className="border-gray"
                            src={this.state.fotoPerfil.length === 0 ? require("../../assets/img/default-avatar.png") : this.state.fotoPerfil[0]}
                        />
                        
                    </Col>
                    {this.visualizar ? null : (
                    <Col md="3" align="center" style={{borderLeft: "solid 1px #e8e6e6"}}>
                        <Row>
                            <Col md="12"> 
                                <FormGroup>
                                    <Button color="info" onClick={(event) => this.botaoNovaFoto("perfil")}><Icon type="camera" /> {this.stringTranslate("Botao.Capturar")} </Button>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>     
                            <Col md="12"> 
                                <FormGroup>                
                                    <Upload name='foto' fileList={false} action={(file) => this.handlePreview(file)} className="avatar-uploader">
                                        <Button style={{minWidth:"100%"}} color="import"><Icon type="upload" /> {this.stringTranslate("Botao.Importar")} </Button>
                                    </Upload>
                                </FormGroup>
                            </Col> 
                        </Row>
                    </Col>)}
                </Row>
                </>) : this.state.statePage === "perfil" ? (<>
                {/* PAGINA DE CADASTRO FOTO PERFIL */}                    
                <Row>
                    <Col>
                        {this.state.fotoPerfil.length === 0 ? (<Webcam
                            audio={false}
                            ref={this.setRefPerfil}
                            screenshotFormat="image/png"
                            videoConstraints={videoConstraints}
                            style={{width:"100%", margin: "15px"}}
                        />) : (
                            <img
                                alt="..."
                                className="border-gray"
                                style={{width:"100%", margin: "15px"}}
                                src={this.state.fotoPerfil[0]}
                            />
                        )}
                    </Col>                                           
                    {this.state.fotoPerfil.length === 0 ? (<>
                    <Col md="3" align="center" style={{borderLeft: "solid 1px #e8e6e6"}}>
                        <Row>
                            <Button size="sm" block color="info" onClick={(event) => this.capturePerfil("perfil")}>{this.stringTranslate("Botao.TirarFoto")}</Button>
                        </Row>
                        <Row>                       
                            <Button size="sm" block color="secondary" onClick={(event) => this.botaoNovaFoto("index")}>{this.stringTranslate("Botao.Cancelar")}</Button>
                        </Row>
                    </Col>  
                    </>) : (
                        <Col md="3" align="center" style={{borderLeft: "solid 1px #e8e6e6"}}>
                            <Row>                       
                                <Button size="sm" block color="success" onClick={(event) => {this.setState({statePage: "index"})}}>{this.stringTranslate("Botao.Salvar")}</Button>
                            </Row>
                            <Row>                       
                                <Button size="sm" block color="danger" onClick={(event) => {this.setState({fotoPerfil:[]})}}>{this.stringTranslate("Botao.Excluir")}</Button>
                            </Row>
                            <Row>
                                <Button size="sm" block color="secondary" onClick={(event) => {this.setState({statePage: "index", fotoPerfil:[]})}}>
                                {this.stringTranslate("Botao.Cancelar")}
                                </Button>
                            </Row>                                                        
                        </Col>  
                    )}
                    
                </Row>
                </>
                ) : ( {/* CADASTRAR OUTRA FOTO*/} )}
            </div>
        )
    }





    //MARK: Opções do Select-React
    options(index){
        var valor;
        var nIndex = index.split('-').length > 1 ? index.split('-')[0] : index;
        switch (nIndex){
            case "gender":
                return [
                    { value: "M",     label: this.stringTranslate("Select.Masculino") },
                    { value: "F",     label: this.stringTranslate("Select.Feminino")  }
                ]


            case "opcoesLocais":
                return [
                    { value: 0,     label: this.stringTranslate("Select.Padrao") },
                    { value: 1,     label: this.stringTranslate("Select.TitularLocal")  },
                    { value: 2,     label: this.stringTranslate("Select.PermiteVisita")  }
                ]


            case "controleDeAcesso":
                return[
                    { value: 3,     label: this.stringTranslate("Select.DisponivelOffline")         },
                    { value: 4,     label: this.stringTranslate("Select.IgnoraLimiteAcesso")        },
                    { value: 5,     label: this.stringTranslate("Select.IgnoraTempoEntreAcessos")   },
                    { value: 6,     label: this.stringTranslate("Select.PermiteAberturaFechamento") },
                    { value: 7,     label: this.stringTranslate("Select.PersonaNonGrata")           },
                    { value: 8,     label: this.stringTranslate("Select.ValidarCartaoSenha")        },
                    { value: 9,     label: this.stringTranslate("Select.AutorizaSMS")               },
                    { value: 10,     label: this.stringTranslate("Select.NaoBiometrico")             }
                ]


            case "tipoAutorizacao":
                return[
                    { value: 1,     label: this.stringTranslate("Select.PermanenteResidente")       },
                    { value: 2,     label: this.stringTranslate("Select.ComPrazoPreAutorizado")     },
                    { value: 3,     label: this.stringTranslate("Select.Visitante")                 },
                    { value: 4,     label: this.stringTranslate("Select.ExternoPermanente")         },
                    { value: 5,     label: this.stringTranslate("Select.Desativado")                }      
                ]


            case "tecnologia":
                return[
                    { value: 1,     label: this.stringTranslate(".Select.DesconhecidaQualquer"),    },
                    { value: 2,     label: this.stringTranslate("Select.Mifare")                    },
                    { value: 3,     label: this.stringTranslate("Select.RFID")                      },
                    { value: 4,     label: this.stringTranslate("Select.CodBarra")                  },
                    { value: 5,     label: this.stringTranslate("Select.ControleRemoto")            }
                ]
            

            case "tipoResponsavel":
                return[
                    { value: 1,     label: this.stringTranslate("Select.Pai"),                  },
                    { value: 2,     label: this.stringTranslate("Select.Mae")                   },
                    { value: 3,     label: this.stringTranslate("Select.Primo")                 },
                    { value: 4,     label: this.stringTranslate("Select.Irmao")                 },
                    { value: 5,     label: this.stringTranslate("Select.Tio")                   },
                    { value: 6,     label: this.stringTranslate("Select.Baba")                  },
                    { value: 7,     label: this.stringTranslate("Select.Filho")                 },
                    { value: 8,     label: this.stringTranslate("Select.ResponsavelJuridico")   },
                    { value: 9,     label: this.stringTranslate("Select.Conjuge")               },
                    { value: 10,    label: this.stringTranslate("Select.Genro")                 },
                    { value: 11,    label: this.stringTranslate("Select.Enteado")               },
                    { value: 12,    label: this.stringTranslate("Select.Sogro")                 },
                    { value: 13,    label: this.stringTranslate("Select.Outros")                }
                ]
            

            case "locais":
                var locaisAcesso = this.props.locaisAcesso;
                const locais = locaisAcesso.map((prop, key) => {                    
                    return{value:prop[0],label:prop[1]}
                })
        
                return locais;
            

            case "empresas":
                valor = this.props.empresa;                
                const empresas = valor.map((prop, key) => {                    
                    return{value:prop[0],label:prop[1]}
                })
            return empresas;
   


            case "lotacao":
                var ind = index.split('-')[1];
                valor = this.props.lotacao;
                if(this.state.valores["empresa"] !== undefined && this.state.valores["empresa"][ind] !== null){
                    var lotacao = [];
                    valor.forEach((prop) => {
                        if(prop[2] === this.state.valores["empresa"][ind]){
                            lotacao.push({value:prop[0],label:prop[1]})
                        }
                    })                                      
                }
                else
                     return [{label: this.stringTranslate("Autorizado.Modal.SelecioneUmaEmpresa"), isDisabled: true}]
            return lotacao;

            case "secao":
                var ind = index.split('-')[1];
                valor = this.props.secao;
                if(this.state.valores["lotacao"] !== undefined && this.state.valores["lotacao"][ind] !== null){
                    var secao = [];

                    valor.forEach((prop) => {
                        if(prop[2] === this.state.valores["lotacao"][ind]){
                            secao.push({value:prop[0],label:prop[1]})
                        }
                    }) 
                    return secao;
                }
                else
                    return [{label: this.stringTranslate("Autorizado.Modal.SelecioneUmaLotacao"), isDisabled: true}]
            
            default:

            break;
        }
    }




    render(){   
        return(
        <>                   
            <Modal fade isOpen={this.props.modal} size="lg" style={{minHeight: "700px", marginTop: "-130px", minWidth: "70%"}}>
            <ModalHeader toggle={() =>this.props.onclick("")}><h4>{this.props.statusModal} {this.stringTranslate("Autorizado.Modal.Titulo")}</h4>            
            </ModalHeader>
                <ModalBody style={{paddingTop: "0px", minHeight: "480px"}}> 
                <div style={{textAlign: "center"}}>
                    <Button type={this.state.corBotao[0]} shape="round" size="sm" style={{borderRadius: "50px"}} onClick={() => this.changeStep(0)}>{this.stringTranslate("Autorizado.Modal.Aba1")}</Button> 
                    <Button type={this.state.corBotao[1]} shape="round" size="sm" style={{borderRadius: "50px"}} onClick={() => this.changeStep(1)}>{this.stringTranslate("Autorizado.Modal.Aba2")}</Button> 
                    <Button type={this.state.corBotao[2]} shape="round" size="sm" style={{borderRadius: "50px"}} onClick={() => this.changeStep(2)}>{this.stringTranslate("Autorizado.Modal.Aba3")}</Button>  
                    <Button type={this.state.corBotao[3]} shape="round" size="sm" style={{borderRadius: "50px"}} onClick={() => this.changeStep(3)}>{this.stringTranslate("Autorizado.Modal.Aba4")}</Button> 
                    <Button type={this.state.corBotao[4]} shape="round" size="sm" style={{borderRadius: "50px"}} onClick={() => this.changeStep(4)}>{this.stringTranslate("Autorizado.Modal.Aba5")}</Button> 
                </div>
                    {this.state.steps === 0 ? (this.step0()) :
                     this.state.steps === 1 ? (this.step1()) :
                     this.state.steps === 2 ? (this.step2()) :
                     this.state.steps === 3 ? (this.step3()) : 
                    (this.step4())}
                </ModalBody>
                <ModalFooter>
                    {this.state.steps !== 0 ? (<Button type="warning" style={{width: "100px"}} onClick={() => this.changeStep(this.state.steps-1)}><Icon type="left" /> {this.stringTranslate("Botao.Voltar")}</Button>) : null}
                    {this.state.steps < this.state.quantidadeSteps - 1 ? (<Button type="info" style={{width: "100px"}} onClick={() => this.changeStep(this.state.steps+1)}>{this.stringTranslate("Botao.Avancar")} <Icon type="right" /></Button>) : null}
                    {this.state.steps === this.state.quantidadeSteps - 1 ?  this.visualizar === true ? (<Button type="danger" style={{width: "100px"}} onClick={() =>this.props.onclick("")}>{this.stringTranslate("Botao.Fechar")} <Icon type="close-circle" /></Button>) : (<Button type="primary" style={{width: "100px"}} onClick={this.enviaCadastro}>{this.stringTranslate("Botao.Gravar")} <Icon type="save" /></Button>) : null}
                </ModalFooter>
            </Modal>
        </>
        );
    };
  }
  export default injectIntl(ModalCadastro);