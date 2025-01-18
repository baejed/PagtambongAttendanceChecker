import { useEffect, useState } from 'react';
import StudentService from "./database/studentService";
import EventService from "./database/eventService";
import * as d3 from "d3"
import {Parser} from "@json2csv/plainjs"

function StudentManagerPage() {

  const [csvData, setCsvData] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    idNumber: '',
    program: 'Computer Science', // Default value
    yearLevel: '1st Year', // Default value
  });
  const [eventOptions, setEventOptions] = useState(<></>);
  const [selectedEvent, setSelectedEvent] = useState("");

  useEffect(() => {
    fetchEvents();
  },[]);

  async function fetchEvents() {
    let newEvents;
    const newEventNames = await EventService.getEvents();

    const newEventOptions = newEventNames.map((value, key) => {
      if(key === 0) {
        setSelectedEvent(value)
      }
      return (
        <option key={key} value={value}>{value}</option>
      )
    });

    setEventOptions(newEventOptions);

  }

  function downloadCsv(csv) {
    // Create a Blob from the CSV data
    const blob = new Blob([csv], { type: 'text/csv' });

    // Create an anchor element
    const link = document.createElement('a');

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Set the download attribute with the filename
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedEvent} attendance report.csv`);

    // Append the link to the document body (not visible)
    document.body.appendChild(link);

    // Programmatically trigger a click event on the link
    link.click();

    // Clean up the DOM by removing the link
    document.body.removeChild(link);

    // Revoke the URL to release resources
    URL.revokeObjectURL(url);
  }

  async function addStudents() {

    // console.log("pressed");

    if(csvData.length == 0) {
      alert("csv file is empty");
      return;
    }

    console.log('---------------BATCH ADD START---------------')

    let numFails = 0;
      
    // this should be the names of the fields in the csv
    for(let i = 0; i < csvData.length; i++){
      const firstName = csvData[i]['firstName'];
      const lastName = csvData[i]['lastName'];
      const idNumber = csvData[i]['idNumber'];
      const program = csvData[i]['program'];
      const yearLevel = csvData[i]['yearLevel'];

      const added = await StudentService.addStudent(firstName, lastName, program, idNumber, yearLevel, false);

      if(added === false) {
        numFails++;
      }
      
    }

    console.log('----------------BATCH ADD END----------------')

    alert(`${numFails} error/s out of ${csvData.length}`);


  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // console.log(`${name}: ${value}`);
  };

  const handleEventInputChange = (e) => {
    const eventName = e.target.value;
    setSelectedEvent(eventName);
  };

  async function handleGetReport() {

    const csv = await EventService.getEventParticipantsCsv(selectedEvent);
    downloadCsv(csv);

  }

  const handleSubmit = () => {
    if(formData['firstName'] === '' || formData['lastName'] === '' || formData['idNumber'] === ''){
      console.log('empty')
      return;
    }
    
    StudentService.addStudent(formData['firstName'], formData['lastName'], formData['program'], formData['idNumber'], formData['yearLevel'], true)

  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
      processCsvFile(file);
    } else {
      alert('Please upload a valid CSV file.');
    }
  };

  const processCsvFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      // Use D3 to parse the CSV content
      const parsedData = d3.csvParse(content);
      console.log('Parsed CSV Data:', parsedData);
      setCsvData(parsedData);
      // You can now handle the parsed CSV data for further processing
    };
    reader.readAsText(file);
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h2>First name</h2>
        <input
          type="text"
          className="student-input-fields"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
        />

        <h2>Last name</h2>
        <input
          type="text"
          className="student-input-fields"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
        />

        <h2>ID NUMBER</h2>
        <input
          type="text"
          className="student-input-fields"
          name="idNumber"
          value={formData.idNumber}
          onChange={handleInputChange}
        />

        <h2>Program</h2>
        <select
          className="student-combo-box"
          name="program"
          value={formData.program}
          onChange={handleInputChange}
        >
          <option value="Computer Science">Computer Science</option>
          <option value="Information Technology">Information Technology</option>
        </select>

        <h2>Year Level</h2>
        <select
          className="student-combo-box"
          name="yearLevel"
          value={formData.yearLevel}
          onChange={handleInputChange}
        >
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
          <option value="4th Year">4th Year</option>
        </select>
      </div>
      <button className='participant-mngr-btn' onClick={handleSubmit}>Submit</button>
      <button className='participant-mngr-btn' onClick={addStudents}>Enter CSV</button>
      <input type="file" accept='.csv' onChange={handleFileChange}/>
      <h2>Event</h2>
      <select
        className="student-combo-box"
        name="program"
        value={selectedEvent}
        onChange={handleEventInputChange}
      >
        {eventOptions}
      </select>
      <button className='participant-mngr-btn' onClick={handleGetReport}>Download Attendance Report</button>
    </>
  );
}

export default StudentManagerPage;
