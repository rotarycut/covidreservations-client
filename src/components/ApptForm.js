import React, { Component } from 'react';
import { Col, Button, Container, Form, Alert } from 'react-bootstrap';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import moment from 'moment';

class ApptForm extends Component {

    constructor (props) {
        super(props)
        this.state = {
            centres: [],
            selectedCentre: this.props.inputValues.bookingDetails !== undefined ? this.props.inputValues.bookingDetails.nurseVaccinationCentreTimeslot.nurseVacCtrTimeSlotPK.vaccinationCentre.name : "",
            timeslots: [],
            selectedSlot: this.props.inputValues.bookingDetails !== undefined ? this.props.inputValues.bookingDetails.nurseVaccinationCentreTimeslot.nurseVacCtrTimeSlotPK.slot.timeslot : "",
            date: this.props.inputValues.bookingDetails !== undefined ? moment(new Date(this.props.inputValues.bookingDetails.vac_date)).valueOf() : new Date(),
            data: this.props.inputValues,
            errorMessage: "",
            successMessage:"",
            isDisabled:false,
        };
        this.handleDateChange = this.handleDateChange.bind(this);
        this.createUser = this.createUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    }

    reinitializeForm() {
        console.log(this.state.errorMessage);
        this.setState({
            errorMessage: "",
            successMessage: ""
        })
        console.log(this.state.errorMessage);
    }

    back  = (e) => {
        e.preventDefault();
        this.props.prevStep();
        this.props.setBookingDetails(undefined);
        this.props.setNewUser('');
    }

    handleDateChange(date) {
        this.setState({
          date: date
        })
    }

    getNameValue() {
        if(this.state.data.bookingDetails === undefined){
           return this.state.data.newUser;
        } else{
            return this.state.data.bookingDetails.person.name;
        }
    }

