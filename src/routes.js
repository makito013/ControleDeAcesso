import React from "react";
import MonitorAcesso from "views/monitorAcesso.jsx";
import Ajustes from "views/monitorAcesso.jsx";
import EmpresaLotacaoSecao from './views/EmpresaLotacaoSecao/EmpresaLotacaoSecao';
import Horario from "views/Horario.jsx";
import CategoriaPessoa from "./views/CategoriaPessoa/CategoriaPessoa";
import LocaisAcessoColetor from "./views/LocaisAcessoColetor/LocaisAcessoColetor.jsx";
import Jornada from "views/Jornadas.jsx";
import Veiculos from "views/Veiculos/Veiculos.jsx";
import AjustesJornada from "./views/AjustesJornada/AjustesJornada";
import CadastroAutorizado from "./views/CadastroAutorizado/CadastroAutorizado";
import error404 from  "./views/404.jsx";
import AutorizacaodeAcesso from  "./views/AutorizacaodeAcesso.jsx";
import ExportacaoAcesso from "./views/ExportacaoAcesso/ExportacaoAcesso";
import EditarAcesso from "./views/EditarAcesso/EditarAcesso";
import PermissaoLocalAcesso from "./views/PermissaoLocalAcesso/PermissaoLocalAcesso";
import indexDokeo from "./views/initDok";
import SincronizarColetores from "./views/SincronizarColetores/SincronizarColetores";
import HistoricoAcesso from "./views/HistoricoAcesso/HistoricoAcesso";
import PessoasUltimosAcessos from "./views/PessoasUltimosAcessos/PessoasUltimosAcessos";
import HistoricoAlteracaoJornada from "./views/HistoricoAlteracaoJornada/HistoricoAlteracaoJornada";
import AcessosComuns from "./views/AcessosComuns/AcessosComuns";
import AcessosColetor from "./views/AcessosColetor/AcessosColetor";
import AcessosPessoa from "./views/AcessosPessoa/AcessosPessoa";
import AcessosSecao from "./views/AcessosSecao/AcessosSecao";
import TempoPermanencia from "./views/TempoPermanencia/TempoPermanencia";
import TotalHorasAmbiente from "./views/TotalHorasAmbiente/TotalHorasAmbiente";
import PermissaoGerencial from "./views/Configuracoes/PermissaoGerencial";
import DevolucaoDeCartao from "./views/DevolucaodeCartao/DevolucaodeCartao";
import PerfisAcesso from "./views/Configuracoes/PerfisAcesso";
import Pesquisar from "./views/pesquisar";
import Relatorios from "./views/Relatorios";
import Liberacao from './views/Liberacao';


var routesPortaria = [
  {
    path: "/monitoramento",
    name: "MonitorDeAcesso",
    icon: "fas fa-id-badge",
    component: MonitorAcesso,
    layout: "/portaria"
  },
  {
    path: "/pesquisa",
    name: "Pesquisar",
    icon: "fas fa-search" ,
    component: Pesquisar,
    layout: "/portaria"
  },
  {    
    path: "/relatorio",
    name: "Relatorio",
    icon: "fas fa-file-alt",
    component: Relatorios,
    layout: "/portaria"
  },

  {
    path: "/Liberacao",
    layout: "/portaria",
    component: Liberacao,    

  },
];

