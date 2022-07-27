import React, { useEffect, useState } from 'react';
import{ Row, Col, FormGroup, FormControl, InputGroup, ControlLabel } from 'react-bootstrap';

import { useHistory } from 'react-router-dom'
import 'react-select/dist/react-select.css';
import Card from 'components/Card/Card.jsx';


export default function Step3() {

    const [cliente, setCliente] = useState()
    const [descricao, setDescricao] = useState()
    const history = useHistory();

    useEffect(() => {

        var prods = []
        Object.keys(sessionStorage).map((produto) =>{
            if(produto.startsWith("produtos.")){
                prods.push(produto)
            }
        })

        if(prods.length === 0){
            window.location.reload(); 
        }else{
            if(JSON.parse(window.sessionStorage.getItem('cliente')) === null){
                setCliente( 
                     <div>
                         <h5 className="text-center">Nenhum cliente selecionado para este orçamento</h5>
                     </div>
                )
             }else{
                 setCliente(  
                     <div className="fresh-datatables" >
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
        }
        

      }, []);

    return (
        <div className="wizard-step">
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
                    <div>
                        <div>
                            <h5 className="text-center">Produtos</h5>
                        </div>
                        
                        
                        <div className="fresh-datatables" >
                            <table id="datatables" className="table table-striped table-no-bordered table-hover">
                                <thead>
                                    <tr>
                                        {/* <th>Codigo</th> */}
                                        <th>Nome</th>
                                        <th>Quantidade</th>
                                        <th>Valor unitário</th>
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
                                                        <td>
                                                            <FormGroup>
                                                                <FormControl
                                                                    id="input-orcamento"
                                                                    placeholder="Qtd"
                                                                    type="number"
                                                                    onChange={(event) => {
                                                                            let prd = JSON.parse(window.sessionStorage.getItem(produto))
                                                                            prd.quantidade = parseFloat(event.target.value)
                                                                            window.sessionStorage.setItem("produtos."+prd.id,JSON.stringify(prd))
                                                                        }
                                                                    }
                                                                />
                                                            </FormGroup>
                                                        </td>
                                                        <td>
                                                            <FormGroup >
                                                                <InputGroup>
                                                                    <InputGroup.Addon>R$</InputGroup.Addon>
                                                                    <FormControl
                                                                        id="input-orcamento"
                                                                        placeholder="R$"
                                                                        type="number"
                                                                        onChange={(event) => {
                                                                            let prd = JSON.parse(window.sessionStorage.getItem(produto))
                                                                            prd.valor = parseFloat(event.target.value)
                                                                            window.sessionStorage.setItem("produtos."+prd.id,JSON.stringify(prd))
                                                                        }
                                                                    }
                                                                    />
                                                                </InputGroup>
                                                            </FormGroup>
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>  
                </Col>
                <hr />
                <Col md={12}>
                    <Card
                        content={
                            <div className="row">
                                <div className="col-sm-12">
                                    <FormGroup>
                                        <ControlLabel>
                                            Descrição do orçamento  <span className="star">*</span>
                                        </ControlLabel>

                                        <FormControl
                                            value={descricao}
                                            rows="5"
                                            name="description"
                                            componentClass="textarea"
                                            placeholder="Digite uma descrição para o orçamento!"
                                            onChange= {(event) => {setDescricao(window.sessionStorage.setItem('descricao',JSON.stringify(event.target.value)))}}
                                        />
                                    </FormGroup>
                                </div>
                            </div>
                        }
                    />
                </Col>
            </Row>
        </div>
    )
}
