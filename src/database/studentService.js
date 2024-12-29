import MainDatabase from "./database";
import { getFirestore, collection, getDocs, getDoc, doc, onSnapshot, query, where, DocumentReference } from 'firebase/firestore'

class StudentService {

  static db = MainDatabase.db;
  static studentCollection = collection(StudentService.db, 'student-info');

  static async getStudentByStudentId(idNumber){

    console.log("PROCESSING: ", idNumber);

    const q = query(this.studentCollection, where("student_id", "==", idNumber));
    const querySnapshot = await getDocs(q);
    let selectedStudentDoc = null;

    querySnapshot.forEach((doc) => {
      console.log(doc.ref);
      selectedStudentDoc = doc;
    });

    console.log("DONE ".concat(selectedStudentDoc.data()['student_id']));

    return selectedStudentDoc;

  }

  static async getStudentByDocRef(docRef){
    const studentDoc = await getDoc(docRef);
    console.log(studentDoc);
    return studentDoc;
  }

}

export default StudentService;