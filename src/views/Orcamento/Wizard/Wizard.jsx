import React, { Component } from 'react';
// react component that creates a form divided into multiple steps
import StepZilla from 'react-stepzilla';
import{
    Grid, Row, Col
} from 'react-bootstrap';

import Card from 'components/Card/Card.jsx';

import Step1 from './Step1.jsx';
import Step2 from './Step2.jsx';
import Step3 from './Step3.jsx';
import Step4 from './Step4.jsx';

const steps = [
    { name: 'Cliente', component: <Step1 />},
    { name: 'Produtos', component: <Step2 />},
    { name: 'Orçamento', component: <Step3 />},
    { name: 'Finalizar', component: <Step4 />}
];

class Wizard extends Component{
    render(){
        return (
            <div className="main-content">
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Card
                                wizard
                                id="wizardCard"
                                textCenter
                                title="Novo Orçamento"
                                category="Preencha os dados para gerar um novo orçamento"
                                content={
                                    <StepZilla
                                        nextButtonText="Avançar"
                                        backButtonText="Voltar"
                                        nextButtonCls="btn btn-prev btn-info btn-fill pull-right btn-wd"
                                        backButtonCls="btn btn-next btn-default btn-fill pull-left btn-wd"
                                        steps={steps}
                                        stepsNavigation={false}
                                    />
                                }
                            />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default Wizard;
