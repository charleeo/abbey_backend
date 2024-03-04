import { RepaymentStatus } from "src/modules/entities/common.type";


export const MONTHLY = 'montly'
export const YEARLY = 'yearly'




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
export const setPaymentCommencementDateForyearly = (grantedDate, months = 1) => {
  const date = new Date(grantedDate);
  return addMonths(date, months);
};



/**
 * set the date the loan repayment will commence
 * @param grantedDate the date loan was given
 * @param duration how many months the loan will span
 * @returns
 */
export const setPaymentDueDateForNonDaily = (date, duration, type = 'montly') => {
  date = new Date(date);
  if(type ==='yearly') return addYears(date,duration)
  else  return addMonths(date, duration);
};

function addMonths(date, months) {
  date.setMonth(date.getMonth() + months);
  return date;
}

function addYears(date, year) {
  date.setFullYear(date.getFullYear() + year);
}




export function generateReference(code?: string): string {
  const date = new Date();
  const time = date.setTime(date.getTime()).toString();

  return `${code ?? 'APP_CODE_'}${time}`;
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
        if(loanType == MONTHLY){
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

// Function to check if an element is present in the enum
export function isElementPresent(element: string,status:any): boolean {
  return Object.values(status).includes(element);
}

