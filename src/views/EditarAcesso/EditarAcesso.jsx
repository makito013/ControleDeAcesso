import React from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Col, Row 
} from "reactstrap";
import { FormGroup, Label,  } from 'reactstrap';
import { post,postAdonis } from "utils/api";
import { toast, Slide } from 'react-toastify';
import { injectIntl } from "react-intl";
import { Spin, Calendar  } from 'antd';
import { Select, Switch, TreeSelect, Table, Tooltip, TimePicker, Popconfirm } from 'antd';
import { Button, Empty } from 'antd';
import moment from 'moment';
import { pegaData } from '../../components/dataHora'

const { Option } = Select;

const toastOptions = {
  transition: Slide,
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true
};

  

const vazio = {value: "", label: ""};                
class editarAcesso extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          reload: false,
          valores: {"incluirInativos":false}, 
          loading: false,
          loadingELS: true,
          loadingButtonPesquisar: false,
          loadingButtonAlterar: false,
          arvore: [],
          dataPesquisa: [],
          timePost: [],
          dataTable: [],      
          arrayData: [],
          diaClicado: moment().format(),
          mesDatas: [],
          modalConfirmeToogle: false,
          novosValores: [],
          dataTableSave: [],   
        };
        this.contErro = 0;
        this.arrayempresa =   [];
        this.arraylotacao=    [];
        this.arraysecao =     [];
        this.itemRender = this.itemRender.bind(this);
        this.pesquisar = this.pesquisar.bind(this);
        this.stringTranslate = this.stringTranslate.bind(this);     
        this.consultaDadosELT = this.consultaDadosELT.bind(this);
        this.onLoadData = this.onLoadData.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.onChange = this.onChange.bind(this);
        this.reloadArvore = this.reloadArvore.bind(this);
        this.carregaDataTable = this.carregaDataTable.bind(this);
        this.salvar = this.salvar.bind(this);
        this.consultaDadosELT(); 
        this.novoAcesso = this.novoAcesso.bind(this);
        this.cancelar = this.cancelar.bind(this);
        this.edit = this.edit.bind(this);
        this.handleChangeNovosValores = this.handleChangeNovosValores.bind(this);
        this.excluirAcesso = this.excluirAcesso.bind(this);
        this.consultaAcessos = this.consultaAcessos.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);        
        this.headTable =  [ {title:this.stringTranslate("Ajustes.RegistrosAcesso.Tabela.Hora"), dataIndex:"hora", sorter: (a, b) => a.hora - b.hora, width: 80},
                            {title:this.stringTranslate("Ajustes.RegistrosAcesso.Tabela.Direcao"), dataIndex:"direcao", onFilter: (value, record) => record.direcao.indexOf(value) === 0, width: 80},
                            {title:this.stringTranslate("Ajustes.RegistrosAcesso.Tabela.Tipo"), dataIndex:"tipo", onFilter: (value, record) => record.tipo.indexOf(value) === 0, width: 80},
                            {title:this.stringTranslate("Ajustes.RegistrosAcesso.Tabela.Coletor"), dataIndex:"coletor", onFilter: (value, record) => record.coletor.indexOf(value) === 0, width: "calc (100% - 328px)"},
                            {title:this.stringTranslate("Ajustes.RegistrosAcesso.Tabela.Comandos"), dataIndex:"comandos", width: 88}]                    
    }


    
    itemRender(current, type, originalElement) {
      
      return originalElement;
    }

    carregaDataTable(key){
      this.state.dataTable = [];
      this.state.dataTableSave = [];
      this.state.arrayData.forEach(prop => {
        if(prop.data === moment(key).format("DD-MM-YYYY")){            
          this.state.dataTable.push(prop)
          this.state.dataTableSave.push(prop)
        }
      })

      this.setState({dataTable: this.state.dataTable, diaClicado: key, dataTableSave: this.state.dataTableSave})      
    }

    excluirAcesso(key){      

      console.log(key)
      const body={
        cmd:"excluiracesso",
        codacesso: key,
        token:sessionStorage.getItem("token"),
      }
      postAdonis(body,'/Ajustes/EditarAcessos/ExcluirAcesso').then(lista =>{
  
        if(lista.error === undefined)
        {
          toast.dismiss();
          toast.success(this.stringTranslate("Sucesso.Acesso.Excluir"), toastOptions);
          this.consultaAcessos(this.state.valores["pesquisar"].key, moment(this.state.diaClicado).format("YYYY-MM-01 00:00:00"), moment().endOf("month").format("YYYY-MM-DD HH:mm:ss"))
        }
        else
        {
          toast.dismiss();
          toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
        }
        this.contErro = 0;
       })
    }

    comandos(key){
      return(
        <>
          <Tooltip  placement="top" title={this.stringTranslate("Botao.Editar")} overlayStyle={{fontSize: "12px"}}>
            <i className="far fa-edit ef-pulse-grow" onClick={()=>this.edit(key)} style={{top:"0", marginLeft: "10px", color:"#E9B000", cursor:"pointer"}}/>
          </Tooltip> 
          
          <Tooltip  placement="top" title={this.stringTranslate("Botao.Excluir")} overlayStyle={{fontSize: "12px"}}>
            <Popconfirm placement="left" title={"Você realmente deseja excluir?"} onConfirm={() => this.excluirAcesso(key)} okText="Sim" cancelText="Não">
              <i className="far fa-trash-alt ef-pulse-grow" style={{top:"0", marginLeft: "10px", color:"#E24E42", cursor:"pointer"}}/>
            </Popconfirm>
          </Tooltip>          
          </>
      )
    }

    //MARK: Consulta Acesso
    consultaAcessos(key, inicio, fim){
      const body={
        cmd:"consultaacessospessoa",
        codpessoa: parseInt(key),
        datainicio: inicio,      
        datafim: fim,
        token:sessionStorage.getItem("token"),
      }
      postAdonis(body,'/Geral/ConsultaAcessoPessoa').then(lista =>{
     //post(body).then(lista =>{
        if(lista.error === undefined)
        {
          this.state.arrayData = lista.dados.map(prop => {
              if(this.state.mesDatas[moment(prop.datahora, 'YYYY-MM-DD').format('MMYYYY')] === undefined) 
                this.state.mesDatas[moment(prop.datahora, 'YYYY-MM-DD').format('MMYYYY')] = [];
              
              this.state.mesDatas[moment(prop.datahora, 'YYYY-MM-DD').format('MMYYYY')].push(moment(prop.datahora, 'YYYY-MM-DD').format('DD'))
              var comandos = prop.funcao === "MAN" ? this.comandos(prop.codigo) : "";

              return({
              key: prop.codigo,
              hora: moment(prop.datahora, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss'),
              data: moment(prop.datahora, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY'),
              direcao: prop.direcao === 1 ? this.stringTranslate("Label.Entrada") : prop.direcao === 2 ? this.stringTranslate("Label.Saida") : "",
              tipo: prop.funcao === "+65" || prop.funcao === "+25" ? this.stringTranslate("Ajustes.RegistrosAcesso.Label.Coletado") : '',
              coletor: prop.nomecoletor === undefined || prop.nomecoletor ===null? "" : prop.nomecoletor,
              consultaAcesso: {key, inicio, fim},
              comandos: comandos,
            })
          })
          console.log(this.state.arrayData)
          this.carregaDataTable(this.state.diaClicado);
          this.setState({arrayData: this.state.arrayData, mesDatas: this.state.mesDatas});
        }
        else
        {
          toast.dismiss();
          toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
        }
        this.contErro = 0;
       })
    }
    //----------------------------------------

    //MARK: Handle Change novos Valores
    handleChangeNovosValores(e, key, tipo){ 
      if(tipo === "hora")
        this.state.novosValores[key].hora = moment(e).format('HH:mm:ss');
      else if(tipo === "direcao")
        this.state.novosValores[key].direcao = e;
      
      this.setState({novosValores: this.state.novosValores})
    }
    //---------------------------------------------

    aberto(){
      return(this.state.open)
    }
    //MARK: Editar Acesso
    edit(key){
      var valor = 0;
      var campos = [];         

      for(var i = 0; i < this.state.dataTable.length; i++)
      {
        if(parseInt(this.state.dataTable[i].key) === parseInt(key)){
          valor = i;
          campos = this.state.dataTable[i];
          break;
        }          
      }

      this.state.novosValores[valor] = {
        hora: campos.hora,
        direcao: campos.direcao
      };

      this.state.dataTable[valor] = {
        key:key,
        hora:<TimePicker defaultValue={moment(this.state.novosValores[valor].hora, 'HH:mm:ss')} style={{ width: "70px", margin: 0, marginLeft: "-5px" }} 
        onChange={e => this.handleChangeNovosValores(e, valor, "hora")} size="small" 
        allowClear={false} suffixIcon={<></>} defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} 
        />,
        direcao:<Select onChange={e => this.handleChangeNovosValores(e, valor, "direcao")} defaultValue={this.state.novosValores[valor].direcao} style={{ width: "80px", margin: 0, marginLeft: "-5px" }} size="small">
                <Option value="Entrada">{this.stringTranslate("Label.Entrada")}</Option>
                <Option value="Saida">{this.stringTranslate("Label.Saida")}</Option>
              </Select>,
        tipo: campos.tipo,
        coletor: campos.coletor,
        comandos: <>
        <Tooltip  placement="top" title={this.stringTranslate("Botao.Salvar")} overlayStyle={{fontSize: "12px"}}>
        <i className="fas fa-save ef-pulse-grow" onClick={()=>this.salvar(valor)} style={{top:"0", marginLeft: "10px", color:"#008F95", cursor:"pointer"}}/>
        </Tooltip>

        <Tooltip  placement="top" title={this.stringTranslate("Botao.Cancelar")} overlayStyle={{fontSize: "12px"}}>
        <i className="fas fa-times ef-pulse-grow" onClick={()=> this.cancelar(valor)} style={{top:"0", marginLeft: "18px", color:"#E24E42", cursor:"pointer"}}/>
        </Tooltip></>
      }

      this.setState({dataTable: this.state.dataTable, novosValores: this.state.novosValores})
    }
    //--------------------------------------------------------------
    
    //MARK: Salvar Alteração
    salvar(key){
      const body={
        cmd:"salvaacessoman",
        codpessoa: this.state.valores["pesquisar"].key,
        direcao: this.state.novosValores[key].direcao === "Entrada" ? "1" : "2",     
        datahora: pegaData(this.state.diaClicado) + " " + this.state.novosValores[key].hora,
        codacesso: this.state.dataTable[key].key,
        token:sessionStorage.getItem("token"),
      }
      postAdonis(body, '/Ajustes/EditarAcessos/SalvaAcessoMan').then(lista =>{
      //post(body).then(lista =>{     
        if(lista.error === undefined)
        {            
          if(lista.retorno === true){
            this.consultaAcessos(this.state.valores["pesquisar"].key, moment(this.state.diaClicado).format("YYYY-MM-01 00:00:00"), moment().endOf("month").format("YYYY-MM-DD HH:mm:ss"))
          }
          else{
            toast.dismiss();
            toast.warning(this.stringTranslate("Warning.alteracao"), toastOptions); 
          }
        }                
        else
        {
          toast.dismiss();
          toast.error(this.stringTranslate("Erro.Servidor"), toastOptions); 
        } 
        
      }).catch((error) => {
          toast.dismiss();
          toast.error(this.stringTranslate("Erro.Servidor"), toastOptions); 
      }); 
    }
    //---------------------------------------------------------------------

    //MARK: Cancelar alteração d acesso
    cancelar(key){      
      this.state.dataTable[key] = this.state.dataTableSave[key];
      this.setState({dataTable: this.state.dataTable})
    }
    //------------------------------------------------------------

    //MARK: Tradução
    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }
    //------------------------------------------------------

    //MARK: Switch Toggle
    toggleCollapse(e, index){
      this.state.valores[index] = e;
      this.setState({valores: this.state.valores})
    }
    //----------------------------------------------------

    //MARK: Consulta Pessoa Select
    loadOptionsSelect = value => {
      if(value.length > 2){
        this.setState({fetching: true});
        clearInterval(this.state.timePost);
        this.state.timePost = setTimeout(() => {
          var ELS = {empresa:0, lotacao:0, secao:0}
          if(this.state.valores["ELS"] !== undefined){
            var id = this.state.valores["ELS"];
            for(var i = 0; i < id.length; i++){
              if(id[i] === "_")
                ELS[id.substring(i + 1, id.length)] = parseInt(id.substring(0, i));
            }
          }
          
          const body={
            cmd:"consultaPessoas",
            resumo: true,
            nome: value,      
            incluirinativos: this.state.valores["incluirInativos"],
            qualquerparte: false,
            codempresa: ELS.empresa,
            codlotacao: ELS.lotacao,
            codsecao: ELS.secao,
            incluirresidente: true,
            incluirPreAutorizado: true,
            incluirPrecisaLiberacao: false,
            incluirNaoResidenteAutorizado: true,
            token:sessionStorage.getItem("token"),
          }
         // post(body).then(lista =>{     
          postAdonis(body,'/Geral/ConsultaPessoaP').then(lista =>{     
            if(lista.error === undefined)
            {            
              var array = lista.dados.map((item) => {
                return{value: item.codigo, text: item.nome}
              })
              
              this.setState({dataPesquisa: array, fetching: false});              
            }                
            else
            {
              toast.dismiss();
              toast.error(this.stringTranslate("Erro.Servidor"), toastOptions); 
            } 
            this.contErro = 0;
          }).catch((error) => {
            if(this.contErro++ > 3){
              toast.dismiss();
              toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);            
            }
            else
              this.loadOptionsSelect(value)
          });    
          
        }, 500);
      }    
    };
    //------------------------------------------------------------------------------

    //MARK: Handle Change Select
    handleChangeSelect(e, key){
      if(key === "ELS")
        this.state.dataPesquisa = [];
      if(key === "pesquisar" && e !== undefined)
          this.consultaAcessos(e.key, moment(this.state.diaClicado).format("YYYY-MM-01 00:00:00"), moment().endOf("month").format("YYYY-MM-DD HH:mm:ss"))

      this.state.valores[key] = e;
        
      this.setState({valores: this.state.valores, dataPesquisa: this.state.dataPesquisa})
    }  
    //----------------------------------------------

    //MARK: onChange
    onChange(e){      
      this.state.valores[e.target.name] = e.target.value;
      this.setState({valores: this.state.valores});
    }
    //---------------------------------------------

    //MARK: Consulta Dados ELT
    consultaDadosELT(){
      const body = {
        "cmd": "listasecaolotacaoempresa",
        "token": sessionStorage.getItem("token"),
      }
      postAdonis(body,'/Index/EditarRegistros').then(dados =>{
        if(dados.retorno){
  
          this.secao = dados.secao;
          this.secao.forEach(secao =>{
            this.arraysecao.push({value: secao.CodSecao,  title: secao.Nome, pai: secao.CodLotacao})                          
          })
          this.lotacao= dados.lotacao;
          this.lotacao.forEach(lotacao => {
            this.arraylotacao.push({value: lotacao.CodLotacao, title: lotacao.Nome,pai: lotacao.CodEmpresa})        
          });
  
          this.empresa = dados.empresa;
          this.empresa.forEach(empresa => {
            this.arrayempresa.push({value: empresa.CodEmpresa, title: empresa.Nome})  
          });

          this.reloadArvore()
          this.setState({reload: !this.state.reload}); // para recarregar os valores recebido do servidor para o select
        }else{
          if(this.contErro++ >= 3){
            toast.dismiss();
            toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
          }            
          else
            this.consultaDadosELT()                
        }
                    
      }).catch((error) => {
        if(this.contErro++ >= 3){
          toast.dismiss();
          toast.error(this.stringTranslate("Erro.Servidor")+ error, toastOptions);
        }            

        //  this.consultaDadosELT()     
      })      
      
    }
    //-----------------------------------------------------------------

   //MARK: Monta Calendario
    calendario(){
        return(
        <Calendar
        fullscreen={false}
        onSelect={e => this.carregaDataTable(e)}
        onPanelChange={(e) => {
          this.state.diaClicado = e;      
          if(this.state.valores["pesquisar"] !== undefined) 
           this.consultaAcessos(this.state.valores["pesquisar"].key, moment(this.state.diaClicado).format("YYYY-MM-01 00:00:00"), moment().endOf("month").format("YYYY-MM-DD HH:mm:ss") 
        )}}
        dateFullCellRender={(data) =>{
          var valor = this.state.mesDatas[moment(data).format('MMYYYY')];
          var dia = moment(data).format('DD');
          var mes = moment(this.state.diaClicado).format('MM');

          if(moment(data).format('DDMMYYYY') === moment().format('DDMMYYYY')){
            return (<div style={{textAlign: "center", cursor: "default"}}><Button type="primary" shape="circle"> {dia}
            <a href="#" className="head-example" />
          </Button></div>)
          }
          else if(moment(this.state.diaClicado).format('DDMMYYYY') === moment(data).format('DDMMYYYY')){           
            return (<div style={{textAlign: "center", cursor: "default"}}><Button shape="circle" style={{ borderColor: "#fb8b06"}}>{dia}</Button></div>)
          }
          else if(valor !== undefined && valor.indexOf(dia) >= 0){
            return (<div style={{textAlign: "center", cursor: "default"}}><Button type="dashed" shape="circle" style={{ borderColor: "#fb8b06"}}>{dia}</Button></div>)
          }  
          else if(mes !== moment(data).format('MM')){
            return (<div style={{textAlign: "center", color: "#d1d1d1", cursor: "default"}}>{dia}</div>)
          }          
          else
            return(<div style={{textAlign: "center", cursor: "default"}}><Button type="link" shape="circle" style={{color: "#000", fontWeight: "400" }}>{dia}</Button></div>);
          
        }}
        headerRender={({ value, type, onChange, onTypeChange }) => {
          const start = 0;
          const end = 12;
          const monthOptions = [];
  
          const current = value.clone();
          const localeData = value.localeData();
          const months = [];
          for (let i = 0; i < 12; i++) {
            current.month(i);
            months.push(localeData.monthsShort(current));
          }
  
          for (let index = start; index < end; index++) {
            monthOptions.push(
              <Select.Option className="month-item" key={`${index}`}>
                {months[index]}
              </Select.Option>,
            );
          }
          const month = value.month();
  
          const year = value.year();
          const options = [];
          for (let i = year - 10; i < year + 10; i += 1) {
            options.push(
              <Select.Option key={i} value={i} className="year-item">
                {i}
              </Select.Option>,
            );
          }
          return (
            <div style={{ padding: 10, marginBottom:"22px" }}>
              <Row type="flex" style={{float:"right"}}>

                  <Select
                    size="small"
                    style={{width: "100px"}}
                    dropdownMatchSelectWidth={false}
                    className="my-year-select"
                    onChange={newYear => {
                      const now = value.clone().year(newYear);
                      onChange(now);
                    }}
                    value={String(year)}
                  >
                    {options}
                  </Select>



                  <Select
                    size="small"
                    style={{width: "100px", marginLeft:"5px", marginRight: "5px"}}
                    dropdownMatchSelectWidth={false}
                    value={String(month)}
                    onChange={selectedMonth => {
                      const newValue = value.clone();
                      newValue.month(parseInt(selectedMonth, 10));
                      onChange(newValue);
                    }}
                  >
                    {monthOptions}
                  </Select>

              </Row>
            </div>
          );
        }}
        //onPanelChange={onPanelChange}
      />)
    }
    //-------------------------------------------------------------

    //MARK:  Reload Select Arvore ELT 
    reloadArvore(){      
      var groupedOptions = this.arrayempresa.map((itemempresa) => {
  
        var filhoslotacao = [];
  
        this.arraylotacao.forEach((valuelotacao) => {
            if(valuelotacao.pai === itemempresa.value){
                var filhos=[];
                  this.arraysecao.forEach(function(valuesecao){
                  
                    if(valuesecao.pai === valuelotacao.value){
                        filhos.push({value: valuesecao.value + "_secao", key: valuesecao.value, title: valuesecao.title})
                    }
                   }) 
                filhoslotacao.push({value: valuelotacao.value + "_lotacao", key: valuelotacao.value, title: valuelotacao.title,children: filhos})  
            }
        })             
  
        return {value: itemempresa.value + "_empresa", key: itemempresa.value, title: itemempresa.title, children: filhoslotacao};
      })

      this.setState({arvore: groupedOptions, loadingELS: false})      
    } 
    //------------------------------------------------------------

    //MARK: Pesquisar
    pesquisar(){
      this.setState({loadingButtonPesquisar: true});
      if(this.state.valores["pesquisa"] !== ""){
        const body={
          cmd:"gerarArvoredePesquisa",
          nome: this.state.valores["pesquisa"],
          incluirresidente: this.state.valores["incluirresidente"] !== undefined ? this.state.valores["incluirresidente"].value : true,
          incluirpreautorizado: this.state.valores["incluirpreautorizado"] !== undefined ? this.state.valores["incluirpreautorizado"].value : true,
          incluirprecisaliberacao: this.state.valores["incluirprecisaliberacao"] !== undefined ? this.state.valores["incluirprecisaliberacao"].value : false,
          incluirnaoresidenteautorizado: this.state.valores["incluirnaoresidenteautorizado"] !== undefined ? this.state.valores["incluirnaoresidenteautorizado"].value : true,
          incluirinativos: this.state.valores["incluirinativos"] !== undefined ? this.state.valores["incluirinativos"].value : false,
          qualquerparte: this.state.valores["qualquerparte"] !== undefined ? this.state.valores["qualquerparte"].value : false,
          token:sessionStorage.getItem("token"),
        }
        post(body).then(lista =>{     
          if(lista.error === undefined)
          {
            var filhosSecao= lista.dados.ListaPessoas;
            this.state.expand=[];
            this.filhosSecao =[];
             lista.dados.ListaPessoas.forEach((item) => {
              if(this.filhosSecao[item.codSecao] === undefined){
                this.filhosSecao[item.codSecao]= [];
              }
              (this.genTreeNode(item.codigo,item.nome))
              this.filhosSecao[item.codSecao].push(this.genTreeNode(item.codigo,item.nome));
              this.state.expand.push(parseInt(item.codigo));
            })
            this.reloadArvore();
            this.setState({update:true,expand: this.state.expand, loadingButtonPesquisar: false});   
                          
          }                
          else
          {
            this.state.mensagemErro = this.stringTranslate("Liberacao.erro");
            this.setState({loadingButtonPesquisar: false});
            this.redirect();
          } 
        })
        .catch((error) => {
          this.setState({loadingButtonPesquisar: false});
        })  
      }
    }
    //----------------------------------------------

    //MARK: Novo Acesso
    novoAcesso(){      
    var posicao = this.state.dataTable.length;

      if(posicao > 0 && this.state.dataTable[posicao-1].key === 0)
        return;

      this.state.novosValores[posicao] = {
        hora: moment('00:00:00', 'HH:mm:ss').format('HH:mm:ss'), 
        direcao: "Entrada"
      };
      
      this.state.dataTable[posicao] = {
        key:0,
        hora:<TimePicker style={{ width: "70px", margin: 0, marginLeft: "-5px" }} defaultValue={moment('00:00:00', 'HH:mm:ss')} onChange={e => this.handleChangeNovosValores(e, posicao, "hora")} size="small" allowClear={false} suffixIcon={<></>} defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} />,
        direcao:<Select onChange={e => this.handleChangeNovosValores(e, posicao, "direcao")} defaultValue="Entrada" style={{ width: "80px", margin: 0, marginLeft: "-5px" }} size="small">
                  <Option value="Entrada">{this.stringTranslate("Label.Entrada")}</Option>
                  <Option value="Saida">{this.stringTranslate("Label.Saida")}</Option>
                </Select>,
        tipo: "Manual",
        coletor:"",
        comandos: <>
        <Tooltip  placement="top" title={this.stringTranslate("Botao.Salvar")} overlayStyle={{fontSize: "12px"}}>
        <i className="fas fa-save ef-pulse-grow" onClick={()=> {          
            this.salvar(posicao)
        }} 
        style={{top:"0", marginLeft: "10px", color:"#008F95", cursor:"pointer"}}/>
        </Tooltip>

        <Tooltip  placement="top" title={this.stringTranslate("Botao.Cancelar")} overlayStyle={{fontSize: "12px"}}>
        <i className="fas fa-times ef-pulse-grow" onClick={()=> {
          this.state.dataTable.splice(posicao, 1)
          this.setState({dataTable: this.state.dataTable});
          }} 
          style={{top:"0", marginLeft: "18px", color:"#E24E42", cursor:"pointer"}}/>
        </Tooltip ></>
      }
      this.setState({dataTable: this.state.dataTable, novosValores: this.state.novosValores})
    }
    //-------------------------------------------

    //MARK: OnloadData TREE VIEW
    onLoadData = treenode =>
    new Promise(resolve => {
    const { value,tipo } = treenode.props;

       if (tipo === "secao"){
       const body={
         cmd:"gerarArvoredePesquisa",           
         codsecao: value,
         incluirresidente: this.state.valores["incluirresidente"] !== undefined ? this.state.valores["incluirresidente"].value : true,
         incluirpreautorizado: this.state.valores["incluirpreautorizado"] !== undefined ? this.state.valores["incluirpreautorizado"].value : true,
         incluirprecisaliberacao: this.state.valores["incluirprecisaliberacao"] !== undefined ? this.state.valores["incluirprecisaliberacao"].value : true,
         incluirnaoresidenteautorizado: this.state.valores["incluirnaoresidenteautorizado"] !== undefined ? this.state.valores["incluirnaoresidenteautorizado"].value : true,
         incluirinativos: this.state.valores["incluirinativos"] !== undefined ? this.state.valores["incluirinativos"].value : false,
         qualquerparte: this.state.valores["qualquerparte"] !== undefined ? this.state.valores["qualquerparte"].value : true,
         token:sessionStorage.getItem("token"),
       }
   
   
       new Promise(resolve => {
   
         post(body).then(lista =>{     

           if(lista.error === undefined)
           {
             var ListaPessoas = lista.dados.ListaPessoas;
             this.filhosSecao[value]=[];
             ListaPessoas.map((item) => {                
                  this.filhosSecao[value].push(this.genTreeNode(item.codigo,item.nome))    
               })
                this.reloadArvore();    
           }                
           else
           {
             this.state.mensagemErro = this.stringTranslate("Liberacao.erro");
             this.redirect();
           } 
         });
         resolve();
       });
     }
       resolve();
    })
    //-----------------------------------------------------------



  render() {    
      
    
    return (
      <>      
      <div className="content">


        <Row>
        
          <Col md="12">
            <Card>
              <CardHeader tag="h4">
                {this.stringTranslate("Ajustes.RegistrosAcesso.Card.Titulos")}
              </CardHeader>
              <CardBody style={{marginTop: "5px"}}>
              <Row>
              <Col sm="5">                
                <FormGroup> 
                  <Label for="categoria" style={{textTransform:"uppercase"}}>{this.stringTranslate("Label.ELS")}</Label>  
                  <Spin spinning={this.state.loadingELS}>
                    <TreeSelect
                      style={{ width: '100%' }}
                      value={this.state.valores["ELS"]}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={this.state.arvore}
                      placeholder={this.stringTranslate("Botao.Todos")}                 
                      onChange={(v) => this.handleChangeSelect(v, "ELS")}
                      size="large"
                      allowClear={true}
                    />
                  </Spin>                    
                  </FormGroup>
                 
                </Col>
                <Col sm="7">
                  <FormGroup>                      
                    <Label style={{textTransform:"uppercase"}}>{this.stringTranslate("Label.Pesquisar")}</Label>                        
                    <Select
                      mode="default"
                      showSearch={true}
                      labelInValue
                      size="large"
                      value={this.state.valores["pesquisar"]}
                      placeholder=""
                      notFoundContent={this.state.fetching ? <Spin size="small" /> : null}
                      filterOption={false}
                      onSearch={this.loadOptionsSelect}
                      onChange={(e) => this.handleChangeSelect(e, "pesquisar")}
                      style={{ width: '100%' }}
                      allowClear={true}
                    >
                      {this.state.dataPesquisa.map(d => (
                        <Option key={d.value}>{d.text}</Option>
                      ))}
                    </Select>
                    <Switch size="small" onChange={(e) => this.toggleCollapse(e, "incluirInativos")} checked={this.state.valores["incluirInativos"]}/> <Label style={{marginLeft: "7px"}} style={{marginTop: "5px"}} onClick={() => this.toggleCollapse(!this.state.valores["incluirInativos"], "incluirInativos")} > {this.stringTranslate("Label.incluirInativos")}</Label>                         
                  </FormGroup>
                </Col>                
                </Row>            
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md="5">
              <Card style={{maxHeight:"500px",overflow: 'auto', paddingTop: "10px"}}>
                <CardBody>            
                    {this.calendario()}
                </CardBody>
              </Card>
          </Col>

          <Col md="7">
              <Card>
                <CardHeader tag="h4">
                {this.stringTranslate("Ajustes.RegistrosAcesso.Botao.IncluirAcesso")}          
                  {this.state.valores["pesquisar"] !== undefined && this.state.dataTable.length > 0 ? <Button type="link" onClick={() => this.novoAcesso()} style={{float: "right"}}><i className="fad fa-plus-circle"/> {this.stringTranslate("Ajustes.RegistrosAcesso.Botao.IncluirAcesso")} </Button> : null }
                </CardHeader>
                <CardBody>
                  {this.state.dataTable.length > 0 ? (
                  <Table columns={this.headTable} loading={this.state.loading} scroll={{x: "400px"}} dataSource={this.state.dataTable} size="small" pagination={{showSizeChanger:true,size:"small",pageSizeOptions:["5","10","15","20"], hideOnSinglePage: true, itemRender:this.itemRender}} /> 
                  ): (
                    <Empty
                   image={<img
                      alt="..."
                      style={{borderRadius: "500px", opacity: "0.6"}}
                      src={require("../../assets/img/no-date-found.gif")}
                    />}                   
                   imageStyle={{ height: "100%" }}
                   description={
                     <>
                     
                     <Label style={{fontWeight: "500", fontSize: "16px", color: "#a1a1a1"}}>
                       {this.stringTranslate("Warning.semAcesso")}
                     </Label><Row>
                       <Col span={8}>
                    {this.state.valores["pesquisar"] !== undefined ? <Button type="primary" onClick={() => this.novoAcesso()} style={{marginTop: "10px"}}><i className="fad fa-plus-circle" style={{marginRight: "10px"}}/> {this.stringTranslate("Ajustes.RegistrosAcesso.Botao.IncluirAcesso")} </Button> : null }
                    </Col>
                    </Row>
                    </>
                   }
                 >
                 </Empty>
                  )}
                </CardBody>
              </Card>
          </Col>
        </Row>
       </div> 
       </>
    );
  }
}

export default injectIntl(editarAcesso);