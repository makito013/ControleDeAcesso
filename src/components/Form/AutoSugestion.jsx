import React from "react";
import Autosuggest from "react-autosuggest";
import { postAdonis } from "utils/api";
import { FormGroup, Label, Col, Row  } from 'reactstrap';
import { toast, Slide } from 'react-toastify';
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


  class Search extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
        valueAutorizante: '',
        valuePessoa: '',
        suggestionsAutorizante: [],
        suggestionsPessoa: [],
        secao: "",
        timePost: [],
        pesquisaAnterior: [],
        pessoas: [],
        autorizantes: [],
        codPessoa: 0,
        codAutorizante: 0
      };    
       
      this.props.funcao(this.state.codPessoa, this.state.codAutorizante);
      this.postDadosPessoas = this.postDadosPessoas.bind(this);
      this.postDadosAutorizante = this.postDadosAutorizante.bind(this);
      this.stringTranslate = this.stringTranslate.bind(this);
    }

    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }

    enviaValores()
    {
      const retornaValor = [];
      if(this.state.codPessoa !== 0)
      {
        retornaValor[0] = this.state.codPessoa;

        if(this.state.codAutorizante !== 0)
        {
          retornaValor[1] = this.state.codAutorizante;
          this.props.funcao(this.state.codPessoa, this.state.codAutorizante);
        }          
        else
          this.props.funcao(-2, -2);
      }
      else
        this.props.funcao(-1, -1);
    }

    escapeRegexCharacters(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    getSuggestionsPessoas(value) {
      if(value !== undefined && value !== null){
        
        const escapedValue = this.escapeRegexCharacters(value.trim());
      
        if (escapedValue === '') {
          return [];
        }
      
        const regex = new RegExp('^' + escapedValue, 'i');
        return this.state.pessoas.filter(pessoa => regex.test(pessoa.Nome));
      }     
    }

    getSuggestionsAutorizante(value) {
      if(value !== undefined && value !== null){
        const escapedValue = this.escapeRegexCharacters(value.trim());
      
        if (escapedValue === '') {
          return [];
        }
      
        const regex = new RegExp('^' + escapedValue, 'i');
      
        return this.state.autorizantes.filter(pessoa => regex.test(pessoa.Nome));
      }     
    }

    getSuggestionValueAutorizante(suggestionsAutorizante) {return suggestionsAutorizante; }

    getSuggestionValuePessoa(suggestionsPessoa) {return suggestionsPessoa; }
    
    renderSuggestionAutorizante(suggestionsAutorizante) { return ( <span>{suggestionsAutorizante.Nome}</span> ); }
    
    renderSuggestionPessoa(suggestionsPessoa) { return ( <span>{suggestionsPessoa.Nome}</span> ); }


    postDadosPessoas() {
      if(this.state.secao === undefined || this.state.secao === "")
      {
        toast.dismiss();
        toast.warn(this.stringTranslate("AutoSuggestion.toast.selecioneSecao")+" "+this.stringTranslate("Cadastro.secao")+"!", toastOptions);

          return;
      }
      const token = sessionStorage.getItem("token");
      const body={
          cmd:"listapessoasecao",
          token:token,
          codSecao:this.state.secao,
          valor: this.state.valuePessoa
      };
          postAdonis(body,'/Geral/ConsultaPessoaP').then(lista =>{

            if(lista.error === undefined)
            {
              this.state.pessoas = lista.dados;                    

              if(lista.dados === [])
              {
                toast.dismiss();
                toast.warn(this.stringTranslate("AutoSuggestion.toast.naoEncontrado"), toastOptions);
                return;
              }
              this.renderSuggestionPessoa(this.state.pessoas);
              this.getSuggestionValuePessoa(this.state.pessoas);
              this.setState({pessoas: this.state.pessoas});
              this.setState({suggestionsPessoa: this.getSuggestionsPessoas(this.state.valuePessoa)});                    
            }                            
              else{
                toast.dismiss();
                toast.error(this.stringTranslate("AutoSuggestion.toast.errorServidor"), toastOptions);
                     return;
              }              
          });                
      }


    postDadosAutorizante() {
      if(this.state.secao === undefined || this.state.secao === "")
      {
          toast.dismiss();
          toast.warn(this.stringTranslate("AutoSuggestion.toast.selecioneSecao")+" "+this.stringTranslate("Cadastro.secao")+"!", toastOptions);

          return;
      }

      const token = sessionStorage.getItem("token");
      const body={
          cmd:"listapessoasecao",
          codSecao:this.state.secao,
          valor: this.state.valueAutorizante,
          token:token,
      }
      ;      
          postAdonis(body,'/Geral/ConsultaPessoaP').then(lista =>{
              if(lista.error === undefined)
              {
              this.state.autorizantes = lista.dados;                    

              if(lista.dados === [])
              {
                toast.dismiss();
                toast.warn(this.stringTranslate("AutoSuggestion.toast.naoEncontrado"), toastOptions);
              }

              this.renderSuggestionAutorizante(this.state.autorizantes);
              this.getSuggestionValueAutorizante(this.state.autorizantes);
              this.setState({autorizantes: this.state.autorizantes});
              this.setState({suggestionsAutorizante: this.getSuggestionsAutorizante(this.state.valueAutorizante)});    
            }            
          });                
    }


    onChangeAutorizante = (event, { newValue, method }) => { 
        
        if(newValue.Nome !== undefined)
        {
          this.state.codAutorizante = newValue.CodPessoa;
          this.props.funcao("", this.state.codAutorizante);
          this.setState({ valueAutorizante: newValue.Nome });
          this.setState({ codAutorizante: this.state.codAutorizante });
        }
        else{
          this.setState({ valueAutorizante: newValue });;
        }
        
        clearInterval(this.state.timePost);

        if(document.getElementById('valueAutorizante').value.length > 2)
        {
            if(this.state.autorizantes.length === 0 || this.state.pesquisaAnterior[1] !== document.getElementById('valueAutorizante').value.substring(this.state.pesquisaAnterior[1].length, 0))
            {                
                this.state.pesquisaAnterior[1] = document.getElementById('valueAutorizante').value;
                this.state.timePost = setTimeout(this.postDadosAutorizante, 500);                
            }                
        }
        else
        {
            if(this.state.autorizantes.length > 0)
                this.state.autorizantes = [];
        }
        
    };

    

    onChangePessoa = (event, { newValue, method }) => {

        if(newValue.Nome !== undefined)
        {
          this.state.codPessoa = newValue.CodPessoa;
          this.props.funcao(this.state.codPessoa, "");
          this.setState({ valuePessoa: newValue.Nome });
          this.setState({ codPessoa: this.state.codPessoa });
        }
        else{
          this.setState({ valuePessoa: newValue });
        }

        
        clearInterval(this.state.timePost);

        if(document.getElementById('valuePessoa').value.length > 2)
        {
            if(this.state.pessoas.length === 0 || this.state.pesquisaAnterior[0] !== document.getElementById('valuePessoa').value.substring(this.state.pesquisaAnterior[0].length, 0))
            {                
                this.state.pesquisaAnterior[0] = document.getElementById('valuePessoa').value;
                this.state.timePost = setTimeout(this.postDadosPessoas, 500);                
            }
        }
        else
        {
            if(this.state.pessoas.length > 0)
                this.state.pessoas = [];
        }
        
    };
    
    onSuggestionsFetchRequestedAutorizante = ({value }) => {this.setState({ suggestionsAutorizante: this.getSuggestionsAutorizante(value) }); };

    onSuggestionsFetchRequestedPessoa = ({value }) => {this.setState({ suggestionsPessoa: this.getSuggestionsPessoas(value) }) };
  
    onSuggestionsClearRequestedAutorizante  = () => { this.setState({suggestionsAutorizante: [] });};

    onSuggestionsClearRequestedpessoa  = () => { this.setState({suggestionsPessoa: [] }); };
  
    


        
    render() {
        if(this.state.secao !==  this.props.secao)
        {
            this.state.secao =  this.props.secao;
            this.state.valueAutorizante = "";
            this.state.valuePessoa = "";
            this.setState({valueAutorizante: "" });            
            this.setState({valuePessoa: "" });            
        }
      
        const { valueAutorizante, valuePessoa, suggestionsAutorizante, suggestionsPessoa } = this.state;      

        const inputProps = [
        {
            placeholder: this.stringTranslate("AutoSuggestion.input.dica"),
            value: valuePessoa,
            name: "valuePessoa",
            id: "valuePessoa",
            onChange: this.onChangePessoa,
            className:"form-control mr-sm-2"
        },
        {
            placeholder: this.stringTranslate("AutoSuggestion.input.dica"),
            value: valueAutorizante,
            name: "valueAutorizante",
            id: "valueAutorizante",
            onChange: this.onChangeAutorizante,
            className:"form-control mr-sm-2"
        }];
        return (
          <>        
          <Row form>
            <Col>
                <FormGroup>  
                    <Label for="secao">{this.stringTranslate("AutoSuggestion.pessoaDestino")}</Label>
                    <Autosuggest 
                    suggestions={suggestionsPessoa}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequestedPessoa}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequestedpessoa}
                    getSuggestionValue={this.getSuggestionValuePessoa}
                    renderSuggestion={this.renderSuggestionPessoa}
                    inputProps={inputProps[0]} />
                </FormGroup>
            </Col>
        </Row>

        <Row form>
            <Col>
                <FormGroup>  
                    <Label for="secao">{this.stringTranslate("AutoSuggestion.autorizante")}</Label>
                    <Autosuggest 
                    suggestions={suggestionsAutorizante}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequestedAutorizante}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequestedAutorizante}
                    getSuggestionValue={this.getSuggestionValueAutorizante}
                    renderSuggestion={this.renderSuggestionAutorizante}
                    inputProps={inputProps[1]} />
                </FormGroup>
            </Col>
        </Row>
        </>
      );
    }
  }
  
  export default injectIntl(Search);
  