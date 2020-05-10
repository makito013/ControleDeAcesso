import { post } from "utils/api";
import { toast, Slide } from 'react-toastify';

/////// os storages são 
//          categorias
//          coletores
//          empresas
//          lotacao
//          secao


function carregaStorage (token)
{
  var status = "";
  var timeOut = 0;
  var timer;
  var contadorErro = 0;

    
    clearInterval(timer);
    timer = setInterval(function(){    
           
        switch (status){
          case "":
            postCategoria(token);
            status = "postCategoria"
          break;

          case "postCategoria":
            if(sessionStorage.getItem("categorias") !== null && sessionStorage.getItem("categorias") !== "Erro" ){              
              status = "coletores"
              contadorErro = 0;
            }
            else if(sessionStorage.getItem("categorias") === "Erro")
            {
              status = "";
              sessionStorage.removeItem("categorias");
              contadorErro++;
            }
          break;

          case "coletores":
            postColetores(token);
            status = "postColetores"
          break;

          case "postColetores":
            if(sessionStorage.getItem("coletores") !== null  && sessionStorage.getItem("coletores") !== "Erro"){              
                status = "dados"
                contadorErro = 0;
              }
              else if(sessionStorage.getItem("coletores") === "Erro")
              { 
                status = "coletores";
                sessionStorage.removeItem("coletores");
                contadorErro++;
              }
          break;

          case "dados":
            postDados(token);
            status = "postDados"
          break;

          case "postDados":
            if(sessionStorage.getItem("empresas") !== null  && sessionStorage.getItem("empresas") !== "Erro"){      
                status = "locaisAcesso";   
                contadorErro = 0;             
              }
              else if(sessionStorage.getItem("empresas") === "Erro")
               { 
                 status = "dados";
                 sessionStorage.removeItem("empresas");
                 contadorErro ++;
               }
          break;
          
          case "locaisAcesso":
            postLocaisAcesso(token);
            status = "postLocaisAcesso"
          break;

          case "postLocaisAcesso":
            if(sessionStorage.getItem("locaisAcesso") !== null  && sessionStorage.getItem("locaisAcesso") !== "Erro"){      
                clearInterval(timer);        
                contadorErro = 0;
                return "OK";                
              }
              else if(sessionStorage.getItem("locaisAcesso") === "Erro")
              {
                status = "locaisAcesso";
                sessionStorage.removeItem("locaisAcesso");
                contadorErro++;
              }
          break;

        }
        
        if(timeOut >= 50 || contadorErro >= 5)
        {
            toast.error("Erro ao obter informações do servidor!", {
                position: "top-center",
                transition: Slide,
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                pauseOnVisibilityChange: false
                });  
            
            sessionStorage.clear();
            clearInterval(timer);

        }

        timeOut++;

       }, 100); 
}

function postDados(token) {
    const body={
        cmd:"listasecaolotacaoempresa",
        token:token
    }

    post(body).then(lista =>{
        if(lista.error === undefined && lista.retorno === true)
        {
            const dados = lista.dados;

            const nomeEmpresas = dados.empresa.map(item =>{
                return [item.CodEmpresa, item.Nome];
            });

            const lotacao = dados.lotacao.map(item =>{
                return [item.CodLotacao,item.Nome,item.codEmpresa];
            });

            const secao = dados.secao.map(item =>{
                return [item.CodSecao,item.Nome,item.codLotacao];
            });

            sessionStorage.setItem("empresas", nomeEmpresas);
            sessionStorage.setItem("lotacao", lotacao);
            sessionStorage.setItem("secao", secao);

            return(nomeEmpresas, lotacao, secao);
        }                
        else
        {
            sessionStorage.setItem("empresas", "Erro");  
            return("Erro");
        }              
    });
      
  }
  //-----------------------------------------------------------------------------------------------------//


  /////////////////////// Requisição Post para pegar valores de coltores ///////////////////////////////////
  function  postColetores(token) {  
    const body={
    cmd:"listadecoletores",
        cliente:"DESEN01"
    }

    post(body).then(lista =>{

        if(lista.error === undefined && lista.retorno === true)
        {
            const dados = lista.dados;                    
            const coletores = dados.ListaColetores.map(item =>{
            return [item.CodColetor, item.Nome, item.Numero];  });

            sessionStorage.setItem("coletores", coletores);      
            return(dados.ListaColetores);                
        }                
        else
        {
            sessionStorage.setItem("coletores", "Erro");  
            return("Erro");
        }                                           
    });          

  } 

  ////////////// Requisição para pegar valores da categoria ////////////////////////////////////////////
  function  postCategoria(token) {
    const body={
        cmd:"listacategoria",
        token:token
    }

    post(body).then(lista =>{
        if(lista.error === undefined && lista.retorno === true){                
            const dados = lista.dados;     
        
            const categorias = dados.listaCategoria.map(item =>{
            return [item.codCategoria, item.Nome];});

            sessionStorage.setItem("categorias", categorias);      
            return(dados.listaCategoria);
        }                
        else
        {
            sessionStorage.setItem("categorias", "Erro");  
            return("Erro");
        }                                            
    });  
    
  }
  ///////////////////------------------------------------------------------------------------------///////////






  function postLocaisAcesso(token){
    const body = {
      cmd:"listalocalacesso",
      token: token,
      nome:"DESEN01",
    }

    post(body).then(data => {
      console.log(data);
      if(data.error === undefined && data.retorno === true){                
        const dados = data.dados.ListaLocalAcesso; 

        if (dados.length > 0){

         const locais = dados.map(item =>{
         return [item.Nome, item.CodLocalAcesso];});
  
         sessionStorage.setItem("locaisAcesso", locais);      
         return(locais);
        }
    }                
    else
    {
        sessionStorage.setItem("locaisAcesso", "Erro");  
        return("Erro");
    }               
     
    })
  }


  function localstorageObjeto(item){

    if (Boolean(sessionStorage.getItem(item))){
      var local = sessionStorage.getItem(item).split(",");
    
      var objeto = [];
      var key = 0;


      if(item === "secao" || item === "lotacao" || item === "coletores"){
          for(var i = 0; i < local.length; i=i+3)
          {                                
            objeto[key] = [local[i], local[i+1], local[i+2]]
            key++;    
          }
      }
      else if (item === "locaisAcesso"){
        for (var i = 0, l = local.length; i < l; i=i+2){
          objeto[key] = [local[i], local[i+1]]
          key++;
        }
      }
      else{               
          for(var i = 0; i < local.length; i=i+2)
          {                                
            objeto[key] = [local[i], local[i+1]]
            key++;    
          }
      }
  }

    return objeto;
  }


  function solicitaImagem(pessoa, token){
    const body = {
      cmd:"buscarFoto",
      codPessoa: pessoa,
      token: token,      
    }

    post(body).then(data => {
      console.log(data);
      if(data.error === undefined && data.retorno === true){                
        return(data.dados);
      }                
      else{ 
        return("Erro");
      }               
    })
  }

  export { postCategoria, postColetores, postDados, localstorageObjeto, carregaStorage, solicitaImagem };