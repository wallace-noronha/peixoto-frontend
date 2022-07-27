import React, { useEffect, useState } from 'react';
import{ Grid, Row, Col } from 'react-bootstrap';

import 'react-select/dist/react-select.css';

import api from '../../../services/api';
// jQuery plugin - used for DataTables.net
import $ from 'jquery';
import Card from 'components/Card/Card.jsx';

// DataTables.net plugin - creates a tables with actions on it
require('datatables.net-responsive');
$.DataTable = require('datatables.net-bs');


export default function Step2() {

    const [cliente, setCliente] = useState()
    const [table, setTable] = useState($("#datatables").DataTable())
    const [btnSelect] = useState(`<span class="btn btn-simple btn-info btn-icon select"><i class="fa fa-shopping-cart"></i></span>`)
    const [btnRemove] = useState(`<span class="btn btn-simple btn-success btn-icon remove"><i class="fa fa-check-square-o"></i></span>`)
    
    useEffect(() => {

        api.get('/produtos/').then(response => {
   
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
                        // "width":"5%",
                        "data":  "null",
                        "className": "center",
                        "defaultContent": btnSelect
                    },
                    { 
                        "data": "nome", 
                        "className": "center"
                    },
                    {   
                        "data": "codigo",
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


        });

        let keys = Object.keys(sessionStorage);
        for(let key of keys) {
            if(key.startsWith("produtos.")){
                sessionStorage.removeItem(key);
            }
        }

        if(JSON.parse(window.sessionStorage.getItem('cliente')) === null){
           setCliente( 
                <div>
                    <h5 className="text-center">Nenhum cliente selecionado para este orçamento</h5>
                </div>
           )
        }else{
            setCliente(  
                <div>
                    <h5 className="text-center">Orçamento para cliente</h5>
                    
                        <table className="table table-striped table-no-bordered table-hover" cellSpacing="0" width="100%" style={{width:"100%"}}>
                            <thead>
                                <tr>
                                    <th className="text-center">{JSON.parse(window.sessionStorage.getItem('cliente')).tipo}</th>
                                    <th className="text-center">Nome</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="text-center">{JSON.parse(window.sessionStorage.getItem('cliente')).numero}</td>
                                    <td className="text-center">{JSON.parse(window.sessionStorage.getItem('cliente')).nome}</td>
                                </tr>
                            </tbody>
                        </table>
                </div>            
            )
        }
      }, [btnSelect]);

    table.on('click', '.select', function () {
        var row = table.row( $(this).parents('tr') )    
    
        //Update icon
        var index = row.index()     
        row.cell(index, 0).data(btnRemove);
        addToCart(row.data())
        
        
    } );

    table.on('click', '.remove', function () {
        var row = table.row( $(this).parents('tr') )
        //Update icon
        var index = row.index()
        row.cell(index, 0).data(btnSelect);
        removeToCart(row.data())
        
    } );

    function addToCart(pr){
        // cart.set(produto.id,produto)

        var produto = {id:pr.id, codigo:pr.codigo, nome:pr.nome, medida:pr.medida, quantidade:pr.quantidade, valor:pr.valor, descricao:pr.descricao }
        window.sessionStorage.setItem('produtos.'+produto.id,JSON.stringify(produto))
        
    }


    function removeToCart(produto){
        
        // cart.delete(produto.id)
        window.sessionStorage.removeItem('produtos.'+produto.id,JSON.stringify(produto))
        
    }

    return (
        <div className="wizard-step">
            <Grid fluid>
                <Row>
                    <Col md={12}>
                        <Card
                            content={
                                <div className="fresh-datatables" >
                                    {cliente}
                                </div>
                            }
                        />
                    </Col>
                    <Col md={12}>
                        <Card
                            content={   
                                <div className="fresh-datatables" >
                                    <table id="datatables" className="table table-striped table-no-bordered table-hover" cellSpacing="0" width="100%" style={{width:"100%"}}>
                                        <thead>
                                            <tr>
                                                <th  className="disabled-sorting"></th>
                                                <th>Nome</th>
                                                <th>Código</th>
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
