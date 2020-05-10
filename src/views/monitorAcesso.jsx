import {
  CardImg,
  Card,
  CardHeader,
  CardBody,
  //CardFooter,
  Row,
  Col,
  InputGroupAddon,
  InputGroup,
  InputGroupText,
  Input
} from "reactstrap";
import {Table} from "antd";
import React from "react";

// reactstrap components
// core components

//TabelaAcesso
import TabelaAcesso from "components/Table/TabelaAcesso.jsx";
//CardVisitantes
import CardVisitantes from "components/CardVisitantes/CardVisitantes.jsx";
import { post,postAdonis } from "utils/api.js";
import { toast, Slide } from 'react-toastify';
import { pegaData, pegahorario,pegaDataHora  } from "components/dataHora.jsx"

//Modal de busca de placa
import ModalBuscaPlaca from "components/Modal/ModalBuscaPlaca";
import { injectIntl } from "react-intl";

var foto="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";

// let array =[{foto:foto,NomePessoa:"",DataHora:""}];
const capitalize = (s) => {
  if (typeof s !== 'string') return ''

  var array = s.split(" ");
  var string = "";
  array.forEach(element => {
    string += element.charAt(0).toUpperCase() + element.slice(1) + " "
  });

  return string
}

let array;
var timer;
class MonitorAcesso extends React.Component {
    constructor(props) {
    super(props);

    this.state = {
      headTable: [{title:this.stringTranslate("Monitor.tabela.head.data"), dataIndex: "DataHora" ,key: "DataHora" }, 
              //    {title:this.stringTranslate("Monitor.tabela.head.hora"),    dataIndex: "hora",key: "hora" },
                  {title:this.stringTranslate("Monitor.tabela.head.nome"),  dataIndex: "nomePessoa",key: "nomePessoa" },
                  {title: this.stringTranslate("Monitor.tabela.head.ES"), dataIndex: "Direcao" ,key: "Direcao" },
                  {title:this.stringTranslate("Monitor.tabela.head.dest"),dataIndex: "nomeSecaoDestino",key: "nomeSecaoDestino" },
                  {title:this.stringTranslate("Monitor.tabela.head.coletor"), dataIndex: "Numero",key: "Numero" },
                  {title:this.stringTranslate("Monitor.tabela.head.visitou"), dataIndex: "nomePessoaContato",key: "nomePessoaContato" },
                  {title:this.stringTranslate("Monitor.tabela.head.placa"),dataIndex: "acessoExtraPlaca",key: "acessoExtraPlaca" },
                  {title:this.stringTranslate("Monitor.tabela.head.modelo"),dataIndex: "acessoExtraModelo",key: "acessoExtraModelo" }], //Cabeçário da tabela de monitoramento
      tableDados:[], //Objeto com informações para preencher a tabela de monitoramento
      placa:'',   
       
      ultimoAcesso: undefined,
    };
    this.chegouNovo = false;
    this.statusConsulta = false;
    this.handleChangePlaca = this.handleChangePlaca.bind(this);
    this.solicitaAcessosMonitoramento = this.solicitaAcessosMonitoramento.bind(this);
    this.solicitaAcessosMonitoramento();       
    this.novo = this.novo.bind(this);
    //Atualiza cabeçalho da tabela pelo idioma
    this.atualizaCabecalho = this.atualizaCabecalho.bind(this);

    //Traduz as strings
    this.stringTranslate = this.stringTranslate.bind(this);
  }

  stringTranslate(id){
    return this.props.intl.formatMessage({id: id});
  }

  atualizaCabecalho(){
    this.setState({
      headTable: [this.stringTranslate("Monitor.tabela.head.data"), 
      this.stringTranslate("Monitor.tabela.head.hora"), 
      this.stringTranslate("Monitor.tabela.head.nome"), 
      this.stringTranslate("Monitor.tabela.head.ES"), 
      this.stringTranslate("Monitor.tabela.head.dest"),
      this.stringTranslate("Monitor.tabela.head.coletor"), 
      this.stringTranslate("Monitor.tabela.head.visitou"), 
      this.stringTranslate("Monitor.tabela.head.placa"),
      this.stringTranslate("Monitor.tabela.head.modelo")]
    });
  }

