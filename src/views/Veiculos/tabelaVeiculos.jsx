import React from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
} from "reactstrap"; 
import { Table } from 'antd';
import { injectIntl } from "react-intl";
import { Skeleton } from 'antd';

class TabelaVeiculos extends React.Component {
  constructor(props) {
      super(props);
      this.state = { 
        
      }
    //Traduz as strings
    this.stringTranslate = this.stringTranslate.bind(this);
	this.columns = [
        {
          title: this.stringTranslate("Veiculos.Tabela.Head.Placa"),
          dataIndex: 1,
        },
        {
            title: this.stringTranslate("Veiculos.Tabela.Head.Modelo"), 
            dataIndex: 2,
        },
        {
            title: this.stringTranslate("Veiculos.Tabela.Head.Proprietario"),
            dataIndex: 3,
        },
        {
            title: this.stringTranslate("Veiculos.Tabela.Head.Marca"),
            dataIndex: 4,
        },
        {
            title: this.stringTranslate("Veiculos.Tabela.Head.Cor"),
            dataIndex: 5,
        },
        {
            title: this.stringTranslate("Veiculos.Tabela.Head.Categoria"),
            dataIndex: 6,
        },
        {
            title: this.stringTranslate("Veiculo.Tabela.Comandos"),
            dataIndex: 7,
        },
      ];
  }

    stringTranslate(id){
      return this.props.intl.formatMessage({id: id});
    }



    render() {
      this.pagesCount = Math.ceil(this.props.tableData.length/this.state.pageSize);
      return (
        <>
            <Card>              
            <CardHeader className="card-table-header">
            </CardHeader>
                <CardBody style={{marginRight:"10px"}} >
				<Skeleton loading={this.props.loading} active>
				<Table 
					size="small"                         
					pagination={{showTotal:this.showTotal, showSizeChanger:true, pageSizeOptions:["10", "20", "50", "100"], showLessItems:true, hideOnSinglePage:true}}
					columns={this.columns} 
					dataSource={this.props.tableData} 
					locale={{filterConfirm: 'Ok'
						,filterReset: this.stringTranslate("Label.Limpar")
						,emptyText: " "}}
				/>
				</Skeleton>
                </CardBody>
            </Card>
           
        </>
      );
    }
}

export default injectIntl(TabelaVeiculos);
