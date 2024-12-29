import MainDatabase from "./database";
import { getFirestore, collection, getDocs, getDoc, doc, onSnapshot, query, where, DocumentReference } from 'firebase/firestore'

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

  

}

export default EventService;