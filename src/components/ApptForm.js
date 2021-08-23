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
            selectedCentre: "",
            timeslots: [],
            selectedSlot: "",
            date: new Date(),
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
           // return this.props.inputValues.username;
           return this.state.data.newUser;
        }else{
            return this.state.data.bookingDetails.person.name;
        }
    }

    getVacCtrValue() {
        if(this.state.data.bookingDetails === undefined){
            return this.state.selectedCentre;
        }else{
            return this.state.data.bookingDetails.nurseVaccinationCentreTimeslot.nurseVacCtrTimeSlotPK.vaccinationCentre.name;
        }
    }

    getVacDateValue() {
        if(this.state.data.bookingDetails === undefined){
            return this.state.date;
        }else{
            return moment(new Date(this.state.data.bookingDetails.vac_date)).valueOf();        
        }
    }

    getSlotValue(){
        if(this.state.data.bookingDetails === undefined){
            return this.state.selectedSlot;
        }else{
            return this.state.data.bookingDetails.nurseVaccinationCentreTimeslot.nurseVacCtrTimeSlotPK.slot.timeslot;
        }
    }

    createUser(event) {
        fetch('https://homage-covid.herokuapp.com/createBooking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "vac_centre_name": this.state.selectedCentre,
                "slot": this.state.selectedSlot,
                "vac_date": moment(this.state.date).format('YYYYMMDD'),
                //"personName": this.props.inputValues.username
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
          }).then(function(response) {
            console.log(response)
            if(response.status === '200') {
                console.log("success!");
            } else {
                alert("Creating user failed");
            }
          }).catch(error => {
            console.log(error);
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
          }).then(function(response) {
            console.log(response)
            if(response.status === '200') {
                console.log("success!");
            } else {
                alert("Creating user failed");
            }
          }).catch(error => {
            console.log(error);
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
                    {/* <select value={this.state.selectedCentre} */}
                    <select value={this.getVacCtrValue()}
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
                        selected={this.getVacDateValue()}
                        name="date"
                        dateFormat="MM/dd/yyyy"
                        minDate={moment().toDate()}
                    />
                </Form.Group>
    
                <Form.Group className="col-md-4 wrapper" as={Col} controlId="formTimeslot">
                    <Form.Label className="label"><b>Timeslot</b></Form.Label>
                    {/* <select value={this.state.selectedSlot} */}
                    <select value={this.getSlotValue()}
                        onChange= {e =>
                        this.setState({
                          selectedSlot: e.target.value,
                          validationError: e.target.value === "" ? "You must select a timeslot": ""
                        })}>
                        {this.state.timeslots.map((timeslot) => <option key={timeslot.key} value={timeslot.key}>{timeslot.display}</option>)}
                        </select>
                        <div style={{color: "red",marginTop: "5px"}}>
                            {this.state.validationError}
                        </div>
                </Form.Group>
                
                <Form.Group className="wrapper">
                    <Button variant="secondary" onClick={this.back}>Back</Button>
                    {this.state.data.bookingDetails === undefined && 
                    <Button className="btn btn-primary" type="submit" onClick={this.createUser} disable={this.state.isDisabled}>Create</Button>}           
                    {this.state.data.bookingDetails !== undefined && 
                    <Button className="btn btn-info" type="submit" onClick={this.updateUser}>Update</Button>}
                    {this.state.data.bookingDetails !== undefined && 
                    <Button className="btn btn-danger" type="submit" onClick={this.deleteUser}>Delete</Button>}
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