import { toast, Slide } from 'react-toastify';

const
  CMD_Detect = 1,
  CMD_CaptureSetReader = 2,
  CMD_ImageEvent = 3;

class NKBITWebSocket {
  constructor(address) {
  this.address = address;
  this.imgtag = null;
  this.socket = null;
  this.capturing = false;
  this.onopen = function(event) {}
  this.ondetect = function(event) {}
  this.onsetreader = function(event) {}
  this.onimage = function(event) {}
  this.onerror = function(event) {}
  this.utf8ArrayToString = this.utf8ArrayToString.bind(this);
  this.base64EncArr = this.base64EncArr.bind(this);
  this.uint6ToB64 = this.uint6ToB64.bind(this);

 }


connect = function() {
  var h = this;
  this.socket = new WebSocket(this.address);
  this.socket.binaryType = 'arraybuffer';
  this.socket.onopen = this.onopen;
  this.socket.onmessage = function(event) { h.handle(event); }
  this.socket.onclose = this.onclose;
  this.socket.onerror = this.onerror;
}

handle = function(event) {
  var buf = event.data;
  var data = new DataView(buf);
  var cmd = data.getInt32(0, true);
  switch( cmd ) {
  case CMD_Detect:
    var n = data.getInt32(4, true);
    var k0 = 8;
    var readers = [];
    for( var i = 0; i < n; i++ ) {
      var k1 = k0;
      while( data.getUint8(k1) !== 10 && k1 < data.byteLength )
        k1++;
      var s = new Uint8Array(buf, k0, k1 - k0);
      var text = String.fromCharCode.apply(null, s);
      readers.push(text);
      k0 = k1 + 1;
    }
    event.readers = readers;
    this.ondetect(event);
    break;
  case CMD_CaptureSetReader:
    var status = data.getInt32(4, true);
    event.status = status;
    if( status !== 0 ) {
      var p = new Uint8Array(buf, 8);
      event.error = this.utf8ArrayToString(p);
      if( this.capturing ) {
        this.capturing = false;
      }
    }
    this.onsetreader(event);
    break;
  case CMD_ImageEvent:
    //show("Image captured");
    var o = data.getInt32(4, true);
    var u = new Uint8Array(buf, 8, o);
    var base64 = this.base64EncArr(u);
    //if( this.imgtag )
      this.imgtag = "data:image/bmp;base64," + base64;
    event.imageBMP = u;
    event.imageBMPBase64 = base64;
    this.onimage(event);
    break;
    
    default:

    break;
  }
}

detect = function(nd) {
  //console.log(arr);
  try{
    var buffer = new ArrayBuffer(8);
    var arr = new Int32Array(buffer);
    arr[0] = CMD_Detect;
    arr[1] = nd ? 1 : 0;
    this.capturing = true;
    this.socket.send(arr);
    return true;
  }
  catch{
    return false;
  }
}

setReader = function(sn) {
  var len = (sn !== "") ? sn.length : 0;
  var buffer = new ArrayBuffer(4 + len);
  var arr = new Int32Array(buffer, 0, 1);
  arr[0] = CMD_CaptureSetReader;
  if( sn !== "" ) {
    var bytes = new Uint8Array(buffer, 4, sn.length);
    for( var i = 0; i < sn.length; i++ )
        bytes[i] = sn.charCodeAt(i);
    this.capturing = true;
  } else {
    this.capturing = false;
  }
  this.socket.send(buffer);
}

utf8ArrayToString(array) {
    var codePt, byte1;
    var buffLen = array.length;

    var  result = [];
    for (var i = 0; i < buffLen;) {
        byte1 = array[i++];
        if (byte1 <= 0x7F) {
            codePt = byte1;
        } else if (byte1 <= 0xDF) {
            codePt = ((byte1 & 0x1F) << 6) | (array[i++] & 0x3F);
        } else if (byte1 <= 0xEF) {
            codePt = ((byte1 & 0x0F) << 12) | ((array[i++] & 0x3F) << 6) | (array[i++] & 0x3F);
        } else if (String.fromCodePoint) {
            codePt = ((byte1 & 0x07) << 18) | ((array[i++] & 0x3F) << 12) | ((array[i++] & 0x3F) << 6) | (array[i++] & 0x3F);
        } else {
            codePt = 63; // Cannot convert four byte code points, so use "?" instead
            i += 3;
        }
        result.push(String.fromCodePoint(codePt));
    }
    return result.join('');
}
uint6ToB64 (nUint6) {
  return nUint6 < 26 ?
      nUint6 + 65
    : nUint6 < 52 ?
      nUint6 + 71
    : nUint6 < 62 ?
      nUint6 - 4
    : nUint6 === 62 ?
      43
    : nUint6 === 63 ?
      47
    :
      65;
}

base64EncArr(aBytes) {
  var eqLen = (3 - (aBytes.length % 3)) % 3, sB64Enc = "";

  for (var nMod3, nLen = aBytes.length, nUint24 = 0, nIdx = 0; nIdx < nLen; nIdx++) {
    nMod3 = nIdx % 3;
    /* Uncomment the following line in order to split the output in lines 76-character long: */
    /*
    if (nIdx > 0 && (nIdx * 4 / 3) % 76 === 0) { sB64Enc += "\r\n"; }
    */
    nUint24 |= aBytes[nIdx] << (16 >>> nMod3 & 24);
    if (nMod3 === 2 || aBytes.length - nIdx === 1) {
      sB64Enc += String.fromCharCode(this.uint6ToB64(nUint24 >>> 18 & 63), this.uint6ToB64(nUint24 >>> 12 & 63),
      this.uint6ToB64(nUint24 >>> 6 & 63), this.uint6ToB64(nUint24 & 63));
      nUint24 = 0;
    }
  }
  return  eqLen === 0 ?
      sB64Enc
    :
      sB64Enc.substring(0, sB64Enc.length - eqLen) + (eqLen === 1 ? "=" : "==");
  }
}
export default NKBITWebSocket;
