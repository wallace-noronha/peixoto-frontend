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

    const [clientes, setClientes] = useState([])
    const clienteId = localStorage.getItem('clienteId');
    const [alert, setAlert] = useState('')
    const [table, setTable] = useState($("#datatables").DataTable())
    const [renderForm] = useState()
    const history = useHistory();

    useEffect(() => {
        api.get('/clientes').then(response => {
            setClientes(response.data);

            $("#datatables").DataTable().clear().destroy()

            console.log(response.data)
            setTable($("#datatables").DataTable({
                "pagingType": "full_numbers",
                "lengthMenu": [[5,10, 25, 50, -1], [5,10, 25, 50, "All"]],
                responsive: true,
                searching: true,
                data: response.data,
                "columnDefs": [ {
                    "width": "2%",
                    "orderable": false,
                    "targets": 0,
                    "data": "Editar",
                    "render": function ( data, type, row, meta ) {
                      return `<span class="btn btn-simple btn-info btn-icon edit"><i class="fa fa-edit"></i></span>`;
                    }
                  },
                  {
                    "width": "2%",
                    "targets": 1,
                    "orderable": false,
                    "data": "Remover",
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
                        "data": "tipo",
                        "className": "center"
                    },
                    { 
                        "targets": 3,
                        "data": "nome", 
                        "className": "center"
                    },
                    { 
                        "targets": 4,
                        "data": "email", 
                        "className": "center"
                    },
                    { 
                        "targets": 5,
                        "data": "telefone", 
                        "className": "center"
                    },
                    { 
                        "targets": 6,
                        "data": "celular", 
                        "className": "center"
                    },
                    { 
                        "targets": 7,
                        "data": "endereco.cep", 
                        "className": "center"
                    },
                    { 
                        "targets": 8,
                        "data": "endereco.logradouro", 
                        "className": "center"
                    },
                    { 
                        "targets": 9,
                        "data": "endereco.numero", 
                        "className": "center"
                    },
                    { 
                        "targets": 10,
                        "data": "endereco.bairro", 
                        "className": "center"
                    },
                    { 
                        "targets": 11,
                        "data": "endereco.localidade", 
                        "className": "center"
                    },
                    { 
                        "targets": 12,
                        "data": "endereco.uf", 
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
        })}, [clienteId]
    );

    table.on( 'click', '.edit', function (e) {
        e.preventDefault();
        var data = table.row( $(this).parents('tr') ).data();
        history.push({pathname: '/clientes/cadastro',search: `?id=${data.id}`})
        
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

    function  warning(cliente, column){
       setAlert(
            <SweetAlert
                warning
                style={{display: "block",marginTop: "-100px"}}
                title="Tem certeza?"
                onConfirm={() => deletar(cliente,column)}
                onCancel={() => hideAlert()}
                confirmBtnBsStyle="info"
                cancelBtnBsStyle="danger"
                confirmBtnText="Sim, deletar!"
                cancelBtnText="Cancel"
                showCancel
            >
                Podemos deletar o cliente: {cliente.nome} 
            </SweetAlert>
        )
        
    }

    function hideAlert(){
        setAlert(null)
    }

    async function deletar(cliente, column) {
        try{
            await api.delete(`/clientes/${cliente.id}`)
            successAlert(`Cliente deletado com sucesso`);
            setClientes(clientes.filter(cli => cli.id !== cliente.id));
            table.row(column).remove().draw();
          }catch{
              errorAlert(`Erro ao deletar cliente: ${cliente.nome}, tente novamente!`);
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
                            title="Lista de clientes cadastrados"
                            content={
                                <div className="table-responsive fresh-datatables" >
                                    <table id="datatables" className="table table-striped table-no-bordered table-hover " cellSpacing="0" width="100%" style={{width:"100%"}}>
                                        <thead>
                                            <tr>
                                                <th className="disabled-sorting text-center"></th>
                                                <th className="disabled-sorting text-center"></th>
                                                <th>Tipo</th>
                                                <th>Nome</th>
                                                <th>Email</th>
                                                <th>Telefone</th>
                                                <th>Celular</th>
                                                <th>CEP</th>
                                                <th>Rua</th>
                                                <th>Número</th>
                                                <th>Bairro</th>
                                                <th>Cidade</th>
                                                <th>Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        </tbody>
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