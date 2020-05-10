import {Cookies} from 'react-cookie';

const crypto = require('crypto');
const algorithm = 'aes-256-cbc';


async function verificaIv(){
    let iv = crypto.randomBytes(16);
    let key = crypto.randomBytes(32);
    let cookies = new Cookies();

    var cookieIv = await cookies.get('IvNk');
    var cookieKey = await cookies.get('KeyNk');

    if( cookieIv === undefined || cookieKey === undefined){
        await cookies.set('IvNk', iv, { path: '/' });
        await cookies.set('KeyNk', key, { path: '/' });
        return {iv:iv, key:key};
    }
        
    else{
        return {iv:cookieIv, key:cookieKey};
    }
        

}

async function encrypt(text){
    const cryp = await verificaIv();
    let cipher = crypto.createCipheriv(algorithm, cryp.key.data, cryp.iv.data);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
}

async function decrypt (text) {
    const cryp = await verificaIv();
    let encryptedText = Buffer.from(text, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, cryp.key.data, cryp.iv.data);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

export {encrypt, decrypt}