import MainDatabase from "./database";
import { getFirestore, collection, getDocs, getDoc, doc, onSnapshot, query, where, DocumentReference, orderBy } from 'firebase/firestore'
// import * as json2csv from "json2csv"

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

  static async getEventParticipants(eventName) {

    const eventDocRef = await this.getEventDocRef(eventName);

    if(eventDocRef == "not found") {
      alert("event not found")
      return;
    }

    // const studentDocRefs = [];
    const studentAttendance = [];

    const q = query(EventService.attendanceItemCollection, where("event", "==", eventDocRef));
    const querySnapshot = await getDocs(q);

    const studentDoc = await Promise.all(
      querySnapshot.docs.map( async (doc) => {
        const studentDoc = await getDoc(doc.data()['student']);
        studentAttendance[studentDoc['student_id']] = doc.data()['is_present'];

        console.log(studentDoc);
        return studentDoc;
      })
    );



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