  componentWillMount(){
    timer = setInterval(this.solicitaAcessosMonitoramento, 5000);
  }

  componentDidUpdate(){
   // if (this.state.headTable[0] !== this.stringTranslate("Monitor.tabela.head.data"))
   //   this.atualizaCabecalho();
  }

  novo(){    
    if(this.chegouNovo === true){
      this.chegouNovo = false;
      return true;
    }
    else{
      return false;
    }            
  }

  componentWillUnmount(){
    clearInterval(timer);
  }

  // Request Posta para pegar informações da tabela
  solicitaAcessosMonitoramento() {    
    if(this.statusConsulta === false)
    {
      this.statusConsulta = true;
      var ultimoCodigo = this.state.tableDados[0];
      const body={
        cmd: "consultaacesso",
        ultimocodigo: ultimoCodigo === undefined ? 0 : ultimoCodigo["CodigoAcesso"],
        token: sessionStorage.getItem("token"),
        id: navigator.productSub,
      };
      var narray;
      postAdonis(body,'/Portaria/Monitor/ConsultaAcessos').then(data => {
    //    post(body).then(data => {
        if(data.error === undefined)
        {
          const dados= data.dados;
          if(dados !== undefined){
          array = dados;

          if(array.length > 0)
            this.chegouNovo = true;
            narray=dados
          //  narray= array.map((item) =>{                                      
          // //   var nomePessoa = item.NomePessoa !== undefined ? item.NomePessoa.toLowerCase() : "";
          // //   var nomeSecaoDestino = item.NomeSecaoDestino !== undefined ? item.NomeSecaoDestino.toLowerCase() : "";
          // //   var nomePessoaContato = item.NomePessoaContato !== undefined ? item.NomePessoaContato.toLowerCase() : "";
          // //   var acessoExtraModelo = item.AcessoExtra !== undefined && item.ExtraModelo !== undefined ? item.ExtraModelo.toLowerCase() : "";
          // //   var acessoExtraPlaca = item.AcessoExtra !== undefined && item.ExtraPlaca !== undefined ? item.ExtraPlaca.toUpperCase() : "";
              
          //     // if ((item.AcessoExtra != undefined) || (item.AcessoExtra != null)){
          //       return [item]
          //     // return [item.CodigoAcesso,item.CodigoPessoa,item.Foto,pegaData(item.DataHora), pegahorario(item.DataHora), capitalize(item.nomePessoa), 
          //     //         this.stringTranslate("Direcao."+item.Direcao), item.nomeSecaoDestino,item.Numero,item.nomePessoaContato, item.acessoExtraPlaca,item.acessoExtraModelo];
          //     // // }
          //     // else return [item.CodigoPessoa,pegaData(item.DataHora), pegahorario(item.DataHora), item.NomePessoa, item.Direcao, item.NomeSecaoDestino,item.NomeColetor,item.NomePessoaContato,"","",""];
              
          //   });
          console.log(narray )
            if(data.retorno !== false){             
                Array.prototype.push.apply(narray,this.state.tableDados);
            }
            this.setState({tableDados:narray});
            this.setState({ultimoAcesso: narray[0]});
          }
          
          
        }                
        else
        {/*
          toast.error("Sem comunicação!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true
            });*/
        }   

        this.statusConsulta = false;
        data= null;
      });
    }
  }


  
  handleChangePlaca(e) {
    const token = sessionStorage.getItem("token")
    if(e.target.value.length > 7){
      toast.warn(this.stringTranslate("Monitor.toast.maxCaracter"), {
        transition: Slide,
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        });
        document.getElementById("entrada").value = this.state.placa;
        return;
    }
    if (token !== "" && token !== null){
      this.setState({placa:e.target.value});
    }
    else{
        toast.warn(this.stringTranslate("Monitor.toast.naoLogado"), {
            transition: Slide,
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
        });
    }
  }


  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  render() {
    const {ultimoAcesso} = this.state;
    return (
        <>        
        <div className="content">
          <Row>
            <Col md="8">
              <Card className="card-chart">
                <CardHeader tag="h4">
                 {this.stringTranslate("Monitor.card.ultimoAcesso")}
                </CardHeader>
                <CardBody style={{paddingLeft:"15px"}}>
                <Row>
     
                  {ultimoAcesso !== undefined ? (
                    <>
                  <Col xs="3">
              
                  {ultimoAcesso!== undefined && ultimoAcesso[2]!== undefined ? (
               
                     <img
                      height="150px"
                        alt="..."
                        className="border-gray"
                        src={"data:image/jpeg;base64, "+ ultimoAcesso[2]}
                      />
                  ):(
                    <img
                      height="150px"
                        alt="..."
                        className="border-gray"
                        src={require("../assets/img/default-avatar.png")}
                      />
              
                  )
                  
                  }
              
                  </Col>
                  <Col xs="9">
                      {console.log(ultimoAcesso)}
                      <h4 className="title">{ ultimoAcesso[5]}</h4>

                    {/* <p className="description">{this.stringTranslate("Monitor.modalNeo.registro")+": "+ultimoAcesso[0]}</p> */}
                    <p>{this.stringTranslate("Monitor.modalNeo.ultimoAcesso")+": "+ultimoAcesso['nomePessoa']}</p>
                    <p>{this.stringTranslate("Monitor.modalNeo.ultimoAcesso")+": "+ultimoAcesso['DataHora']}</p>
                    <p>{this.stringTranslate("Monitor.modalNeo.direcao")+": "+this.stringTranslate("Direcao."+ultimoAcesso['Direcao'])}</p>
                    <p>{this.stringTranslate("Monitor.modalNeo.coletor")+": "+ultimoAcesso['Numero']}</p>

                    {/* <p className="description">CPF: 017.488.955-08 </p> */}
                  </Col>
                  </>
                  ): (
                  <>
                  <Col xs="3">
                      
                          
                      <img
                      height="150px"
                        alt="..."
                        className="border-gray"
                        src={require("../assets/img/default-avatar.png")}
                      />
              
                  </Col>
                  <Col xs="9">
                      
                      <h5 className="title">{}</h5>

                    <p className="description">{}</p>
                    {/* <p className="description">CPF: 017.488.955-08 </p> */}
                  </Col>
                  </>
                  ) } 
                </Row>

                </CardBody>
              </Card>
              <Card className="card-info">
              <CardHeader tag="h4">{this.stringTranslate("Monitor.card.saidaVeiculos")}:        
                </CardHeader>
                <CardBody style={{paddingBottom: "5px"}}>

                <Row>
                 
                  <Col>
                      <InputGroup >
                      <InputGroupAddon addonType="prepend">
                          <InputGroupText  style={{padding: "10px 37px 10px 5px"}} ><i style={{marginRight: "5px", marginLeft: "5px"}} className="fas fa-car"> {this.stringTranslate("Monitor.card.placa")}: </i></InputGroupText>                       
                          </InputGroupAddon>
                              <Input type='text' 
                              name="entrada" 
                              id="entrada" 
                              onChange={this.handleChangePlaca} 
                               
                          />       
                      </InputGroup>   
                    </Col>
                   <Col md="4">                      
                      <ModalBuscaPlaca placa={this.state.placa} /> 
                   </Col>
                   </Row>
                    </CardBody>             
                </Card>
            </Col>
            <CardVisitantes novo={this.novo}/>
          </Row>
          <Row>
          <Col md="12">
          <Card className="card-info">
          <Table columns={this.state.headTable}  size="small" loading={this.state.loading} dataSource={this.state.tableDados} scroll={{x: "500px"}} pagination={{showSizeChanger:true,size:"small",pageSizeOptions:["5","10","15","20"], hideOnSinglePage: true, itemRender:this.itemRender}} />
          </Card>
          {/* <TabelaAcesso
              tableHead={this.state.headTable}
              tableData={this.state.tableDados}              
          /> */}
          </Col>  
          </Row>
        </div>
        </>
    );
  }
}

export default injectIntl(MonitorAcesso);