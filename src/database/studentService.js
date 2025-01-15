import MainDatabase from "./database";
import { getFirestore, collection, getDocs, getDoc, doc, onSnapshot, query, where, DocumentReference, addDoc } from 'firebase/firestore'

class StudentService {

  static db = MainDatabase.db;
  static studentCollection = collection(StudentService.db, 'student-info');

  static async getStudentByStudentId(idNumber) {
    console.log("PROCESSING: ", idNumber);

    const q = query(this.studentCollection, where("student_id", "==", idNumber));
    const querySnapshot = await getDocs(q);
    let selectedStudentDoc = null;

    querySnapshot.forEach((doc) => {
      console.log(doc.ref);
      selectedStudentDoc = doc;
    });

    if (selectedStudentDoc) {
      console.log("DONE ".concat(selectedStudentDoc.data()['student_id']));
    }

    return selectedStudentDoc;
  }

  static async getStudentByDocRef(docRef){
    const studentDoc = await getDoc(docRef);
    console.log(studentDoc);
    return studentDoc;
  }

  static async addStudent(firstName, lastName, program, studentId, yearLevel, enableAlert) {

    if(await this.isStudentInDatabase(studentId)) {
      (enableAlert === true) ? alert(`${studentId} is already added`) : console.log(`${studentId} is already added`);
      console.log("closed")
      return false;
    }

    const studentData = {
      first_name: firstName,
      is_deleted: false,
      last_name: lastName,
      program: program,
      student_id: studentId,
      year_level: yearLevel
    };

    await addDoc(StudentService.studentCollection, studentData);
    (enableAlert === true) ? alert(`${studentId} added`) : console.log(`${studentId} added`);
    return true;

  }

  static async isStudentInDatabase(studentId) {
    const existingStudentDoc = await this.getStudentByStudentId(studentId);
    if (existingStudentDoc) {
      return true; // Student already exists
    }
    return false; // Student does not exist
  }

}

export default StudentService;