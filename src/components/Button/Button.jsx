/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ReactDOM from "react-dom"

class Contatos extends React.Component {
  constructor() {
    super();
    this.state = {
      contatos: []
    };
  }

  editNome = (i, e) => {
    let contatos = this.state.contatos;
    contatos[i].nome = e.target.value;
    this.setState({ contatos: contatos });
  }

  editFone = (i, e) => {
    let contatos = this.state.contatos;
    contatos[i].fone = e.target.value;
    this.setState({ contatos: contatos });
  }

  newContato = () => {
    let contatos = this.state.contatos;
    contatos.push({ nome: '', fone: '' });
    this.setState({ contatos: contatos });
  }

  render() {
    return (
      <div>
        <div className="esquerda">
        {this.state.contatos.map((c, i) =>
          <div key={i}>
            <p>
              <label>#{i} - Nome</label>
              <input type="text" value={c.nome} onChange={e => this.editNome(i, e)} />
            </p>
            <p>
              <label>#{i} - Fone</label>
              <input type="text" value={c.fone} onChange={e => this.editFone(i, e)} />
            </p>
          </div>
        )}
          <button onClick={this.newContato}>Add Contato</button>
        </div>
        <pre className="direita">
          <code>{JSON.stringify(this.state, null, 2)}</code>
        </pre>
      </div>
    );
  }
}

export default Contatos;

ReactDOM.render(<Contatos />, document.getElementById('root'));
