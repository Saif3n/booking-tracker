import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import axios from "axios";
import moment from "moment"

export const Post = () => {
  const formInitialDetails = {
    link: '',
    startdate: '',
    enddate: '',
    emailaddress: ''
  }
  const [formDetails, setFormDetails] = useState(formInitialDetails);
  const [link, setLink] = useState(null)
  const [start, setStart] = useState(null)
  const [checkemailaddress, setCheckemailaddress] = useState(null)
  const [msg, setMsg] = useState(null)

  const [isListVisible, setListVisible] = useState(false); // State to track list visibility

  function isTwoDaysAhead(dateString) {
    let inputDate = moment(dateString, "DD/MM/YYYY");
    let currentDate = moment();
    let fourDaysAhead = moment(currentDate).add(4, 'days');
    console.log('TWO DAYS + ' + inputDate.isSame(fourDaysAhead, 'day'))
    console.log(fourDaysAhead)
    return inputDate.isAfter(fourDaysAhead);
  }

  function validDate(date1, date2) {
    let momentDate1 = moment(date1, "DD/MM/YYYY"); // Parse date1 using Moment.js
    let momentDate2 = moment(date2, "DD/MM/YYYY"); // Parse date2 using Moment.js
    console.log('VALID DAYS + ' + momentDate2.isAfter(momentDate1));
    return momentDate2.isAfter(momentDate1); // Compare date2 with date1 using Moment.js
  }


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
  setLink(null)
  setCheckemailaddress(null)
  setStart(null)

  let fail = false;
  const emailaddressRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!formDetails.link.startsWith('https://www.bachcare.co.nz/holiday-homes-accommodation/')) {
    setLink('Invalid Bachcare property link.')
    fail = true;
  }

  if (!emailaddressRegex.test(formDetails.emailaddress)) {
    setCheckemailaddress('Invalid email address.')
    fail = true;
  }
  if (!isTwoDaysAhead(formDetails.startdate) || !validDate(formDetails.startdate, formDetails.enddate)) {
    setStart("Invalid dates.")
    fail = true;
  }
  if (fail){
    return;
  }



  let payload = {

    link: formDetails.link,
    startdate: formDetails.startdate,
    enddate: formDetails.enddate,
    emailaddress: formDetails.emailaddress

  };
  console.log(payload)

  axios
    .post("https://localhost:7024/AddProperty", payload)
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
      <h2>Track a property</h2>
      <br></br>

      <div onClick={toggleList} className="important">
        <h6 >Important things to note</h6>
        <ul className={isListVisible ? "" : "hidden"}>
          <li>
            Only 3 properties can be tracked per user.
          </li>
          <li>
            You need to verify that your tracked/desired dates are valid (i.e., your dates meet the minimum night requirement of a listing)
          </li>
          <li>
            If your requested dates become available, an email will be sent to you notifying you of the availability
          </li>
          <li>
            Your start date must be at least 4 days from today's date.
          </li>
        </ul>
      </div>

      <br></br>

      <form className="formSub" onSubmit={handleSubmit}>

        <input type="text" value={formDetails.link} className="form-control" required placeholder="Bachcare Property Link" id="formGroupExampleInput" onChange={(e) => onFormUpdate('link', e.target.value)} />
        {link && <div className="invalid">{link}</div>}
        <input type="emailaddress" value={formDetails.emailaddress} className="form-control" placeholder="Email Address" onChange={(e) => onFormUpdate('emailaddress', e.target.value)}></input>
        {checkemailaddress && <div  className="invalid">{checkemailaddress}</div>}
        <input type="text" value={formDetails.startdate} className="form-control" placeholder="Start Date (DD/MM/YYYY)" onChange={(e) => onFormUpdate('startdate', e.target.value)} />
        <input type="text" value={formDetails.enddate} className="form-control" required placeholder="End Date (DD/MM/YYYY" onChange={(e) => onFormUpdate('enddate', e.target.value)} />
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
