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

    const [produtos, setProdutos] = useState([])
    const produtoId = localStorage.getItem('produtoId');
    const [alert, setAlert] = useState('')
    const [table, setTable] = useState($("#datatables").DataTable())
    const history = useHistory();

    useEffect(() => {
        api.get('/produtos').then(response => {
            setProdutos(response.data);

            console.log(response.data)

            $("#datatables").DataTable().clear().destroy()

            setTable($("#datatables").DataTable({
                "pagingType": "full_numbers",
                "lengthMenu": [[5,10, 25, 50, -1], [5,10, 25, 50, "All"]],
                responsive: true,
                searching: true,
                data: response.data,
                "columnDefs": [ {
                    // "width": "2%",
                    "orderable": false,
                    "targets": 0,
                    "data": "Editar",
                    "render": function ( data, type, row, meta ) {
                      return `<span class="btn btn-simple btn-info btn-icon edit"><i class="fa fa-edit"></i></span>`;
                    }
                  },
                  {
                    // "width": "2%",
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
                        "data": "codigo",
                        "className": "center"
                    },
                    { 
                        "targets": 3,
                        "data": "nome", 
                        "className": "center"
                    },
                    { 
                        "targets": 4,
                        "data": "medida", 
                        "className": "center"
                    },
                    { 
                        "targets": 5,
                        "data": "quantidade", 
                        "className": "center"
                    },
                    { 
                        "targets": 6,
                        "data": "valor", 
                        "render": function (data, type, row) {
                            return Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(data)
                        },
                        "className": "center"
                    },
                    { 
                        "targets": 7,
                        "data": "descricao", 
                        "className": "center"
                    },
                    { 
                        "targets": 8,
                        "data": "prateleira", 
                        "className": "center"
                    },
                ],
                language: {
                    info: "Total de _TOTAL_ produtos",
                    infoEmpty: "Não existem dados para esta tabela, favor cadastrar",
                    lengthMenu: "Exibir últimos _MENU_ registros ",
                    search: "_INPUT_",
                    searchPlaceholder: "Procurar produtos",
                    paginate: {
                        "first":      "Primeiro",
                        "last":       "Ultimo",
                        "next":       "Próximo",
                        "previous":   "Anterior"
                    },
                }
            }))
        })}, [produtoId]
    );

    table.on( 'click', '.edit', function (e) {
        e.preventDefault();
        var data = table.row( $(this).parents('tr') ).data();
        history.push({pathname: '/produtos/cadastro',search: `?id=${data.id}`})
        
    } );


    table.on( 'click', '.remove', function (e) {
        e.preventDefault();
        var data = table.row( $(this).parents('tr') ).data();
        console.log(data)
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

    function  warning(prod, column){
        console.log(`Método warning, produto: ${prod.codigo}`)
        setAlert(
            <SweetAlert
                warning
                style={{display: "block",marginTop: "-100px"}}
                title="Tem certeza?"
                onConfirm={() => deletar(prod, column)}
                onCancel={() => hideAlert()}
                confirmBtnBsStyle="info"
                cancelBtnBsStyle="danger"
                confirmBtnText="Sim, deletar!"
                cancelBtnText="Cancel"
                showCancel
            >
                Podemos deletar o produto: {prod.nome} 
            </SweetAlert>
        )
        
    }

    function hideAlert(){
        setAlert(null)
    }

    async function deletar(prod, column) {  
        console.log(`Metodo delete, produto: ${prod.codigo}`)
        try{
            await api.delete(`/produtos/${prod.id}`)
            successAlert(`Produto deletado com sucesso`);
            setProdutos(produtos.filter(pr => pr.id !== prod.id));
            table.row(column).remove().draw();
          }catch{
              errorAlert(`Erro ao deletar produto: ${prod.nome}, tente novamente!`);
          }
    }

    return (
        <div className="main-content">
            
            {alert}
            <Grid fluid>
                <Row>
                    <Col md={12}>
                        <Card
                            title="Lista de produtos cadastrados"
                            content={   
                                <div className="fresh-datatables" >
                                    <table id="datatables" className="table table-striped table-no-bordered table-hover" cellSpacing="0" width="100%" style={{width:"100%"}}>
                                        <thead>
                                            <tr>
                                                <th className="disabled-sorting text-center"></th>
                                                <th className="disabled-sorting text-center"></th>
                                                <th>Código</th>
                                                <th>Nome</th>
                                                <th>Unidade</th>
                                                <th>quantidade</th>
                                                <th>Valor</th>
                                                <th>Descrição</th>
                                                <th>Prateleira</th>
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