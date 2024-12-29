import { use, useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import StudentService from "./database/studentService";
import { StudentContext } from "./App";
import EventService from "./database/eventService";
import { getDoc } from "firebase/firestore";

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
        <div>
          <p>{event.data()['event_name']}</p>
        </div>
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

  return (
    <div>
      <h1>{"Event Page of ".concat(studentDoc == null ? "null" : studentDoc.data()['first_name'])}</h1>
      {eventComponents}
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default EventPage;