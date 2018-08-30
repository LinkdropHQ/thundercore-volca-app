import React, { Component } from "react";
import RetinaImage from 'react-retina-image';
import AddressButton from './AddressButton';
import { Row, Col, Button, Grid } from 'react-bootstrap';
import Logo from './logo';


class e2pHeader extends React.Component {
    render() {
        return (
            <Grid className='header'>
                <Row className="header-row">
                    <Col xs={5} style={{ paddingTop: 14 }}>
                        <Logo />
                    </Col>
                    <Col style={{paddingTop: 20}} xs={7}>    
		      <RetinaImage className="img-responsive" style={{display: 'inline', float: 'right'}} src="https://eth2.io/images/trust_logo.png" />                       
                    </Col>
                </Row>
                
            </Grid>

        );
    }
}

export default e2pHeader;
