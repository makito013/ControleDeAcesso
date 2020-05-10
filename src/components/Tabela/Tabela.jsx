import React from "react";
import BootstrapTreeTable from 'bootstrap-react-treetable';
import ReactDOM from "react-dom";


import {post} from "../../utils/api.js"

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
  Input,
  Button,
  CardFooter,
  Table
} from "reactstrap";

var atualizou1 = false;
var atualizou2 = false;

class Tabela extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            tableData: this.props.dataTable,
            tableHeader: this.props.tableHeader,
            expanded: [],
        }
        this.handleClickExpand = this.handleClickExpand.bind(this);
        this.handleClickLine = this.handleClickLine.bind(this);
    }

    handleClickExpand(prop, level){
        prop.expand = !prop.expand;
        if (prop.expand){
            this.state.expanded.push([prop.key, level]);
        }else{
            for(var i = 0, j = this.state.expanded.length; i < j; i++){
                if (Boolean(this.state.expanded[i]) !== false 
                    && (this.state.expanded[i][0] === String(prop.key) || (this.state.expanded[i][0] === prop.key) 
                    && this.state.expanded[i][1] === level)){
                    this.state.expanded.splice(i, 1);
                }
            }
        }
        this.setState({expanded: this.state.expanded})
    }

    handleClickLine(object, level){
        this.props.onClickLine(object, level)
    }

    componentDidUpdate(){
        if (atualizou1){
            atualizou1 = false;
        }
        else{
            this.setState({tableData: this.props.dataTable});
            atualizou1 = true;
        }
    }
    

    render(){
        return(
            <>
            <Table responsive hover size="sm">
                <thead>
                    <tr>
                    <th onClick={this.setCabecalho}>#</th>
                    {this.state.tableHeader.map((prop, key) =>{
                        if(key === this.state.tableHeader.length - 1)
                            return(<th style={{textAlign:"center"}}>{prop}</th>)
                        else    
                            return(<th>{prop}</th>)
                    })}
                    </tr>
                </thead>
                <tbody>
                    {this.state.tableData.map((prop) => {
                        var p1 = null;
                        var p2 = null;
                        var n1 = null;
                        var n2 = null;
                        var n0 = null;
                        const level0 = 0;
                        const level1 = 1;
                        const  level2 = 2;
                        for (var i = 0, j = this.state.expanded.length; i < j; i++){
                            if (this.state.expanded[i][0] === prop.key && this.state.expanded[i][1] === 0){
                                prop.expand = true;
                            }
                        }
                        if(prop.expand){
                            p2 =
                            prop.child.map((prop) =>{
                                n1++;
                                for (var i = 0, j = this.state.expanded.length; i < j; i++){
                                    if (this.state.expanded[i][0] === prop.key && this.state.expanded[i][1] === 1){
                                        prop.expand = true;
                                    }
                                }
                                if(prop.expand){
                                    p1 =
                                    prop.child.map((prop) =>{
                                        n2 = 0;
                                        let tam = Object.entries(prop.data).length;
                                        return(
                                        <tr onClick={(e) => this.handleClickLine(prop, 2)}>
                                            <td style={{paddingLeft:"40px"}}> {Boolean(prop.child) ? (prop.child.length > 0 ? (prop.expand ? (<i onClick={()=> this.handleClickExpand(prop, level2)} className="tim-icons icon-minimal-down" style={{top:"0", paddingLeft: "10px", color:"blue", cursor:"pointer"}} />)
                                            : (<i onClick={(e)=> this.handleClickExpand(prop,level2)} className="tim-icons icon-minimal-right" style={{top:"0", paddingLeft: "10px", color:"blue", cursor:"pointer"}} />)) : "") : ""}</td>
                                            {Object.entries(prop.data).map((prop, key) => {
                                                 n2++;
                                                 if (n2 === 1)
                                                     return(<td>{">>>>"+prop[1]}</td>);
                                                 else if (n2 === tam)
                                                    return(<td style={{textAlign:"center", width: "150px"}}>{prop[1]}</td>)
                                                 else
                                                    return(<td>{prop[1]}</td>)
                                            })}
                                        </tr>
                                        )
                                    });
                                }else{
                                    p1 = null;
                                }
                                n1 = 0;
                                let tam = Object.entries(prop.data).length;
                                return(
                                <>
                                <tr onClick={(e) => this.handleClickLine(prop, 1)}>
                                <td style={{paddingLeft:"20px"}}> {Boolean(prop.child) ? (prop.child.length > 0 ? (prop.expand ? (<i onClick={()=> this.handleClickExpand(prop,level1)} className="tim-icons icon-minimal-down" style={{top:"0", paddingLeft: "10px", color:"blue", cursor:"pointer"}} />)
                                            : (<i onClick={()=> this.handleClickExpand(prop,level1)} className="tim-icons icon-minimal-right" style={{top:"0", paddingLeft: "10px", color:"blue", cursor:"pointer"}} />)) : "") : ""}</td>
                                    {Object.entries(prop.data).map((prop, key) => {
                                        n1++;
                                        if (n1 === 1)
                                            return(<td><>>> {prop[1]}</></td>);
                                        else if (n1 === tam)
                                            return(<td style={{textAlign:"center", width: "150px"}}>{prop[1]}</td>)
                                        else
                                            return(<td>{prop[1]}</td>)
                                    })}
                                </tr>
                                {p1}
                                </>
                                )
                            });
                        }else{
                            p2 = null;
                        }
                        n0 = 0;
                        let tam = Object.entries(prop.data).length;
                        return (
                        <>
                        <tr onClick={(e) => this.handleClickLine(prop, 0)}>
                        <td> {Boolean(prop.child) ? (prop.child.length > 0 ? (prop.expand ? (<i onClick={()=> this.handleClickExpand(prop,level0)} className="tim-icons icon-minimal-down" style={{top:"0", paddingLeft: "10px", color:"blue", cursor:"pointer"}} />)
                                            : (<i onClick={()=> this.handleClickExpand(prop,level0)} className="tim-icons icon-minimal-right" style={{top:"0", paddingLeft: "10px", color:"blue", cursor:"pointer"}} />)) : "") : ""}</td>
                            {Object.entries(prop.data).map((prop, key) => {
                                n0++;
                                if (n0 === tam)
                                    return(<td style={{textAlign:"center", width: "150px"}}>{prop[1]}</td>)
                                else
                                    return(<td>{prop[1]}</td>)
                            })}
                        </tr>
                        {p2}
                        </>
                        )
                        
                        if(prop.expand){
                            prop.child.map((prop) =>{
                                return(
                                <tr>
                                    {prop.data.map((prop) =>{
                                        return(<td>{prop}</td>)
                                    })}
                                </tr>
                                )
                                if(prop.expand){
                                    prop.child.map((prop) =>{
                                        return(
                                        <tr>
                                            {prop.data.map((prop) =>{
                                                return(<td>{prop}</td>)
                                            })}
                                        </tr>
                                        )
                                    })
                                }
                            })
                        }
                        
                    })}
                </tbody>
            </Table>
            <>{atualizou1 ? (atualizou2 ?  atualizou2 = false : (atualizou2 = true, this.setState({tableData: this.state.tableData}))) : null}</>
            </>
        )
    }
}

export default Tabela;