import React, { useEffect, useState } from "react";
import{ Grid, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import SweetAlert from 'react-bootstrap-sweetalert';

import api from '../../services/api'

import Card from 'components/Card/Card.jsx';

// react component for creating dynamic tables
import ReactTable from "react-table";


export default function Lista(props) {

    const [produtos, setProdutos] = useState([])
    const produtoId = localStorage.getItem('produtoId');
    const [alert, setAlert] = useState('')
    const [renderForm, setRenderForm] = useState()

    useEffect(() => {
        api.get('/produtos').then(response => {
            setProdutos(response.data);
        })}, [produtoId]
    );

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

    function  warning(prod){
        console.log(`Método warning, produto: ${prod.codigo}`)
        setAlert(
            <SweetAlert
                warning
                style={{display: "block",marginTop: "-100px"}}
                title="Tem certeza?"
                onConfirm={() => deletar(prod)}
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

    async function deletar(prod) {
        console.log(`Metodo delete, produto: ${prod.codigo}`)
        try{
            await api.delete(`/produtos/${prod.id}`)
            successAlert(`Produto deletado com sucesso`);
            setProdutos(produtos.filter(pr => pr.id !== prod.id));
          }catch{
              errorAlert(`Erro ao deletar produto: ${prod.nome}, tente novamente!`);
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
                            title="Lista de produtos cadastrados"
                            content={
                                <ReactTable
                                    data={produtos}
                                    filterable
                                    columns={[
                                    {
                                        Header: "Codigo",
                                        accessor: "codigo",
                                    },
                                    {
                                        Header: "Nome",
                                        accessor: "nome"
                                    },
                                    {
                                        Header: "Valor",
                                        accessor: "valor"
                                    },
                                    {
                                        Header: "Descrição",
                                        accessor: "descricao"
                                    },
                                    {
                                        Header: "Actions",
                                        accessor: "actions",
                                        sortable: false,
                                        filterable: false,
                                    }
                                    ]}
                                    defaultPageSize={10}
                                    showPaginationTop
                                    showPaginationBottom={false}
                                    id="datatables"
                                    className="table table-striped table-no-bordered table-hover"
                                />
                            }
                        />
                    </Col>
                </Row>
            </Grid>
        </div>
    );
}