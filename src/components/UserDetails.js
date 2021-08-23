import React, { Component } from 'react';
import { Form, Button, Col, Container } from 'react-bootstrap';

class UserDetails extends Component {

    constructor(props) {
        super(props);

        this.state={
            data: this.props.inputValues
        }
    }

    back  = (e) => {
        e.preventDefault();
        this.props.prevStep();
    }

    saveAndContinue = (e) => {
        //add logic to call endpoint here to check if user has an existing appt 
        fetch('https://homage-covid.herokuapp.com/getPersonBooking?personName=' + this.state.val)
            .then(response => response.json())
            .then(response => {
                this.props.setBookingDetails(response)
            })
            .then(afterSet => {
                this.props.setNewUser(this.state.val)
                this.props.nextStep()
            })
            .catch(error => {
                this.props.setNewUser(this.state.val)
                this.props.nextStep()
              });

    };

    render() {
        return(<Container>
                    <Form>
                        <Form.Group className="col-md-4 wrapper" as={Col} controlId="formName">
                             <Form.Label className="label"><b>Enter your Name</b></Form.Label>
                                <Form.Control
                                type="text"
                                defaultValue={this.props.inputValues.username}
                                name="username"
                                required
                                onChange= {e => this.setState({ val: e.target.value })}                                />
                        </Form.Group>
                        <Form.Group className="wrapper">
                        <Button variant="primary" onClick={this.saveAndContinue}>Next</Button>
                        </Form.Group>
                    </Form>
                </Container>
        );
    }
}

export default UserDetails;
