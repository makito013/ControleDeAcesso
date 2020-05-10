import { injectIntl } from "react-intl";
import React from "react";
import { localstorageObjeto } from "utils/Requisicoes";

class selectOp extends React.Component{
    constructor(props) {
    
        this.stringTranslate = this.stringTranslate.bind(this);
        this.selectValues = this.selectValues.bind(this);
    }
    
    stringTranslate(id){
        return injectIntl.intl.formatMessage({id: id});
    }

    options(index){
        switch (index){
            case "gender":
                return (
                    { value: 1,     label: this.stringTranslate("Select.Masculino") },
                    { value: 2,     label: this.stringTranslate("Select.Feminino")  }
                )
            break;


            case "acessControl":
                return(
                    { value: 1,     label: this.stringTranslate("Select.DisponivelOffline")         },
                    { value: 2,     label: this.stringTranslate("Select.IgnoraLimiteAcesso")        },
                    { value: 3,     label: this.stringTranslate("Select.IgnoraTempoEntreAcessos")   },
                    { value: 4,     label: this.stringTranslate("Select.PermiteAberturaFechamento") },
                    { value: 5,     label: this.stringTranslate("Select.PersonaNonGrata")           },
                    { value: 6,     label: this.stringTranslate("Select.ValidarCartaoSenha")        },
                    { value: 7,     label: this.stringTranslate("Select.AutorizaSMS")               },
                    { value: 8,     label: this.stringTranslate("Select.NaoBiometrico")             }
                )
            break;


            case "autorizationType":
                return(
                    { value: 1,     label: this.stringTranslate("Select.PermanenteREsidente")       },
                    { value: 2,     label: this.stringTranslate("Select.ComPrazoPreAutorizado")     },
                    { value: 3,     label: this.stringTranslate("Select.Visitante")                 },
                    { value: 4,     label: this.stringTranslate("Select.ExternoPermanente")         },
                    { value: 5,     label: this.stringTranslate("Select.Desativado")                }      
                )
            break;


            case "technology":
                return(
                    { value: 1,     label: this.stringTranslate(".Select.DesconhecidaQualquer"),    },
                    { value: 2,     label: this.stringTranslate("Select.Mifare")                    },
                    { value: 3,     label: this.stringTranslate("Select.RFID")                      },
                    { value: 4,     label: this.stringTranslate("Select.CodBarra")                  },
                    { value: 5,     label: this.stringTranslate("Select.ControleRemoto")            }
                )
            break;
            


            case "technology":
                var locaisAcesso = localstorageObjeto("locaisAcesso");
                const opcoes = locaisAcesso.map((prop, key) => {
                    return({value:prop[1],label:prop[0], name: "locais"});})
                
                return opcoes;
            break;
        }
    }

    render() {
        return null;
    }
}



export default selectOp