import { use, useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import StudentService from "./database/studentService";
import { StudentContext } from "./App";
import EventService from "./database/eventService";
import { getDoc } from "firebase/firestore";
import checkIcon from './assets/check-line.svg';
import locationIcon from './assets/map-pin-line.svg';
import timeIcon from './assets/time-line.svg';
import groupIcon from './assets/group-line.svg';
import backIcon from './assets/arrow-left-line.svg';
import DateTransformer from './helper_functions/dateTransformer.js';

function EventPage() {

  const [studentDoc, setStudentDoc] = useContext(StudentContext);
  const { id }  = useParams();
  const [studentEventDocs, setStudentEventDocs] = useState([]); // this is the list of attendance-item documents
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [eventComponents, setEventComponents] = useState(<></>);

  useEffect(() => {
    if(studentDoc == null) {
      console.log("Getting student");
      getStudent();
      return;
    };

  }, []);

  useEffect(() => {
    if(studentDoc == null) return;

    const newEventComponents = events.map((event) => {
      return (
        <ScheduleCard key={event.id} eventDoc={event}/>
      );
    });

    setEventComponents(newEventComponents);

  }, [events]);

  useEffect(() => {
    if(studentDoc == null) return

    fetchStudentEvents();

  }, [studentDoc]);

  useEffect(() => {
    if(studentEventDocs.length === 0) return;

    console.log(studentEventDocs);

    fetchEvents();
  }, [studentEventDocs]);

  async function getStudent(){
    const newstudentDoc = await StudentService.getStudentByStudentId(id);
    setStudentDoc(newstudentDoc);
  }

  async function fetchStudentEvents() {
    const newstudentEvents = await EventService.getStudentEvents(studentDoc.ref);
    setStudentEventDocs(newstudentEvents);
    console.log(newstudentEvents);
  }

  async function fetchEvents(){
    const newEvents = await Promise.all(studentEventDocs.map(async (doc) => {
      const eventDoc = await getDoc(doc.data()['event']);
      return eventDoc;
    }));
    setEvents(newEvents);
  }

  function logout(){
    setStudentDoc(null);
    navigate('/');
  }


  function ScheduleCard({id, eventDoc}) {

    var attended = true;

    const date = eventDoc.data()['date'].toDate();
    const event_name = eventDoc.data()['event_name'];
    const venue = eventDoc.data()['venue'];
    const organizer = eventDoc.data()['organizer'];

    const day = date.getDate();
    const month = DateTransformer.transformMonth(date.getMonth());
    const time = DateTransformer.transformTime(date);



    console.log(event_name.concat(": ").concat(DateTransformer.transformTime(date)))

    const checkMark = attended ? <img src = {checkIcon} alt="Attended" className="check-icon"/> : <></>;

    return (
      <div className="schedule-card">
        <div className="schedule-card-details">
          <div className="schedule-card-header">
            <h2 className="event-name">{event_name}</h2>
            {/* {checkMark} */}
          </div>
          <div className="schedule-card-details-body">
            <div className="schedule-card-details-body-item">
              <img src = {timeIcon} alt="Time" className="body-icon"/>
              <p className="schedule-detail-text">{time}</p>
              {checkMark}
            </div>
            <div className="schedule-card-details-body-item">
              <img src = {locationIcon} alt="Location" className="body-icon"/>
              <p className="schedule-detail-text">{venue}</p>
            </div>
            <div className="schedule-card-details-body-item">
              <img src = {groupIcon} alt="Org" className="body-icon"/>
              <p className="schedule-detail-text">{organizer}</p>
            </div>
          </div>
        </div>
        <div className="schedule-date-box">
          <div className="month-box">
            <p className="schedule-month">{month}</p>
          </div>
          <div className="day-box">
            <h1 className="schedule-day">{day}</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h1 className="event-page-title">{"Events of ".concat(studentDoc ? studentDoc.data()['first_name'] : "none")}</h1>
        <div className="schedule-card-container">
          {eventComponents}
        </div>
      </div>
    </div>
  );
}

export default EventPage;