    createUser(event) {
        this.reinitializeForm();
        fetch('https://homage-covid.herokuapp.com/createBooking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "vac_centre_name": this.state.selectedCentre,
                "slot": this.state.selectedSlot,
                "vac_date": moment(this.state.date).format('YYYYMMDD'),
                "personName": this.props.inputValues.newUser
            })
          })
          .then(response => response.json())
          .then(response => {
            console.log(response);
            if(response.status === "success") {
                this.state.isDisabled = true;
                console.log(this.state.isDisabled);
                this.setState({successMessage: "Your appointment is booked successfully"});
            } else {
                this.setState({errorMessage: "Failed to book appointment - " + response.reason});
            }
          })
          .catch(err => {
            this.setState({errorMessage: "Something went wrong. Please contact IT support."});
          });
          event.preventDefault();
    }

    updateUser(event) {
        fetch('https://homage-covid.herokuapp.com/updateBooking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "vac_centre_name": this.state.selectedCentre,
                "slot": this.state.selectedSlot,
                "vac_date": moment(this.state.date).format('YYYYMMDD'),
                "personName": this.props.inputValues.newUser
            })
          })
          .then(response => response.json())
          .then(response => {
            console.log(response);
            if(response.status === "success") {
                this.state.isDisabled = true;
                console.log(this.state.isDisabled);
                this.setState({successMessage: "Your appointment is updated successfully"});
            } else {
                this.setState({errorMessage: "Failed to updated appointment - " + response.reason});
            }
          })
          .catch(err => {
            this.setState({errorMessage: "Something went wrong. Please contact IT support."});
          });
          event.preventDefault();
    }

    deleteUser(event) {
        fetch('https://homage-covid.herokuapp.com/deleteBooking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "vac_centre_name": this.state.selectedCentre,
                "slot": this.state.selectedSlot,
                "vac_date": moment(this.state.date).format('YYYYMMDD'),
                "personName": this.props.inputValues.newUser
            })
          }) .then(response => response.json())
          .then(response => {
            console.log(response);
            if(response.status === "success") {
                this.state.isDisabled = true;
                console.log(this.state.isDisabled);
                this.setState({successMessage: "Your appointment is deleted successfully"});
            } else {
                this.setState({errorMessage: "Failed to delete appointment - " + response.reason});
            }
          })
          .catch(err => {
            this.setState({errorMessage: "Something went wrong. Please contact IT support."});
          });
          event.preventDefault();
    }

    componentDidMount() {
        fetch("https://homage-covid.herokuapp.com/vaccinationCentres")
          .then((response) => {
            return response.json();
          })
          .then(data => {
            let vaccinationCentres = data.map(centre => {
              return {value: centre.name, display: centre.name}
            });
            this.setState({
                centres: [
                    {
                      value: "",
                      display:
                        "(Select your centre)"
                    }
                  ].concat(vaccinationCentres)
            });
          }).catch(error => {
            console.log(error);
          });

          fetch("https://homage-covid.herokuapp.com/slots")
          .then((response) => {
            return response.json();
          })
          .then(data => {
            let timeslots = data.map(timeslot => {
              return {value: timeslot.timeslot, display: timeslot.timeslot}
            });
            this.setState({
                timeslots: [
                    {
                      value: "",
                      display:
                        "(Select your timeslot)"
                    }
                  ].concat(timeslots)
            });
          }).catch(error => {
            console.log(error);
          });
      }

    render() {   
        return (
            <Container>
              <Form>
                <Form.Label><b>Manage Booking</b></Form.Label>
                
                <Form.Group className="col-md-4 wrapper" as={Col} controlId="formName">
                    <Form.Label className="label" required><b>Name</b></Form.Label>
                        <Form.Control
                            type="text"
                            value={this.getNameValue()}
                            name="username"
                            required
                            onChange={this.props.handleChange}
                        />
                     </Form.Group>

                <Form.Group className="col-md-4 wrapper" as={Col} controlId="formCentre">
                    <Form.Label className="label"><b>Centre</b></Form.Label>
                    <select value={this.state.selectedCentre}
                        onChange={e =>
                            this.setState({
                              selectedCentre: e.target.value,
                              validationError: e.target.value === "" ? "You must select a centre": ""
                            })}>
                        {this.state.centres.map((centre) => <option key={centre.key} value={centre.key}>{centre.display}</option>)}
                        </select>
                </Form.Group>

                <Form.Group className="col-md-4 wrapper">
                    <Form.Label className="label"><b>Appointment Date</b></Form.Label>
                    <DatePicker
                        onChange={ this.handleDateChange }
                        selected={this.state.date}
                        name="date"
                        dateFormat="MM/dd/yyyy"
                        minDate={moment().toDate()}
                    />
                </Form.Group>
    
                <Form.Group className="col-md-4 wrapper" as={Col} controlId="formTimeslot">
                    <Form.Label className="label"><b>Timeslot</b></Form.Label>
                    <select value={this.state.selectedSlot}
                        onChange= {e =>
                        this.setState({
                          selectedSlot: e.target.value,
                          validationError: e.target.value === "" ? "You must select a timeslot": ""
                        })}>
                        {this.state.timeslots.map((timeslot) => <option key={timeslot.key} value={timeslot.key}>{timeslot.display}</option>)}
                        </select>
            
                </Form.Group>
                
                <Form.Group className="wrapper">
                    <Button className="button-padding" variant="secondary" onClick={this.back}>Back</Button>
                    {this.state.data.bookingDetails === undefined && 
                    <Button className="btn btn-primary button-padding" type="submit" onClick={this.createUser} disable={this.state.isDisabled}>Create</Button>}           
                    {this.state.data.bookingDetails !== undefined && 
                    <Button className="btn btn-info button-padding" type="submit" onClick={this.updateUser}>Update</Button>}
                    {this.state.data.bookingDetails !== undefined && 
                    <Button className="btn btn-danger button-padding" type="submit" onClick={this.deleteUser}>Delete</Button>}
                </Form.Group>
                    
                <Alert variant='success' show={this.state.successMessage}>
                    {this.state.successMessage}
                </Alert>
                <Alert variant='danger' show={this.state.errorMessage}>
                    {this.state.errorMessage}
                </Alert>
              </Form>
            </Container>
        );
    }   
}

export default ApptForm;
