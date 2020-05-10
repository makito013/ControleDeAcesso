import React from "react";
import {Table, Row, Col } from 'reactstrap';

class Liberacao extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            data:props.data,
            head:props.head,
        }
    }

  render() {
    return (
        <Row style={{marginTop:"10px"}}>
            <Col xs="4">
            <img
              alt="..."
              className="border-gray"
              src={require("assets/img/mike.jpg")}
            />



            </Col>
            <Col xs="8">
            <Table size="sm">
                {this.state.data.map((prop, key) => {
                  return (

                      (prop === undefined || prop === "") ? null : (
                        <tr>
                            <th scope="row">{this.state.head[key]}</th>
                            <td>
                                {prop}
                            </td>
                       </tr>)

                        );
                })}


                 {/*///////Última linha///////*/}
                 <tr>
                 <td></td>
                 <td></td>
                 </tr>

                </Table>
            </Col>
        </Row>
    );
  }
}

export default Liberacao;
