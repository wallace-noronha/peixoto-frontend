import React, { useEffect, useState }  from 'react';
import{ Grid, Row, Col, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import Select from 'react-select';

import { useHistory } from 'react-router-dom'
import SweetAlert from 'react-bootstrap-sweetalert';

import Card from 'components/Card/Card.jsx';

import Button from 'elements/CustomButton/CustomButton.jsx';

import api from '../../services/api'


var estados = [
    { value: 'AC', label: 'AC' },
    { value: 'AL', label: 'AL' },
    { value: 'AP', label: 'AP' },
    { value: 'AM', label: 'AM' },
    { value: 'BA', label: 'BA' },
    { value: 'CE', label: 'CE' },
    { value: 'DF', label: 'DF' },
    { value: 'ES', label: 'ES' },
    { value: 'GO', label: 'GO' },
    { value: 'MA', label: 'MA' },
    { value: 'MT', label: 'MT' },
    { value: 'MS', label: 'MS' },
    { value: 'MG', label: 'MG' },
    { value: 'PA', label: 'PA' },
    { value: 'PB', label: 'PB' },
    { value: 'PR', label: 'PR' },
    { value: 'PE', label: 'PE' },
    { value: 'PI', label: 'PI' },
    { value: 'RJ', label: 'RJ' },
    { value: 'RN', label: 'RN' },
    { value: 'RS', label: 'RS' },
    { value: 'RO', label: 'RO' },
    { value: 'RR', label: 'RR' },
    { value: 'SC', label: 'SC' },
    { value: 'SP', label: 'SP' },
    { value: 'SE', label: 'SE' },
    { value: 'TO', label: 'TO' }
];

var tipoCliente = [
    { value: 'CPF', label: 'CPF' },
    { value: 'CNPJ', label: 'CNPJ' }
];

export default function Cadastro(props) {

    const history = useHistory();
  
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const idParam = params.get('id');
  
    const [id, setId] = useState(null);
    const [tipo, setTipo] = useState('');
    const [cpf, setCpf] = useState('');
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('')
    const [celular, setCelular] = useState('');
    const [enderecoId, setEnderecoId] = useState(null);
    const [cep, setCep] = useState('');
    const [logradouro, setLogradouro] = useState('');
    const [complemento, setComplemento] = useState('');
    const [referencia, setReferencia] = useState('');
    const [numero, setNumero] = useState('');
    const [bairro, setBairro] = useState('');
    const [localidade, setLocalidade] = useState('');
    const [uf, setUf] = useState('');
    const [alert, setAlert] = useState('')
    const [messageTipoCliente, setMessageTipoCliente] = useState('');
  
    const usuarioId = localStorage.getItem('usuarioId');
    
    useEffect(() => {
  
      if(idParam !== null){
        api.get(`/clientes/${idParam}`).then(response => {
            console.log(response.data)
          setId(response.data.id)
          setTipo(response.data.tipo)
          setCpf(response.data.numero) 
          setNome(response.data.nome)
          setEmail(response.data.email)
          setTelefone(response.data.telefone)
          setCelular(response.data.celular)
          setEnderecoId(response.data.endereco.id)
          setCep(response.data.endereco.cep)
          setLogradouro(response.data.endereco.logradouro)
          setComplemento(response.data.endereco.complemento)
          setReferencia(response.data.endereco.referencia)
          setNumero(response.data.endereco.numero)
          setBairro(response.data.endereco.bairro)
          setLocalidade(response.data.endereco.localidade)
          setUf(response.data.endereco.uf)
          setMessageTipoCliente(`Número do ${response.data.tipo}`)
        })
      } 
    }, [usuarioId, idParam]);     
  
    async function getCep(cep) {
      if(`${cep}`.length >= 8){
       
        try{
          waitMessage("Buscando o CEP informado...")
          const response = await api.get(`/endereco/cep/${cep}`)
          setCep(`${cep}`)
          setLogradouro(response.data.logradouro)
          setBairro(response.data.bairro)
          setLocalidade(response.data.localidade)
          setUf(response.data.uf)
          hideAlert()
        } catch {
          setNumero(0)
          setLogradouro('')
          setBairro('')
          setLocalidade('')
          setUf('')
          errorAlert("CEP Não encontrado, tente digitar um CEP válido","")
        }
       
      } 
    }

    async function cadastrar(e){
        e.preventDefault();
        var cliente = { id, tipo, numero: cpf , nome, email, telefone, celular,  endereco : {id : enderecoId , cep, logradouro, complemento, referencia, numero, bairro, localidade, uf} } 
        console.log(cliente)
        try{
            if(id > 0){
                const response = await api.put(`/clientes`, cliente);
                successAlert(`Cliente atualizado com sucesso, Id: ${response.data.id}`);
            }else{
                const response = await api.post('/clientes', cliente);
                successAlert(`Cliente cadastrado com sucesso, Id: ${response.data.id}`);
            }
        } catch {
            errorAlert("Erro ao cadastrar o cliente, tente novamente!");
        }
    }

    function waitMessage(message){
        
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
    
    function successAlert(message){
        
        setAlert(
            <SweetAlert
                success
                style={{display: "block",marginTop: "-100px"}}
                title="OK"
                onConfirm={() => { hideAlert(); history.push("/clientes/listar") } }
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
               {message}
            </SweetAlert>
        )
    }
    
    function hideAlert(){
        setAlert(null)
    }
  
    return (
            <div className="main-content">
                {alert}
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Card
                                title="Cadastro de Cliente"
                                content={
                                    <form onSubmit={cadastrar}>
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <FormGroup>
                                                    <ControlLabel>
                                                        CPF ou CNPJ?
                                                    </ControlLabel>
                                                    <Select
                                                        placeholder="Tipo de Cliente"
                                                        name="tipoCliente"
                                                        value={tipo}
                                                        options={tipoCliente}
                                                        onChange={(value) => {setTipo(value.value); setMessageTipoCliente(`Número do ${value.value}`)}}
                                                    />
                                                </FormGroup>
                                            </div>
                                            <div className="col-sm-10">
                                                <FormGroup>
                                                    <ControlLabel>
                                                        {messageTipoCliente} <span className="star">*</span>
                                                    </ControlLabel>
                                                    <FormControl
                                                        placeholder="Somente números"
                                                        type="number"
                                                        autoComplete="off"
                                                        required={true}
                                                        name="cpf"
                                                        value={cpf}
                                                        onChange={(event) => {setCpf(event.target.value)}}
                                                    />
                                                </FormGroup>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <FormGroup>
                                                    <ControlLabel>
                                                        Nome do cliente  <span className="star">*</span>
                                                    </ControlLabel>
                                                    <FormControl
                                                        value={nome}
                                                        autoComplete="off"
                                                        required={true}
                                                        placeholder="Nome do cliente"
                                                        type="text"
                                                        onChange={(event) => {setNome(event.target.value)}}
                                                    />
                                                </FormGroup>
                                            </div>
                                        </div>
                                        <div className="row">
                                        <div className="col-sm-4">
                                                <FormGroup>
                                                    <ControlLabel>
                                                        Email 
                                                    </ControlLabel>
                                                    <FormControl
                                                        value={email}
                                                        autoComplete="off"
                                                        placeholder="exemplo@email.com"
                                                        type="email"
                                                        onChange={(event) => {setEmail(event.target.value)}}
                                                    />
                                                </FormGroup>
                                            </div>
                                            <div className="col-sm-4">
                                                <FormGroup>
                                                    <ControlLabel>
                                                        Celular
                                                    </ControlLabel>
                                                    <FormControl
                                                        value={celular}
                                                        autoComplete="off"
                                                        placeholder="(11) 99999-9999"
                                                        type="number"
                                                        onChange={(event) => {setCelular(event.target.value)}}
                                                    />
                                                </FormGroup>
                                            </div>
                                            
                                            <div className="col-sm-4">
                                                <FormGroup>
                                                    <ControlLabel>
                                                        Telefone 
                                                    </ControlLabel>
                                                    <FormControl
                                                        value={telefone}
                                                        autoComplete="off"
                                                        placeholder="(11) 9999-9999"
                                                        type="number"
                                                        onChange={(event) => {setTelefone(event.target.value)}}
                                                    />
                                                </FormGroup>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <FormGroup>
                                                    <ControlLabel>
                                                        Cep
                                                    </ControlLabel>
                                                    <FormControl
                                                        value={cep}
                                                        autoComplete="off"
                                                        placeholder="Somente números"
                                                        type="text"
                                                        onBlur={(e) => getCep(e.target.value)}
                                                        onChange={(event) => {setCep(event.target.value)}}
                                                    />
                                                </FormGroup>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <FormGroup>
                                                    <ControlLabel>
                                                        Rua
                                                    </ControlLabel>
                                                    <FormControl
                                                        value={logradouro}
                                                        autoComplete="off"
                                                        placeholder="Rua"
                                                        type="text"
                                                        onChange={(event) => {setLogradouro(event.target.value)}}
                                                    />
                                                </FormGroup>
                                            </div>
                                            <div className="col-sm-2">
                                                <FormGroup>
                                                    <ControlLabel>
                                                        Número
                                                    </ControlLabel>    
                                                    <FormControl
                                                        value={numero}
                                                        placeholder="Número"
                                                        type="number"
                                                        onChange={(event) => {setNumero(event.target.value)}}
                                                    />
                                                </FormGroup>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <FormGroup>
                                                    <ControlLabel>
                                                        Bairro
                                                    </ControlLabel>
                                                    <FormControl
                                                        value={bairro}
                                                        autoComplete="off"
                                                        placeholder="Bairro"
                                                        type="text"
                                                        onChange={(event) => {setBairro(event.target.value)}}
                                                    />
                                                </FormGroup>
                                            </div>
                                            <div className="col-sm-6">
                                                <FormGroup>
                                                    <ControlLabel>
                                                        Complemento
                                                    </ControlLabel>
                                                    <FormControl
                                                        value={complemento}
                                                        autoComplete="off"
                                                        placeholder="Complemento"
                                                        type="text"
                                                        onChange={(event) => {setComplemento(event.target.value)}}
                                                    />
                                                </FormGroup>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <FormGroup>
                                                    <ControlLabel>
                                                        Cidade
                                                    </ControlLabel>
                                                    <FormControl
                                                        value={localidade}
                                                        autoComplete="off"
                                                        placeholder="Cidade"
                                                        type="text"
                                                        onChange={(event) => {setLocalidade(event.target.value)}}
                                                    />
                                                </FormGroup>
                                            </div>
                                            <div className="col-sm-2">
                                                <FormGroup>
                                                    <ControlLabel>
                                                        Estado
                                                    </ControlLabel>
                                                    <Select
                                                        placeholder="Estado"
                                                        autoComplete="off"
                                                        name="estado"
                                                        value={uf}
                                                        options={estados}
                                                        onChange={(value) => {setUf(value.value)}}
                                                    />
                                                </FormGroup>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <FormGroup>
                                                    <ControlLabel>
                                                        Ponto de referência
                                                    </ControlLabel>
                                                    <FormControl
                                                        value={referencia}
                                                        name="referencia"
                                                        placeholder="Ponto de referência"
                                                        rows="5"
                                                        componentClass="textarea"
                                                        onChange={(event) => {setReferencia(event.target.value)}}
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