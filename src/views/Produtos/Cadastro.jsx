import React, { useEffect, useState }  from 'react';

import { useHistory } from 'react-router-dom'
import SweetAlert from 'react-bootstrap-sweetalert';
import{ Grid, Row, Col, FormGroup, ControlLabel, FormControl, InputGroup } from 'react-bootstrap';
import Select from 'react-select';

import Card from 'components/Card/Card.jsx';

import Button from 'elements/CustomButton/CustomButton.jsx';

import api from '../../services/api'

var unidadeDeMedida = [
    { value: 'mt', label: 'Metro' },
    { value: 'kg', label: 'Kilo' },
    { value: 'un', label: 'Unidade' },
];

export default function Cadastro(props) {

    const search = props.location.search;
    const params = new URLSearchParams(search);
    const idParam = params.get('id');
  
    const history = useHistory();
  
    const [id, setId] = useState(null)
    const [codigo, setCodigo] = useState('');
    const [nome, setNome] = useState('');
    const [medida, setMedida] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [valor, setValor] = useState('');
    const [descricao, setDescricao] = useState('');
    const [prateleira, setPrateleira] = useState('');
    const [alert, setAlert] = useState('')
    
    const produtoId = localStorage.getItem('produtoId');

    useEffect(() => {
      if(idParam !== null){
        api.get(`/produtos/${idParam}`).then(response => {
          setId(response.data.id)
          setCodigo(response.data.codigo)
          setNome(response.data.nome)
          setMedida(response.data.medida)
          setQuantidade(response.data.quantidade)
          setValor(response.data.valor)
          setDescricao(response.data.descricao)
          setPrateleira(response.data.prateleira)
        })
      }
    }, [produtoId, idParam]);
  
    function successAlert(message){
    
        setAlert(
            <SweetAlert
                success
                style={{display: "block",marginTop: "-100px"}}
                title="OK"
                onConfirm={() => {hideAlert(); history.push("/produtos/listar")}}
                onCancel={() => hideAlert()}
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
                onConfirm={() => {hideAlert()}}
                onCancel={() => hideAlert()}
                confirmBtnBsStyle="danger"
            >
                Não foi possivel cadastrar o produto: {message}, tente novamente!
            </SweetAlert>
        )
    }
    
    function hideAlert(){
        setAlert(null)
    }


    async function cadastrar(e){
      e.preventDefault();
      var produto = { id, codigo, nome, quantidade, medida, valor, descricao, prateleira } 
      try{
        if(id > 0){
          const response = await api.put(`/produtos`, produto);
          successAlert(`Produto atualizado com sucesso, Id: ${response.data.id}`);
          
        }else{
          const response = await api.post('/produtos', produto);
          successAlert(`Produto cadastrado com sucesso, Id: ${response.data.id}`);
          
        }
      } catch {
        errorAlert(produto.nome);
      }
    }

    return (
        <div className="main-content">
            {alert}
            <Grid fluid>
                <Row>
                    <Col md={12}>
                        <Card
                            title="Cadastro de Produto"
                            content={
                                <form onSubmit={cadastrar}>
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <FormGroup>
                                                <ControlLabel>
                                                    Código  <span className="star">*</span>
                                                </ControlLabel>
                                                <FormControl
                                                    placeholder="Digite o código do produto"
                                                    type="number"
                                                    autoComplete="off"
                                                    required={true}
                                                    name="codigo"
                                                    value={codigo}
                                                    onChange={(event) => {setCodigo(event.target.value)}}
                                                />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <FormGroup>
                                                <ControlLabel>
                                                    Nome  <span className="star">*</span>
                                                </ControlLabel>
                                                <FormControl
                                                    name="nome"
                                                    autoComplete="off"
                                                    required={true}
                                                    value={nome}
                                                    placeholder="Nome do produto"
                                                    type="text"
                                                    onChange= {(event) => {setNome(event.target.value)}}
                                                />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup>
                                                <ControlLabel>
                                                    Quantidade  <span className="star">*</span>
                                                </ControlLabel>
                                                <FormControl
                                                    value={quantidade}
                                                    required={true}
                                                    autoComplete="off"
                                                    placeholder="Quantidade do produto"
                                                    type="text"
                                                    onChange= {(event) => {setQuantidade(event.target.value)}}
                                                />
                                            </FormGroup>
                                        </div>
                                    
                                        <div className="col-sm-6">
                                            <FormGroup>
                                                <ControlLabel>
                                                    Unidade de medida  <span className="star">*</span>
                                                </ControlLabel>
                                                <Select
                                                    placeholder="Unidade de medida"
                                                    name="singleSelect"
                                                    value={medida}
                                                    options={unidadeDeMedida}
                                                    onChange={(value) => setMedida(value.value)}
                                                />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup>
                                                <ControlLabel>
                                                    Valor 
                                                </ControlLabel>
                                                <InputGroup>
                                                    <InputGroup.Addon>R$</InputGroup.Addon>
                                                    <FormControl
                                                        value={valor}
                                                        placeholder="Valor do produto"
                                                        type="number"
                                                        onChange= {(event) => {setValor(event.target.value)}}
                                                    />
                                                </InputGroup>
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup>
                                                <ControlLabel>
                                                    Prateleira  <span className="star">*</span>
                                                </ControlLabel>
                                                <FormControl
                                                    name="prateleira"
                                                    value={prateleira}
                                                    required={true}
                                                    autoComplete="off"
                                                    placeholder="Prateleira onde encontra-se o produto"
                                                    type="text"
                                                    onChange= {(event) => {setPrateleira(event.target.value)}}
                                                />
                                            </FormGroup>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-sm-12">
                                            <FormGroup>
                                                <ControlLabel>
                                                    Descrição do produto  <span className="star">*</span>
                                                </ControlLabel>
                                                
                                                <FormControl
                                                    value={descricao}
                                                    rows="5"
                                                    name="description"
                                                    componentClass="textarea"
                                                    placeholder="Digite uma descrição para o produto!"
                                                    onChange= {(event) => {setDescricao(event.target.value)}}
                                                />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row" >
                                        <div className="col-sm-6">
                                            <Button bsStyle="info" fill type="submit">
                                                Cadastrar
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            }
                        />
                    </Col>
                </Row>
            </Grid>
        </div>
    );
}