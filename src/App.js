import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react';
import MainForm from './components/MainForm';
import './App.css';


function App() {

  // const [submitting, setSubmitting] = useState(false);
  // const handleSubmit = event => {
  //   event.preventDefault();
  //  setSubmitting(true);

  //  //this shld call the external api to submit to backend
  //  setTimeout(() => {
  //    setSubmitting(false);
  //  }, 3000)
  // }
 
  return (
    <div>
      <MainForm/>
    </div>
  );
}

export default App;