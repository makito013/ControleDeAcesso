import React from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
 // Table,
  Row,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
  FormGroup,
  Label,
  CustomInput,
  Form,
} from "reactstrap";
import { injectIntl } from "react-intl";
import { Table } from 'antd';
import { SMALL } from "material-ui/utils/withWidth";



class TabelaAutorizados extends React.Component {
  constructor(props) {
      super(props);
      this.state = { 
        currentPage:0, 
        pageSize:15, 
        pagesCount:0,
      }
    //Traduz as strings
    this.stringTranslate = this.stringTranslate.bind(this);
    this.pagesCount = 0;
    this.showTotal = this.showTotal.bind(this);

    this.columns = [
        {

          title: this.stringTranslate("Label.TipoAutorizado"),
          dataIndex: 'tipoAutorizado',
          filters: [
            {
              text: this.stringTranslate("Select.Visitante"),
              value: this.stringTranslate("Select.Visitante"),
            },
            {
              text: this.stringTranslate("Select.ComPrazoPreAutorizado"),
              value: this.stringTranslate("Select.ComPrazoPreAutorizado"),
            },
            {
                text: this.stringTranslate("Select.PermanenteResidente"),
                value: this.stringTranslate("Select.PermanenteResidente"),
            },
            {
                text: this.stringTranslate("Select.ExternoPermanente"),
                value: this.stringTranslate("Select.ExternoPermanente"),
            },
          ],
          onFilter: (value, record) => record.tipoAutorizado.indexOf(value) === 0,
        },
        {
          title: this.stringTranslate("Label.PIN")+"2",
          dataIndex: "PIN2",
          align:"left",
          sorter: (a, b) => a.PIN2 - b.PIN2,
        },
        {
            title: this.stringTranslate("Label.Nome"),
            dataIndex: 'nome',
            key: "nome",
            defaultSortOrder:"ascend",
            onFilter: (value, record) => record.nome.indexOf(value) === 0,
            sorter: (a, b) => a.nome.length - b.nome.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: this.stringTranslate("Label.Matricula"),
            dataIndex: 'matricula',
        },
        {
            title: this.stringTranslate("Label.Cracha"),
            dataIndex: "cracha",
        },
        {
            title: this.stringTranslate("Label.PIN"),
            dataIndex: "PIN",
        },

        {
            title: this.stringTranslate("Label.Comandos"),
            dataIndex: "comandos", 
        },
      ];
      
  }

    stringTranslate(id){
      return this.props.intl.formatMessage({id: id});
    }

    showTotal(total) {
        console.log(total)
        return total + " " + this.stringTranslate("Label.AutorizadoEncontrados");
      }


    render() {
      this.pagesCount = Math.ceil(this.props.tableData.length/this.state.pageSize);
      return (
        <>
            <Card>              
                <CardBody>
                    <Table 
                        scroll={{x:1000}}
                        size="small"                         
                        pagination={{showTotal:this.showTotal, showSizeChanger:true, pageSizeOptions:["10", "20", "50", "100"], showLessItems:true, hideOnSinglePage:true}}
                        columns={this.columns} 
                        dataSource={this.props.tableData} 
                        locale={{filterConfirm: 'Ok'
                                ,filterReset: this.stringTranslate("Label.Limpar")
                                ,emptyText: " "}}/>
                </CardBody>
            </Card>
        </>
      );
    }
}

export default injectIntl(TabelaAutorizados);
