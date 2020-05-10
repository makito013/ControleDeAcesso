import moment from "moment";

const pegahorario = (dt) =>{
    return moment(dt).format("HH:mm:ss");
  }

const pegaData= (dt)=>{
    return moment(dt).format("YYYY-MM-DD");
  }
  
const pegaDataHora= (dt)=>{
    //return dt;
    return moment(dt).format("DD-MM-YYYY HH:mm:ss");
  }
 
const pegaDataHoraNovo= (dt)=>{
    //return dt;
    return moment(dt).format("DD/MM/YY HH:mm:ss");
  }  

  export { pegaDataHora, pegaData, pegahorario, pegaDataHoraNovo };