import React, { useEffect, useState,  } from 'react';
import{ Grid, Row, Col } from 'react-bootstrap';
import SweetAlert from 'react-bootstrap-sweetalert';
import Card from 'components/Card/Card.jsx';
import api from '../../../services/api'
// jQuery plugin - used for DataTables.net
import $ from 'jquery';
// DataTables.net plugin - creates a tables with actions on it
require('datatables.net-responsive');
$.DataTable = require('datatables.net-bs');



export default function Step1() {

    
    const userId = localStorage.getItem('userId');
    const [table, setTable] = useState($("#datatables").DataTable())
    const [alert, setAlert] = useState('')
    const [client, setClient] = useState(
        <Row>
            <Col>
                <h5 className="text-center">Selecione um cliente!</h5>
            </Col>
        </Row>
    );

    useEffect(() => {
        window.sessionStorage.clear()
        hideClient();
        
        api.get('/clientes').then(response => {

            $("#datatables").DataTable().clear().destroy()

            setTable($("#datatables").DataTable({
                "pagingType": "full_numbers",
                "lengthMenu": [[5,10, 25, 50, -1], [5,10, 25, 50, "All"]],
                "orderFixed": {
                    "pre": [ 1, 'asc' ],
                    "post": [ 2, 'asc' ]
                },
                responsive: true,
                searching: true,
                data: response.data,
                columns: [
                    {   "orderable": false,
                        "width":"5%",
                        "data":  "null",
                        "className": "center",
                        "defaultContent": `<span class="btn btn-simple btn-info btn-icon select"><i class="fa fa-check"></i></span>`
                    },
                    { 
                        "data": "nome", 
                        "className": "center"
                    },
                    {   
                        "data": "numero",
                        "className": "center"
                    },
                ],
                language: {
                    info: "Total de _TOTAL_ clientes",
                    infoEmpty: "Não existem dados para esta tabela, favor cadastrar",
                    lengthMenu: "Exibir últimos _MENU_ registros ",
                    search: "_INPUT_",
                    searchPlaceholder: "Procurar cliente",
                    paginate: {
                        "first":      "Primeiro",
                        "last":       "Ultimo",
                        "next":       "Próximo",
                        "previous":   "Anterior"
                    },
                }
            })) 
        })
    }, [userId]
    );

    
    table.on('click', '.select', function () {
        var data = table.row( $(this).parents('tr') );   
        getCliente(data.data().id)
    } );

    function successAlert(message){
        
        setAlert(
            <SweetAlert
                style={{display: "block",marginTop: "-100px"}}
                title={<span className="btn btn-simple btn-info btn-icon edit" ><i className="fa fa-spinner fa-pulse fa-spin fa-5x fa-fw" style={{width: "150px"}}></i></span>}
                onConfirm={() => hideAlert()}
                showConfirm={false}
            >
                {message}
               
            </SweetAlert>
        )
    }

    function hideAlert(){
        setAlert(null)
    }
    
    async function getCliente(id){

        successAlert(`Aguarde, estamos vinculando o cliente ao orçamento`)

        await api.get(`/clientes/${id}`).then(response => {
            window.sessionStorage.setItem('cliente',JSON.stringify(response.data))
            setClient(
                <Row>
                    <Col md={12}>
                    <div className="fresh-datatables" >
                        <h5 className="text-center">Cliente selecionado!</h5>
                        
                        <table className="table table-striped table-no-bordered table-hover" cellSpacing="0" width="100%" style={{width:"100%"}}>
                            <thead>
                                <tr>
                                    <th className="text-center">Nome</th>
                                    <th className="text-center">{response.data.tipo}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="success">
                                    <td className="text-center">{response.data.nome}</td>
                                    <td className="text-center">{response.data.numero}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    </Col>
                </Row>
            )
        })
        hideAlert();
    };

    function hideClient(){
        setClient(
            <Row>
                <Col>
                    <h5 className="text-center">Selecione um cliente!</h5>
                </Col>
            </Row>
        )
    }

    return (
        <div className="wizard-step">
            {alert}
            <Grid fluid>
                {client}
                <Row>
                    <Col md={12}>
                        <Card
                           content={   
                                <div className="fresh-datatables" >
                                    <table id="datatables" className="table table-striped table-no-bordered table-hover" cellSpacing="0" width="100%" style={{width:"100%"}}>
                                        <thead>
                                            <tr>
                                                <th  className="disabled-sorting"></th>
                                                <th>Nome</th>
                                                <th>Número</th>
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
    )
}
