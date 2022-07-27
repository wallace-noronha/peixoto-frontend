import React, { Component } from 'react';
import {
    Navbar, Nav, NavDropdown, MenuItem,
    FormGroup, FormControl, InputGroup
} from 'react-bootstrap';

class HeaderLinks extends Component{
    render(){
        return(
            <div>
                <Navbar.Form pullLeft className="navbar-search-form">
                    <FormGroup>
                        <InputGroup>
                            <InputGroup.Addon><i className="fa fa-search"></i></InputGroup.Addon>
                            <FormControl type="text" placeholder="Search..." />
                        </InputGroup>
                    </FormGroup>
                </Navbar.Form>
                <Nav pullRight>     
                    <NavDropdown
                        eventKey={4}
                        title={(
                            <div>
                                <i className="fa fa-list"></i>
                                <p className="hidden-md hidden-lg">
                                    Configurações
                                    <b className="caret"></b>
                                </p>
                            </div>
                        )} noCaret id="basic-nav-dropdown-3" bsClass="dropdown-with-icons dropdown">
                        <MenuItem eventKey={4.1}><i className="pe-7s-mail"></i> Messages</MenuItem>
                        <MenuItem eventKey={4.2}><i className="pe-7s-help1"></i> Help Center</MenuItem>
                        <MenuItem eventKey={4.3}><i className="pe-7s-tools"></i> Settings</MenuItem>
                        <MenuItem divider />
                        <MenuItem eventKey={4.4}><i className="pe-7s-lock"></i> Lock Screen</MenuItem>
                        <MenuItem eventKey={4.5}><div className="text-danger"><i className="pe-7s-close-circle"></i> Log out</div></MenuItem>
                    </NavDropdown>
                </Nav>
            </div>
        );
    }
}
export default HeaderLinks;
