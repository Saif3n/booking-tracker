import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import axios from "axios";
import moment from "moment"

export const Post = () => {
  const formInitialDetails = {
    booking_reference: '',
    family_name: '',
    departure_date: '',
    emailaddress: ''
  }
  const [formDetails, setFormDetails] = useState(formInitialDetails);
  const [booking_reference, setbooking_reference] = useState(null)
  const [start, setStart] = useState(null)
  const [checkemailaddress, setCheckemailaddress] = useState(null)
  const [msg, setMsg] = useState(null)

  const [isListVisible, setListVisible] = useState(false); // State to track list visibility




const toggleList = () => {
  setListVisible(!isListVisible); // Toggle list visibility
};


const onFormUpdate = (category, value) => {
  setFormDetails({
    ...formDetails,
    [category]: value
  })
}

const handleSubmit = async (e) => {
  e.preventDefault();
  setbooking_reference(null)
  setCheckemailaddress(null)
  setStart(null)

  let fail = false;
  const emailaddressRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const bookingrefRegex = /^[A-Za-z0-9]{5}H$/;

  if (!bookingrefRegex.test(formDetails.booking_reference)) {
    setbooking_reference('Invalid booking reference.')
    fail = true;
  }

  if (!emailaddressRegex.test(formDetails.emailaddress)) {
    setCheckemailaddress('Invalid email address.')
    fail = true;
  }

  if (fail){
    return;
  }



  let payload = {

    booking_reference: formDetails.booking_reference,
    family_name: formDetails.family_name,
    departure_date: formDetails.departure_date,
    emailaddress: formDetails.emailaddress

  };
  console.log(payload)

  axios
    .post("https://localhost:7024/AddTracker", payload)
    .then((response) => {
      console.log('Azure post successful.', response.status, response.text);
      console.log(response.text)
      setMsg('Tracker successfully added.');
    }).catch((response) => {
      console.log('Azure post unsuccessful.', response.status, response.text);
      setMsg('Tracker failed to be added');
    });

  // setFormDetails(formInitialDetails); REMOVE BEFORE PROD
};

return (
  <>
    <div className="formSub">
      <h2>Track a Seat on Air New Zealand</h2>
      <br></br>

      <div onClick={toggleList} className="important">
        <h6 >Important things to note</h6>
        <ul className={isListVisible ? "" : "hidden"}>
          <li>
            You need to ensure that the provided booking reference, family name, and departure date are correct.
          </li>
          <li>
            If your requested seats become available, an email will be sent to you notifying you of the availability.
          </li>
          <li>
            All data submitted on this site is encrypted. Your data will only be used to check the availability of the desired seats, 
            <br></br>
            and will be deleted once the tracker expires, or upon your request.
          </li>

        </ul>
      </div>

      <br></br>

      <form className="formSub" onSubmit={handleSubmit}>

        <input type="text" value={formDetails.booking_reference} className="form-control" required placeholder="Booking Reference" id="formGroupExampleInput" onChange={(e) => onFormUpdate('booking_reference', e.target.value)} />
        {booking_reference && <div className="invalid">{booking_reference}</div>}
        <input type="text" value={formDetails.family_name} className="form-control" placeholder="Family name" onChange={(e) => onFormUpdate('family_name', e.target.value)} />

        <input type="emailaddress" value={formDetails.emailaddress} className="form-control" placeholder="Email Address" onChange={(e) => onFormUpdate('emailaddress', e.target.value)}></input>
        {checkemailaddress && <div  className="invalid">{checkemailaddress}</div>}

        <input type="text" value={formDetails.departure_date} className="form-control" required placeholder="Departure date (dd-mm-yyyy)" onChange={(e) => onFormUpdate('departure_date', e.target.value)} />
        {start && <div  className="invalid">{start}</div>}
        <button type="submit" className="btn btn-primary"><span>Submit</span></button>
        {msg && 
      <div className="msg">
        <p>{msg}</p>
      </div>}

      </form>
      
      <footer>Powered by a Python Selenium script - Hosted on Microsoft Azure</footer>
    </div>

  </>

)
}
