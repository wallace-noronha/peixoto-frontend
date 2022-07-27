import React, { useEffect, useState } from "react";
import{ Grid, Row, Col } from 'react-bootstrap';
import SweetAlert from 'react-bootstrap-sweetalert';
import { useHistory } from 'react-router-dom'

import api from '../../services/api'

import Card from 'components/Card/Card.jsx';

// jQuery plugin - used for DataTables.net
import $ from 'jquery';
// DataTables.net plugin - creates a tables with actions on it
require('datatables.net-responsive');
$.DataTable = require('datatables.net-bs');


export default function Lista(props) {

    // const [produtos, setProdutos] = useState([])
    const orcamentoId = localStorage.getItem('orcamentoId');
    const [alert, setAlert] = useState('')
    const [table, setTable] = useState($("#datatables").DataTable())
    const [renderForm] = useState()
    const [orcamentos, setOrcamentos] = useState([])
    const history = useHistory();

    useEffect(() => {
        api.get('/orcamentos').then(response => {

            $("#datatables").DataTable().clear().destroy()

            setTable($("#datatables").DataTable({
                "pagingType": "full_numbers",
                "lengthMenu": [[5,10, 25, 50, -1], [5,10, 25, 50, "All"]],
                "orderFixed": {
                    "pre": [ 6, 'desc' ],
                    // "post": [ 6, 'asc' ]
                },
                responsive: true,
                searching: true,
                data: response.data,
                "columnDefs": [ {
                    // "width": "2%",
                    "orderable": false,
                    "targets": 0,
                    // "data": "Editar",
                    "render": function ( data, type, row, meta ) {
                      return `<span class="btn btn-simple btn-info btn-icon edit"><i class="fa fa-print"></i></span>`;
                    }
                  },
                  {
                    // "width": "2%",
                    "targets": 1,
                    "orderable": false,
                    // "data": "Remover",
                    "render": function ( data, type, row, meta ) {
                      return '<span class="btn btn-simple btn-danger btn-icon remove"><i class="fa fa-times"></i></span>';
                    }
                  } 
                ],
                columns: [
                    null,
                    null,
                    {   
                        "targets": 2,
                        "data": "cliente.nome",
                        "className": "center"
                    },
                    { 
                        "targets": 3,
                        "data": "total",
                        "render": function (data, type, row) {
                            return Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(data)
                        },
                        "className": "center"
                    },
                    { 
                        "targets": 4,
                        "data": "descricao", 
                        "className": "center"
                    },
                    { 
                        "targets": 5,
                        "data": "produtos", 
                        "render":"[ <br> ].nome",
                        "className": "center nowrap"
                    },
                    { 
                        "targets": 6,
                        "data": "data", 
                        "className": "center"
                    },
                ],
                language: {
                    info: "Total de _TOTAL_ orcamentos",
                    infoEmpty: "Não existem dados para esta tabela, favor cadastrar",
                    lengthMenu: "Exibir últimos _MENU_ registros ",
                    search: "_INPUT_",
                    searchPlaceholder: "Procurar orçamento",
                    paginate: {
                        "first":      "Primeiro",
                        "last":       "Ultimo",
                        "next":       "Próximo",
                        "previous":   "Anterior"
                    },
                }
            }))
        })}, [orcamentoId]
    );

    table.on( 'click', '.edit', function (e) {
        e.preventDefault();
        var data = table.row( $(this).parents('tr') ).data();
        history.push({pathname: '/orcamentos/editar',search: `?id=${data.id}`})
        
    } );


    table.on( 'click', '.remove', function (e) {
        e.preventDefault();
        var data = table.row( $(this).parents('tr') ).data();
        warning(data, $(this).parents('tr'))
    } );

    function successAlert(message){
    
        setAlert(
            <SweetAlert
                success
                style={{display: "block",marginTop: "-100px"}}
                title="OK"
                onConfirm={() => hideAlert()}
                onCancel={() =>  hideAlert()}
                confirmBtnBsStyle="info"
            >
                {message}
            </SweetAlert>
        )
    }
    
    function errorAlert(message){
        
        setAlert(
            <SweetAlert
                error
                style={{display: "block",marginTop: "-100px"}}
                title="Erro"
                onConfirm={() => hideAlert()}
                onCancel={() =>  hideAlert()}
                confirmBtnBsStyle="danger"
            >
                {message}
            </SweetAlert>
        )
    }

    function  warning(orcamento, column){
        setAlert(
            <SweetAlert
                warning
                style={{display: "block",marginTop: "-100px"}}
                title="Tem certeza?"
                onConfirm={() => deletar(orcamento, column)}
                onCancel={() => hideAlert()}
                confirmBtnBsStyle="info"
                cancelBtnBsStyle="danger"
                confirmBtnText="Sim, deletar!"
                cancelBtnText="Cancel"
                showCancel
            >
                Podemos deletar o orcamento? 
            </SweetAlert>
        )
        
    }

    function hideAlert(){
        setAlert(null)
    }

    async function deletar(orcam, column) {  
         try{
            await api.delete(`/orcamentos/${orcam.id}`)
            successAlert(`Orcamento deletado com sucesso`);
            setOrcamentos(orcamentos.filter(or => or.id !== orcam.id));
            table.row(column).remove().draw();
          }catch{
              errorAlert(`Erro ao deletar orçamento, tente novamente!`);
          }
    }

    return (
        <div className="main-content">
            
            {alert}
            {renderForm}
            <Grid fluid>
                <Row>
                    <Col md={12}>
                        <Card
                            title="Lista de orçametos cadastrados"
                            content={   
                                <div className="fresh-datatables" >
                                    <table id="datatables" className="table table-striped table-no-bordered table-hover " cellSpacing="0" width="100%" style={{width:"100%"}}>
                                        <thead>
                                            <tr>
                                                <th className="disabled-sorting text-center"></th>
                                                <th className="disabled-sorting text-center"></th>
                                                <th>Cliente</th>
                                                <th>Total</th>
                                                <th>Descrição</th>
                                                <th>Produtos</th>
                                                <th>Data</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
                            }
                        />
                    </Col>
                </Row>
            </Grid>
        </div>
    );
}