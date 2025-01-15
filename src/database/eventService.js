import MainDatabase from "./database";
import { getFirestore, collection, getDocs, getDoc, doc, onSnapshot, query, where, DocumentReference, orderBy } from 'firebase/firestore'

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

  static async getEvents() {
    const eventNames = [];
    const q = query(EventService.eventColletion, orderBy("event_name", "asc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      eventNames.push(doc.data()['event_name']);
    });

    // console.log(eventNames);

    return eventNames;

  }

}

export default EventService;