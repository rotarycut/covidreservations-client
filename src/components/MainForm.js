import React, { Component } from 'react';
import UserDetails from './UserDetails';
import ApptForm from './ApptForm';

class MainForm extends Component {
  state = {
    step: 1,
    username: '',
    centre: '',
    timeslot: '',
    bookingDetails: undefined,
    newUser:''
  }

  nextStep = () => {
    const { step } = this.state
    this.setState({
        step : step + 1
    })
  }

  prevStep = () => {
    const { step } = this.state
    this.setState({
        step : step - 1
    })
  }

  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value})
  }

  setBookingDetails = (bookingDetails) => {
    this.setState({bookingDetails: bookingDetails})
  }

  setNewUser = (newUser) => {
      this.setState({newUser: newUser})
  }

  render() {
    const { step, username, centre, timeslot, bookingDetails, newUser} = this.state;
    const inputValues = { username, centre, timeslot, bookingDetails, newUser };
    
    switch(step) {
      case 1:
        return <UserDetails 
                    nextStep = {this.nextStep}
                    handleChange = {this.handleChange}
                    inputValues = {inputValues}
                    setBookingDetails = {this.setBookingDetails}
                    setNewUser = {this.setNewUser}
                    />

      case 2:
        return <ApptForm
          nextStep = {this.nextStep}
          prevStep = {this.prevStep}
          handleChange = {this.handleChange}
          inputValues = {inputValues}
          date = {this.state.date}
          setBookingDetails = {this.setBookingDetails}
          setNewUser = {this.setNewUser}
          />
    }
  }    
}

export default MainForm;