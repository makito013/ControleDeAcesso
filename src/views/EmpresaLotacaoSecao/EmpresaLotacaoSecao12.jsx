import React from "react";
//import Tabela from "../../components/Tabela/Tabela"
import { toast, Slide } from 'react-toastify';



import {post,postAdonis} from "../../utils/api.js"
import { injectIntl } from "react-intl";

import {Table} from "antd"




class EmpresaLotacaoSecao extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            dataTable: [],
         
            tableHeader2:[{
              title: 'Nome',
              dataIndex: 'Nome',
              key: 'Nome',
            },
            {
              title: 'Número Sigla',
              dataIndex: 'Sigla',
              key: 'Sigla',
              width: '12%',
            },
            {
              title: 'Pública',
              dataIndex: 'address',
              width: '30%',
              key: 'address',
            },
            {
              title: 'Bloco/Apto',
              dataIndex: 'Bloco',
              width: '30%',
              key: 'Bloco',
            },
            {
              title: 'Num Vagas',
              dataIndex: 'NumeroVagas',
              width: '30%',
              key: 'NumeroVagas',
            },
            {
              title: 'Latitude',
              dataIndex: 'Latitude',
              width: '30%',
              key: 'Latitude',
            },
            {
              title: 'Longitude',
              dataIndex: 'Longitude',
              width: '30%',
              key: 'Longitude',
            },
            {
              title: 'Ações',
              dataIndex: 'address',
              width: '30%',
              key: 'address',
            }],
            linhaSelecionada: null,
            numEmpresa: null,
            modalEmpresa: false,
            modalLotacao: false,
            modalSecao: false,
        }
     
        this.atualizaTable = this.atualizaTable.bind(this);

    }

    atualizaTable(){
      const body = {
        "cmd": "listasecaolotacaoempresa",
        "token": sessionStorage.getItem("token"),
      }
      postAdonis(body,'/Empresa').then((data) =>{
        if(data.error === undefined){
      //    this.state.dataTable = data.dados;
         this.setState({dataTable: data.dados.empresa});
        }
      })
    }

    
    componentDidMount(){
        this.atualizaTable();
    }

    render(){
        return(
          <>
            <div className="content">
              
                        <Table rowSelection={this.onClickLine} columns={this.state.tableHeader2} dataSource={this.state.dataTable} />
    
            </div>
        
          </>
        )
    }
}

export default injectIntl(EmpresaLotacaoSecao);