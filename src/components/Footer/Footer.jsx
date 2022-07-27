import React, { Component } from 'react';
import { ReactComponent as ReactIcon } from '../../assets/img/react.svg'

class Footer extends Component {
    render(){
        return (
            <footer className={"footer" + (this.props.transparent !== undefined ? " footer-transparent":"")}>
                <div className={"container" + (this.props.fluid !== undefined ? "-fluid":"")}>
                    <nav className="pull-left">
                        <ul>
                            <li>
                                <a href="http://www.peixotoinstalacoes.com.br">
                                    Site
                                </a>
                            </li>
                        </ul>
                    </nav>
                    <p className="copyright pull-right">
                        Desenvolvido por <a href="https://www.linkedin.com/in/wallace-noronha-0440b691/">  Wallace Vidal </a> &copy; {1900 + (new Date()).getYear()}  
                        <span className="btn btn-simple btn-info btn-icon edit"><ReactIcon/> </span>
                        
                    </p>
                </div>
            </footer>
        );
    }
}
export default Footer;
