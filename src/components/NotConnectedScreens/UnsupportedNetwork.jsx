import React, { Component } from 'react';
import RetinaImage from 'react-retina-image';
import { Row, Col, Grid } from 'react-bootstrap';

const styles = {
    title: {
        width: '90%',
        display: 'block',
        margin: 'auto',
        fontSize: 24,
        lineHeight: 1,
        fontFamily: 'SF Display Black',
        textAlign: 'center',
        marginBottom: 25,
        marginTop: 50
    },
    row: {
        width: '80%',
        margin: 'auto',
        marginBottom: 15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    buttonRow: {
        display: 'flex',
        flexDirection: 'row',
        width: 300,
        margin: 'auto',
        marginBottom: 30,
        justifyContent: 'center'
    },
    button: {
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center',
        width: 243,
        height: 38,
        borderRadius: 12,
        marginTop: 'auto',
        marginBottom: 'auto',
        backgroundColor: '#0099ff',
        borderColor: '#0099ff',
        fontSize: 18,
        fontFamily: 'SF Display Black',
        textAlign: 'center',
        textDecoration: 'none',
        color: 'white'
    },
    logoText: {
        textAlign: 'center',
        fontSize: 14,
        fontFamily: 'SF Display Regular'
    },
    supported: {
        fontSize: 14,
        textAlign: 'center',
        fontFamily: "SF Display Bold"
    },
    walletLogoContainer: {
        flex: 1
    },
    logo: {
        margin: 'auto'
    },
    instructionsText: {
        fontFamily: "SF Display Regular",
        fontSize: 14
    },
    instructionsTextBold: {
        display: 'inline',
        fontFamily: 'SF Display Bold'
    },
    instructionsContainer: {
        width: 300,
        margin: "auto",
        textAlign: 'left',
        verticalAlign: "text-top",
        marginTop: 25,
        marginBottom: 35,
    },
}


class UnsupportedNetwork extends Component {

    render() {
        return (
            <div>
                <div style={styles.title}>Network is not supported</div>
                <div style={{ ...styles.instructionsText, textAlign: 'center' }}> You should be connected to ThunderCore Network<br />
                </div>
                <div style={styles.instructionsContainer}>
                    <div style={{ ...styles.instructionsText, fontFamily: 'SF Display Bold' }}>How to change Network:</div>
                    <div style={styles.instructionsText}> 1. Go to Settings in your wallet app</div>
                    <div style={styles.instructionsText}> 2. Swich Network to <div style={styles.instructionsTextBold}>ThunderCore</div> </div>
                    <div style={styles.instructionsText}> 3. Back to DApp browser in your wallet and reload the receiver’s link </div>
                </div>
            </div>
        );
    }
}


export default UnsupportedNetwork;

