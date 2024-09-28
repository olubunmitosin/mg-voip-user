// Check boolean values
export const checkBoolean = (
    expressionOne?: string | undefined,
    expressionTwo?: boolean | undefined,
  ): boolean => {
    if (expressionOne !== undefined && expressionTwo !== undefined) {
      return expressionOne.length > 0 && expressionTwo;
    }

    return false;
};


export const todayDate = () => {
  const date = new Date();
  const day = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Sunday",
  ];
  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dayName = date.getDay();
  const todayDate = date.getDate();
  const monthName = date.getMonth();
  const year = date.getFullYear();
  return `${day[dayName]}, ${todayDate} ${month[monthName]} ${year}`
}


export const concatenateErrorMessages = (response: any): string => {
  let message = '';
  Object.keys(response).map((key, item) => {
    message += ` ${response[key].message}`
  });
  return message;
}