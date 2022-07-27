import React, { useEffect, useState } from 'react';
import{ Row, Col, Grid } from 'react-bootstrap';

import SweetAlert from 'react-bootstrap-sweetalert';
// import 'react-select/dist/react-select.css';
import Card from 'components/Card/Card.jsx';
import { useHistory } from 'react-router-dom'

import Button from 'elements/CustomButton/CustomButton.jsx';

import api from '../../services/api'


export default function Step3(props) {

    const search = props.location.search;
    const params = new URLSearchParams(search);
    const idParam = params.get('id');
    const [orcamento, setOrcamento] = useState({produtos:[]})
    const [cliente, setCliente] = useState()
    const history = useHistory();
    const [alert, setAlert] = useState('')

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

    async function imprimir(id){

        successAlert(`Aguarde, estamos gerando o relatório`)

        await api.get(`/orcamentos/report/${id}`, {
            responseType: 'arraybuffer',
            headers: {
              'Accept': 'application/pdf'
            }
        }).then(response => {
            //Create a Blob from the PDF Stream
            const file = new Blob([response.data],{type: 'application/pdf'});
            //Build a URL from the file
            const fileURL = URL.createObjectURL(file);
            //Open the URL on new Window
            window.open(fileURL);
        }).catch(error => {console.log(error);});

        hideAlert();
    }
    
    useEffect(() => {

        if(idParam !== null){
            api.get(`/orcamentos/${idParam}`).then(response => {
                setOrcamento(response.data)
                console.log(response.data)


                if(response.data.cliente === null){
                    setCliente( 
                         <div>
                             <h5 className="text-center">Orçamento sem cliente selecionado</h5>
                         </div>
                    )
                 }else{
                     setCliente(  
                         <div>
                             <h5 className="text-center">Orçamento para cliente</h5>
                             <table className="table table-striped table-no-bordered table-hover" cellSpacing="0" width="100%" style={{width:"100%"}}>
                                 <thead>
                                     <tr>
                                         <th className="text-center">{response.data.cliente.tipo}</th>
                                         <th className="text-center">Nome</th>
                                     </tr>
                                 </thead>
                                 <tbody>
                                     <tr>
                                         <td className="text-center">{response.data.cliente.numero}</td>
                                         <td className="text-center">{response.data.cliente.nome}</td>
                                     </tr>
                                 </tbody>
                             </table>
                         </div>            
                     )
                 }

            })
        }else{
            history.push({pathname: '/orcamentos/listar'})
        }                
      }, [idParam, history]);      


    return (
        <div className="main-content">
            {alert}
            <Grid fluid>
                <Row>
                    <Col md={12}>
                        <Card
                            content={
                                <div>
                                    {cliente}
                                </div>
                            }
                        />
                    </Col>
                    <Col md={12}>
                        <Card
                            content={ 
                                <div>
                                    <h5 className="text-center">Produtos</h5>
                                    <div className="fresh-datatables" >
                                        <table id="datatables" className="table table-striped table-no-bordered table-hover" cellSpacing="0" width="100%" style={{width:"100%"}}>
                                            <thead>
                                                <tr>
                                                    <th>Codigo</th>
                                                    <th>Nome</th>
                                                    <th>Quantidade</th>
                                                    <th>Valor</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    orcamento.produtos.map((produto) =>{
                                                        return(
                                                            <tr key={produto}>
                                                                <td>{produto.codigo}</td>
                                                                <td>{produto.nome}</td>
                                                                <td>{produto.quantidade}</td>
                                                                <td>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(produto.valor)}</td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                                <tr>
                                                    <td><h5>Total</h5></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td><h5>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(orcamento.total)}</h5></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>  
                            }
                        />
                    </Col>
                </Row>
                <Row float="center">
                    <Col md={12}>
                        <Card
                            content={
                                <Row>
                                    <Col md={6}>
                                        <div className="content text-right">
                                            <h5>
                                                Imprimir orçamento
                                            </h5>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="content text-left">
                                            
                                            <Button fill pinterest onClick={() => imprimir(orcamento.id)}>
                                                <i className="fa fa-file-pdf-o"></i> PDF
                                            </Button>

                                        </div>
                                    </Col>
                                    {/* <Col md={4}>
                                    <div className="content text-center">
                                    
                                        <Button fill twitter>
                                            <i className="fa fa-envelope-o"></i> E-MAIL
                                        </Button>
                                        
                                    </div>
                                    </Col>
                                    <Col md={4}>
                                    <div className="content text-center">

                                        <Button fill whatsapp>
                                            <i className="fa fa-whatsapp"></i> WHATSAPP
                                        </Button>

                                    </div>
                                    </Col> */}
                                </Row>
                            }
                        />
                    </Col>
                </Row>
            </Grid>
        </div>
    )
}
