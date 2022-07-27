import React, { useEffect, useState } from 'react';
import{ Row, Col } from 'react-bootstrap';
import SweetAlert from 'react-bootstrap-sweetalert';

import 'react-select/dist/react-select.css';
import Card from 'components/Card/Card.jsx';

import Button from 'elements/CustomButton/CustomButton.jsx';

import api from '../../../services/api'


export default function Step4() {

    const [cliente, setCliente] = useState()
    const [total, setTotal] = useState(0)
    const [orcamento, setOrcamento] = useState({})
    const [alert, setAlert] = useState('')
    
    useEffect(() => {

        var valor = 0
        Object.keys(sessionStorage).map((produto) => {
            if(produto.startsWith("produtos.")){
                 valor = valor + (JSON.parse(window.sessionStorage.getItem(produto)).valor * JSON.parse(window.sessionStorage.getItem(produto)).quantidade)
                 return valor
            }
                return null
        })
        setTotal(valor)

        var produtos = []

        Object.keys(sessionStorage).map((produto) => {
            if(produto.startsWith("produtos.")){
                 produtos.push(JSON.parse(window.sessionStorage.getItem(produto)))
                 return produtos
            }
                return null
        })

        var orcam = {cliente: JSON.parse(window.sessionStorage.getItem('cliente')), produtos: produtos, descricao:JSON.parse(window.sessionStorage.getItem('descricao')), total: valor}

        sendOrcamento(orcam)
        

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
      }, []);

      useEffect( () => () => window.sessionStorage.clear(), [] );
      
    async function sendOrcamento(orcamento){
        

        const response = await api.post(`/orcamentos`, orcamento);
        setOrcamento(response.data)
    }

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


    return (
        <div className="wizard-step">
            {alert}
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
                                    <table id="datatables" className="table table-striped table-no-bordered table-hover">
                                        <thead>
                                            <tr>
                                                {/* <th>Codigo</th> */}
                                                <th>Nome</th>
                                                <th>Quantidade</th>
                                                <th>Valor</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                Object.keys(sessionStorage).map((produto) =>{
                                                    if(produto.startsWith("produtos.")){
                                                        return(
                                                            <tr key={produto}>
                                                                {/* <td>{JSON.parse(window.sessionStorage.getItem(produto)).codigo}</td> */}
                                                                <td>{JSON.parse(window.sessionStorage.getItem(produto)).nome}</td>
                                                                <td>{JSON.parse(window.sessionStorage.getItem(produto)).quantidade}</td>
                                                                <td>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(JSON.parse(window.sessionStorage.getItem(produto)).valor)}</td>
                                                            </tr>
                                                        )
                                                    }
                                                    return null
                                                })
                                            }
                                            <tr>
                                                <td><h5>Total</h5></td>
                                                <td></td>
                                                <td><h5>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(total)}</h5></td>
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
                                    <Col md={12}>
                                        <div className="content text-center">
                                            
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
        </div>
    )
}
