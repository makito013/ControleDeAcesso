import React from "react";
import { Table, Row, Col } from 'reactstrap';
import { pegahorario, pegaData } from "components/dataHora.jsx"
import { localstorageObjeto } from "utils/Requisicoes";
import { injectIntl } from "react-intl";


class Detalhes extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            data:props.data,
            arrayColetor:[],
            //head:props.head,
        }
        
        // localstorageObjeto("coletores").forEach(element => {
        //     this.state.arrayColetor[element[0]] = element[1];
        // })
        
        this.setState({arrayColetor: this.state.arrayColetor});
        //traduz strings
        this.stringTranslate = this.stringTranslate.bind(this);
    }

    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }
    

  render() {

    return (
        <Row style={{marginTop:"10px", marginLeft:"10px", marginRight:"10px"}}>
            <Table size="sm">
                <tr>
                    <th>{this.stringTranslate("Detalhes.table.direcao")}</th>
                    <th>{this.stringTranslate("Detalhes.table.data")}</th>
                    <th>{this.stringTranslate("Detalhes.table.hora")}</th>
                    <th>{this.stringTranslate("Detalhes.table.coletor")}</th>
                </tr>
                
                {this.state.data.ultimoAcesso.map((prop, key) => {
                    var direcao = prop.DIRECAO;
                    direcao = direcao === 1 ? this.stringTranslate("Direcao.E") : direcao === 2 ? this.stringTranslate("Direcao.S") : this.stringTranslate("Direcao.T");            
                    return (
                        <tr>                     
                        <td>{direcao}</td>                        
                        <td>{pegaData(prop.DATAHORA)}</td>
                        <td>{pegahorario(prop.DATAHORA)}</td>
                         <td>{prop.CODCOLETOR}</td> 
                        </tr>
                    );
                    
                })}

                </Table>
        </Row>
    );
  }
}

export default injectIntl(Detalhes);