var routes = [
    
    //MARK: CADASTRO
    {
        path: "/Dokeo",
        icon: "fas fa-address-card",
        component: indexDokeo,
        layout: "",
    },
    {
        path: "/Cadastro",
        name: "Cadastro",
        icon: "fas fa-address-card",
        //component: indexDokeo,
        layout: "/admin",
        codItemHabilitavel: 2
    },
    {
        path: "/EmpresaLotacaoSecao",
        name: "Empresa/Lotação/Seção",
        component: (operacoes) => <EmpresaLotacaoSecao operacoes={operacoes}/>,
        layout: "/Cadastro",
        codItemHabilitavel: 3
    },
    {
        path: "/Horario",
        name: "Horário",
        component: (operacoes) => <Horario operacoes={operacoes}/>,
        layout: "/Cadastro",
        codItemHabilitavel: 4
    },
    {
        path: "/Jornada",
        name: "Jornada",
        component: (operacoes) => <Jornada operacoes={operacoes}/>,
        layout: "/Cadastro",
        codItemHabilitavel: 5
    },
    {
        path: "/CategoriaPessoas",
        name: "Categoria de Pessoas",
        icon: "tim-icons icon-badge",
        component: (operacoes) => <CategoriaPessoa operacoes = {operacoes}/>,
        layout: "/Cadastro",
        codItemHabilitavel: 6
    },
    {
        path: "/Veiculo",
        name: "Veículos",
        icon: "tim-icons icon-badge",
        component: (operacoes) => <Veiculos operacoes={operacoes}/>,
        layout: "/Cadastro",
        codItemHabilitavel: 7
    },
    {
        path: "/LocaisAcessoColetor",
        name: "Locais de Acesso/Coletor",
        icon: "tim-icons icon-badge",
        component: (operacoes) => <LocaisAcessoColetor operacoes={operacoes}/>,
        layout: "/Cadastro",
        codItemHabilitavel: 8
    },
    {
        path: "/CadastroAutorizado",
        name: "Cadastro Autorizado",
        icon: "tim-icons icon-badge",
        component: (operacoes) => <CadastroAutorizado operacoes={operacoes}/>,
        layout: "/Cadastro",
        codItemHabilitavel: 9
    },
    //------------------------------------------//

    // MARK: AJUSTES
    {
        path: "/Ajustes",
        name: "Ajustes",
        icon: "fas fa-sliders-v-square",
        //component: Ajustes,
        layout: "/admin",    
        codItemHabilitavel: 10   
    },
    {
        path: "/AjustesJornada",
        name: "Ajustes1",
        component: (operacoes) => <AjustesJornada operacoes={operacoes}/>,
        layout: "/Ajustes",
        codItemHabilitavel: 11
    },
    {
        path: "/AutorizacaodeAcesso",
        name: "Ajustes2",
        component: (operacoes) => <AutorizacaodeAcesso operacoes={operacoes}/>,
        layout: "/Ajustes",
        codItemHabilitavel: 12
    },
    {
        path: "/permicaoAcesso",
        name: "Ajustes3",
        component: (operacoes) => <PermissaoLocalAcesso operacoes = {operacoes}/>,
        layout: "/Ajustes",
        codItemHabilitavel: 13
    },
    {
        path: "/editarRegistros",
        name: "Ajustes5",
        icon: "tim-icons icon-badge",
        component: (operacoes) => <EditarAcesso operacoes={operacoes}/>,
        layout: "/Ajustes",
        codItemHabilitavel: 14
    },
    {
        path: "/exportacaoAcesso",
        name: "Ajustes6",
        icon: "tim-icons icon-badge",
        component: (operacoes) => <ExportacaoAcesso operacoes={operacoes}/>,
        layout: "/Ajustes",
        codItemHabilitavel: 15
    },
        // {
    //     path: "/sincronizarColetores",
    //     name: "Ajustes4",
    //     icon: "tim-icons icon-badge",
    //     component: SincronizarColetores,
    //     layout: "/Ajustes",
    // },
    //---------------------------------------------//


     // MARK: RELATÓRIO
     {
        path: "/Relatorios",
        name: "Relatórios",
        icon: "fas fa-file-chart-pie",
    //    component: Ajustes,
        layout: "/admin",
        codItemHabilitavel: 16
    },
    {
        path: "/historicoAcesso",
        name: "relatorio1",
        icon: "tim-icons icon-badge",
        component: (operacoes) => <HistoricoAcesso operacoes={operacoes}/>,
        layout: "/Relatorios",
        codItemHabilitavel: 17
    },
    {
        path: "/pessoasAcesso",
        name: "relatorio2",
        component: (operacoes) => <PessoasUltimosAcessos operacoes={operacoes}/>,
        layout: "/Relatorios",
        codItemHabilitavel: 18
    },
    {
        path: "/historicoJornada",
        name: "relatorio3",
        icon: "tim-icons icon-badge",
        component: (operacoes) => <HistoricoAlteracaoJornada operacoes = {operacoes}/>,
        layout: "/Relatorios",
        codItemHabilitavel: 19
    },
    {
        path: "/AcessosComuns",
        name: "relatorio4",
        component: (operacoes) => <AcessosComuns operacoes = {operacoes}/>,
        layout: "/Relatorios",
        codItemHabilitavel: 20
    },
    {
        path: "/acessosColetor",
        name: "relatorio5",
        icon: "tim-icons icon-badge",
        component: (operacoes) => <AcessosColetor operacoes = {operacoes}/>,
        layout: "/Relatorios",
        codItemHabilitavel: 21
    },
    {
        path: "/acessosPessoa",
        name: "relatorio6",
        icon: "tim-icons icon-badge",
        component: (operacoes) => <AcessosPessoa operacoes = {operacoes}/>,
        layout: "/Relatorios",
        codItemHabilitavel: 22
    },
    {
        path: "/acessosSecao",  
        name: "relatorio7",
        icon: "tim-icons icon-badge",
        component: (operacoes) => <AcessosSecao operacoes = {operacoes}/>,
        layout: "/Relatorios",
        codItemHabilitavel: 23
    },
    {
        path: "/tempoPermanencia",
        name: "relatorio8",
        icon: "tim-icons icon-badge",
        component: (operacoes) => <TempoPermanencia operacoes = {operacoes}/>,
        layout: "/Relatorios",
        codItemHabilitavel: 24
    },
    {
        path: "/horasAmbiente",
        name: "relatorio9",
        icon: "tim-icons icon-badge",
        component: (operacoes) => <TotalHorasAmbiente operacoes = {operacoes}/>,
        layout: "/Relatorios",
        codItemHabilitavel: 25
    },
	{
        path: "/devolucaoCartao",
        name: "relatorio10",
        icon: "tim-icons icon-badge",
        component: DevolucaoDeCartao,
        layout: "/Relatorios",
    },
    {
        path: "/permissaoGerencial",
        name: "PermissoesGerenciais",
        component: (operacoes) => <PermissaoGerencial operacoes = {operacoes}/>,
        layout: "/Relatorios",
        codItemHabilitavel: 27
    },
    {
        path: "/perfisAcesso",
        name: "PerfisAcesso",
        component: (operacoes) => <PerfisAcesso operacoes = {operacoes}/>,
        layout: "/Relatorios",
        codItemHabilitavel: 28
    },
    //---------------------------------------------//

    //MARK: CONFIGURAÇÃO
    {
        path: "/Seguranca",
        name: "Seguranca",
        icon: "fas fa-file-chart-pie",
        //component: Ajustes,
        layout: "/admin",       
        codItemHabilitavel: 26
    },
    //---------------------------------------------//
];
export {routes, routesPortaria};