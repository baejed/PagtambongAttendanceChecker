class DateTransformer {

  static transformMonth(month) {
    switch (month) {
      case 0:
        return "JAN";
      case 1:
        return "FEB";
      case 2:
        return "MAR";
      case 3:
        return "APR";
      case 4:
        return "MAY";
      case 5:
        return "JUN";
      case 6:
        return "JUL";
      case 7:
        return "AUG";
      case 8:
        return "SEP";
      case 9:
        return "OCT";
      case 10:
        return "NOV";
      case 11:
        return "DEC";
      default:
        return "Invalid Month";
    }
  }

  static transformTime(date){

    const hour = ((date.getHours() - 1) % 12) + 1;
    const minutes = date.getMinutes().toString().padStart(2, '0');;
    const amPm = date.getHours() >= 12 ? "PM" : "AM";

    return `${hour}:${minutes} ${amPm}`;

  }

}

export default DateTransformer;