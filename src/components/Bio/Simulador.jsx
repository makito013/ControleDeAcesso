import React from "react";

// reactstrap components
import 'assets/css/paper-dashboard.css';
import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Input,
    Button,
    Row,
    Col,
  } from "reactstrap";

import NKBITWebSocket from 'utils/nkbitweb.js'
import { FormGroup } from "@material-ui/core";
import ModalCadastroBiometrico from "components/Modal/ModalCadastroBiometrico"




var msgline;
var nkbit = new NKBITWebSocket("ws://localhost:5109");

function show(msg) {
  console.log(msg);
}

function elem(id) {
  return document.getElementById(id);
}

//--- nkbit events ---//

// onopen event: same as WebSocket onopen
nkbit.onopen = function(e) {
  show("Connected to NK-BIT");
  elem("moInactive").disabled = false;
  elem("moDevelopment").disabled = false;
};

// ondetect event:
//   event.readers contains an array of reader numbers
nkbit.ondetect = function(event) {
  var readers = elem("readers");
  readers.innerHTML = "";
  var option = document.createElement("option");
  option.text = "(select a reader)";
  readers.add(option);
  var n = event.readers.length;
  for( var i = 0; i < n; i++ ) {
    option = document.createElement("option");
    option.text = event.readers[i];
    readers.add(option);
  }
  if( n == 1 )
    readers.selectedIndex = 1;
}

// onsetreader event:
//   event.status = 0 if ok, or error code
//   event.error: contains an error message if not ok
nkbit.onsetreader = function(event) {
  if( event.status == 0 ) {
    if( nkbit.capturing )
      show("Capture active: place a finger");
    else
      show("Capture inactive");
  } else {
    show("ERROR: " + event.error);
    document.getElementById("moInactive").checked = true;
  }
}

// onimage event: when an image is captured, it's displayed in capturedImage
//   event.imageBMP: array of bytes containing a BMP file
//   event.imageBMPBase64: same as imageBMP converted to base64
nkbit.onimage = function(event) {
  show("Image captured");
  console.log(event)
}

// onclose event: same as WebSocket onclose
nkbit.onclose = function(event) {
  if (event.wasClean) {
    show(`Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    show(`Connection died: code=${event.code}`);
  }
  elem("detect").disabled = true;
  elem("moInactive").disabled = true;
  elem("moDevelopment").disabled = true;
};

// onerror: same as WebSocket onerror
nkbit.onerror = function(error) {
  show(`[error] ${error.message}`);
};

//------//

// on loading: connect to NK-BIT
function connect() {
  msgline = elem('msgline');
  show("connecting...");

  // set the <img> element to display the image
  nkbit.imgtag = elem("capturedImage");

  // connect to the web socket
  nkbit.connect();
}

// detect(): called by "Detect readers" button

// startCapture(): call nkbit.setReader(sn) with the serial number chosen
function startCapture() {
  var readers = document.getElementById("readers");
  var sn = readers.value;
  if( readers.selectedIndex > 0 && sn ) {
    nkbit.setReader(sn);
  } else {
    alert("Select a reader");
    elem("moInactive").checked = true;
  }
}

// stopCapture(): call nkbit.setReader("")
function stopCapture() {
  console.log("HGF");
  nkbit.setReader("");
}

function passaImagem(event, Simulador){
  Simulador.setState({
    lastImage: event.imageBMPBase64,
  })
}


class Simulador extends React.Component {
  constructor(props) {

    super(props);

    this.state={
      nd: true,
      lastImage: null,
     }
    this.detect = this.detect.bind(this);
    this.connect = this.connect.bind(this);
    this.sleep = this.sleep.bind(this);
  //  this.handleSendPlaca =this.detect.bind(this);
  }

  sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  

  /*componentDidMount() {
    this.connect();
    setTimeout(this.detect, 500);
    setInterval(() => {
      if (elem("moInactive").checked)
        this.detect();
      }, 5000);
  }*/
  connect() {
    msgline = elem('msgline');
    show("connecting...");
  
    // set the <img> element to display the image
    nkbit.imgtag = elem("capturedImage");
  
    // connect to the web socket
    nkbit.connect();
    
  }
  detect() {
    // see ondetect event to get the result
    console.log("Detecting...");
    var nd = this.state.nd;
    console.log("Detecting...");
    nkbit.detect(nd);
  }
   
render() {
  return(
    <>
    <div id='innerHTML'/>
      <Card>
        <CardHeader>
          <CardTitle tag="h4" sty >Coletor de digitais</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col sm="3">
              <ModalCadastroBiometrico />
            </Col>
            <Col sm="6" style={{paddingTop:"8px"}}>
              <FormGroup>
                <Input type="select" id="readers">
                  <option select="true" defaultValue="no">(no readers)</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <input type="checkbox" id="nd"/><label htmlFor="nd">Include network devices</label>
              <label>
              Set operation mode:
              </label>
              
                <input type="radio" name="mo" id="moInactive"  disabled={true} onClick={stopCapture} checked={true}/>
                <label htmlFor="moInactive">Inactive</label> &nbsp;
                <input type="radio" name="mo" id="moDevelopment"disabled={false} onClick={startCapture}/>
                <label htmlFor="moDevelopment">Development</label>    
              {/* <RadioButton/> */}
            </Col>
          </Row>
          <Row>
            <Col>
              <img id="capturedImage" style={{width:"100px", height:"100px"}} />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
    );
  }
}
export default Simulador;
