import axios from "axios";
import {Cookies} from 'react-cookie';
import { encrypt } from "../utils/crypto.js"

let cookies = new Cookies();
var apiURLadonis = "https://localhost:8000"
//var apiURLadonis = "https://" + window.location.href.split('/')[2] + ":8000";
var apiURL = "http://" + window.location.href.split('/')[2] + ":8000/dokeo/WebApiDok.dll";

axios.defaults = {
  timeout: 30000,
  withCredentials: true,
  crossDomain: true,
  responseType: 'application/json',
  headers: {
    "Content-Type": "application/json"
  }
};

const get = (id = null) => {
  return new Promise((resolve, reject) => {
    axios
      .get(apiURL)
      .then(response => {
        let data = response.data;
        if (data && !data.error) {
          resolve(response.data);
        } else if (data && data.error) {
          reject(data.error);
        }
      })
      .catch(error => reject(error.reponse));
  });
};
const post = data => {
  //var resultado = window.location.href.split('/');
  //var apiURL = "http://" + window.location.href.split('/').resultado[2] + "/dokeo/WebApiDok.dll";
  return new Promise((resolve, reject) => {
    console.log(JSON.stringify(data))
    axios
      .post(apiURL, JSON.stringify(data))
      .then(response => {
        let data = response.data;
        if (data && (data.retorno === true)) {
          resolve(response.data);
        } else if (data && data.retorno === false) {
          if(data.dados !== undefined && (data.dados.error === "invalid or expired token" || data.mensagem === "Token inválido")){   
            sessionStorage.clear();
            cookies.remove(encrypt("token"))
            cookies.remove(encrypt("dokeo"))
            cookies.remove(encrypt("maqCadastrada"))   
            cookies.remove(encrypt("IvNk"))   
            cookies.remove(encrypt("KeyNk"))   
            cookies.remove(encrypt("CodLocalAcesso"))   
            cookies.remove(encrypt("LocalAcessoNome"))  
            window.location.reload()
          }

          if (data.mensagem === "02") {
            //window.location.href = process.env.PUBLIC_URL + "/logout";
            resolve(response.data);
          }
          else
              resolve(response.data); 

          reject(data.error);
        }

        resolve(response.data);
      })      
      .catch(error => {
        reject("not resp");
      });      
  });
};
 
const postAdonis = (data,command, timeOut) => {
  //var resultado = window.location.href.split('/');
  //var apiURL = "http://" + window.location.href.split('/').resultado[2] + "/dokeo/WebApiDok.dll";
   return new Promise((resolve, reject) => {
    axios.post(apiURLadonis+command,JSON.stringify(data))
    
      .then(response => {
        let data = response.data;
        if (data && (response.retorno === true)) {
          resolve(data);
        } 
        else if (data.retorno === false) {
          if(data.error === "invalid or expired token" || data.mensagem === "Token inválido"){   
            sessionStorage.clear();
            cookies.remove(encrypt("token"),{ path: '/' })
            cookies.remove(encrypt("dokeo"),{ path: '/' })
            cookies.remove(encrypt("maqCadastrada"),{ path: '/' })   
            cookies.remove(encrypt("IvNk"),{ path: '/' })   
            cookies.remove(encrypt("KeyNk"),{ path: '/' })   
            cookies.remove(encrypt("CodLocalAcesso"),{ path: '/' })   
            cookies.remove(encrypt("LocalAcessoNome"),{ path: '/' })  
            window.location.reload()
          }

          if (data.mensagem === "02") {
            //window.location.href = process.env.PUBLIC_URL + "/logout";
            resolve(response.data);
          }
          else
              resolve(response.data); 

          reject(data.error);
        }

        resolve(response.data);
      })      
      .catch(error => {
        reject("not resp");
      });      
  });
};

export { postAdonis, post,get };
