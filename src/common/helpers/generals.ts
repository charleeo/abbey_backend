import fs from 'fs/promises';
import path, { sep } from 'path';

export const SUNDAY = 'Sunday';
export const SATURDAY = 'Saturday';
export const FRIDAY = 'Friday';

export const DAILY='daily'
export const WEEKLY='weekly'
export const MONTHLY = 'montly'
export const YEARLY = 'yearly'


export function day() {
  return [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
}

/**
 * This will return the day name from a given date
 * @param date
 * @returns
 */
export const dayName = (date) => {
  const dayName = new Date(date).toLocaleString('en-us', {
    weekday: 'long',
  });
  return dayName;
};

/**
 * set the date the loan repayment will commence
 * @param grantedDate
 * @param duration
 * @returns
 */
export const setPaymentCommencementDateDaily = (grantedDate, startDay = 2) => {
  const day_name = dayName(grantedDate);
  const date = new Date(grantedDate);
  if(day_name === SUNDAY || day_name === FRIDAY){
    startDay =3
  }
  if(day_name === SATURDAY){
    startDay =4
  }
  const paymentCommencement = date.setDate(date.getDate() + startDay);
  return new Date(paymentCommencement);
};

/**
 * set the date the loan repayment will commence
 * @param commencementDate
 * @returns
 */
export const setPaymentDueDateDaily = (commencementDate) => {
  
  const paymentDueDate = commencementDate.setTime(
    commencementDate.getTime() + 30 * 24 * 60 * 60 * 1000,
  );
  return new Date(paymentDueDate);
};

/**
 * set the date the loan repayment will commence
 * @param grantedDate the date loan was given
 * @param duration how many months the loan will span
 * @returns
 */
export const setPaymentCommencementDateMonthly = (grantedDate, months = 1) => {
  const date = new Date(grantedDate);
  return addMonths(date, months);
};
/**
 * set the date the loan repayment will commence
 * @param grantedDate the date loan was given
 * @param duration how many months the loan will span
 * @returns
 */
export const setPaymentCommencementDateWekly = (grantedDate, weeks = 1) => {
  const date = new Date(grantedDate);
  return addWeeks(date, weeks);
};

/**
 * set the date the loan repayment will commence
 * @param grantedDate the date loan was given
 * @param duration how many months the loan will span
 * @returns
 */
export const setPaymentDueDateForNonDaily = (date, duration) => {
  date = new Date(date);
  return addMonths(date, duration);
};

function addMonths(date, months) {
  date.setMonth(date.getMonth() + months);
  return date;
}


function addWeeks(date: Date, weeks = 1) {
  date.setTime(date.getTime() + weeks);
  return date;
}

export function generateReference(code?: string): string {
  const date = new Date();
  const time = date.setTime(date.getTime()).toString();

  return `${code ?? 'APP_CODE_'}${time}`;
}

export function Classes(bases) {
  class Bases {
    constructor() {
      bases.forEach((base) => Object.assign(this, new base()));
    }
  }
  bases.forEach((base) => {
    Object.getOwnPropertyNames(base.prototype)
      .filter((prop) => prop !== 'contructor')
      .forEach((prop) => (Bases.prototype[prop] = base.prototype[prop]));
  });
  return Bases;
}

/**
 * this will return a string message corresponding to the code pass to it
@param {} code the response code to passed
* @returns {string}
*/
export async function setExceptionFilters(exception) {
  let message = '';
  let exceptions = await fs.readFile(
    path.join(`.${sep}src${sep}storage${sep}data${sep}exceptions.json`),
    'utf-8',
  );
  exceptions = JSON.parse(exceptions);

  if (exceptions.hasOwnProperty(exception)) {
    message = exceptions[exception];
  }
  return message;
}

export function fullDateWithoutTime() {
  // Create a new Date object representing the current date and time
  const currentDate = new Date();

  // Extract date components
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
  const day = currentDate.getDate();

  // Create a string in the format YYYY-MM-DD
  const fullDateWithoutTime = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;

  return fullDateWithoutTime;
}


  export function calculatDailyOverdue(repaymentStartData:Date,dailyRepaymentAmount:number,totalPaid:number)
  {
      const elapseWeekdays = totalWeekDays(repaymentStartData)
      
      const expectedRepayment: number = dailyRepaymentAmount * elapseWeekdays
      const overDue =  expectedRepayment > totalPaid ?  expectedRepayment - totalPaid : 0
      
      return overDue
  }

  export function calculatWeeklyDue(repaymentStartData:Date,WeeklyRepaymentAmount:number,totalPaid:number)
  {
      const elapseWeeks = weeksPast(repaymentStartData)
      const expectedRepayment: number = WeeklyRepaymentAmount * elapseWeeks
      const overDue =  expectedRepayment > totalPaid ?  expectedRepayment - totalPaid : 0
      return overDue
  }

  export function calculatMonthlyDue(repaymentStartData:Date,monthlyRepaymentAmount:number,totalPaid:number)
  {
      const elapseMonths = monthsPast(repaymentStartData)
      const expectedRepayment: number = monthlyRepaymentAmount * elapseMonths
      const overDue =  expectedRepayment > totalPaid ?  expectedRepayment - totalPaid : 0
      return overDue
  }
  

  function timeDiff(pastDate:Date)
  {
    // Define the current date and the past date
        const currentDate:Date = new Date();
        const date :Date = new Date(pastDate)
        
        const differenceInMilliseconds:any = Math.abs(currentDate.getTime() - date.getTime());

        // Convert milliseconds to days
        const differenceInDays = Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24));
        return differenceInDays

  }

  function totalWeekDays(pastDate:Date)
  {
    const differenceInDays = timeDiff(pastDate)
    const date: Date = new Date(pastDate)
    let weekdays = 0;
    for (let i = 0; i <= differenceInDays; i++) {
        const tempDate = new Date(pastDate);
        
        tempDate.setDate(date.getDate() + i);
        if (tempDate.getDay() !== 0 && tempDate.getDay() !== 6) {
            weekdays++;
        }
    }
    return weekdays
  }

  function weeksPast(pastDate:Date)
  {
    return Math.floor(timeDiff(pastDate) / 7)
  }

  /**
   * 
   * @param pastDate 
   * @returns number
   */
  function monthsPast(pastDate:Date):number
  {
    const currentDate : Date = new Date()
    const diffYears = currentDate.getFullYear() - pastDate.getFullYear()
    const diffMonths = Math.floor( diffYears * 12 + currentDate.getMonth() - pastDate.getMonth())
    return diffMonths
  }

