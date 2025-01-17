import MainDatabase from "./database";
import { getFirestore, collection, getDocs, getDoc, doc, onSnapshot, query, where, DocumentReference, orderBy } from 'firebase/firestore'
import {Parser} from "@json2csv/plainjs"

class EventService {

  static db = MainDatabase.db;
  static eventColletion = collection(EventService.db, 'events');
  static attendanceItemCollection = collection(EventService.db, 'attendance-item');
  
  static async getStudentEvents(studentDocRef){
    const q = query(this.attendanceItemCollection, where("student", "==", studentDocRef));
    const querySnapshot = await getDocs(q);

    const studentEvents = [];

    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      studentEvents.push(doc);
    });

    return studentEvents;

  }

  static async getEventDocRef(eventName) {
    const q = query(EventService.eventColletion, where("event_name", "==", eventName));
    const querySnapshot = await getDocs(q);
    let eventDocRef = "not found";

    querySnapshot.forEach((doc) => {
      eventDocRef = doc.ref;
    });

    return eventDocRef;

  }

  static async getEventParticipantsCsv(eventName) {

    const eventDocRef = await this.getEventDocRef(eventName);

    if(eventDocRef == "not found") {
      alert("event not found")
      return;
    }

    // const studentDocRefs = [];
    const studentAttendance = [];

    const q = query(EventService.attendanceItemCollection, where("event", "==", eventDocRef));
    const querySnapshot = await getDocs(q);

    const studentDocs = await Promise.all(
      querySnapshot.docs.map( async (doc) => {
        const studentDoc = await getDoc(doc.data()['student']);
        studentAttendance[studentDoc.data()['student_id']] = doc.data()['is_present'];
        return studentDoc.data();
      })
    );

    const sortedStudentDocs = studentDocs.sort((a, b) => a.last_name.localeCompare(b.last_name));

    let numAbsents = 0;
    let numPresents = 0;
    let numAttendees = 0;

    // console.log('---------------------------------');
    // you can set the fields of the report here
    const fields = [
      {label: 'Last Name', value: 'last_name'},
      {label: 'First Name', value: 'first_name'},
      {label: 'Year Level', value: 'year_level'},
      {label: 'Program', value: 'program'},
      {label: 'Attendance', value: (row) => {

        numAttendees++;

        if (studentAttendance[row.student_id] === true) {
          numPresents++;
          return "Present";
        } else {
          numAbsents++;
          return "Absent";
        }
      }}
    ];

    try {
      const opts = {fields};
      const parser = new Parser(opts);
      let csv = parser.parse(studentDocs);
      csv = csv.concat(`\n"Total Present:",${numPresents}\n"Total Absent:",${numAbsents}\n"Expected Attendees:",${numAttendees}\n`);
      return csv;
    } catch (err) {
      console.log(err);
      alert('Failed to download report')
      return;
    }

  }

  static async getEvents() {
    const eventNames = [];
    const q = query(EventService.eventColletion, orderBy("event_name", "asc"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      eventNames.push(doc.data()['event_name']);
    });

    return eventNames;

  }

}

export default EventService;