/**
 * 
 * @param loanType 
 * @param repaymentStartData 
 * @param repaymentRate 
 * @param totalPaid 
 * @returns number
 */
  export function calculatOverdue(
    {
        loanType,
        repaymentStartDate,
        repaymentRate,
        totalPaid
        }:OverdueType
    )
  {
    let overDue:any=0
    if(new Date(repaymentStartDate).getTime() < new Date().getTime()){
        if(loanType == DAILY){
            overDue =calculatDailyOverdue(repaymentStartDate,repaymentRate,totalPaid)
        }else if(loanType == WEEKLY){
            overDue = calculatWeeklyDue(repaymentStartDate,repaymentRate,totalPaid)
        }else if(loanType == MONTHLY){
            overDue = calculatMonthlyDue(repaymentStartDate,repaymentRate,totalPaid)
        }
        overDue = Number(overDue).toFixed(2)
    }
    
    return overDue
  }

  interface OverdueType{
    loanType?:string
    repaymentStartDate:Date
    repaymentRate:number
    totalPaid:number
  }

  export function getMonthName(month: number): string | null {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
  ];
  return months[month -1]
 
}

export function test()
{
  // Generate an array with 12 objects, one for each month, including empty sums
  // const monthlyData: { month: string; sumAmount: number }[] = [];
  // for (let i = 1; i <= 12; i++) {
  //   const monthData = result.find(item => parseInt(item.month) === i);
  //   monthlyData.push({
  //     month: getMonthName(i),
  //     sumAmount: monthData ? parseFloat(monthData.sumAmount) : 0,
  //   });
  // }
}




