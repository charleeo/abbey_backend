import { HttpStatus, Injectable, Res, Body, Request, Req } from '@nestjs/common';

import { responseStructure } from 'src/common/helpers/response.structure';

import { Response } from 'express';

import {
  fullDateWithoutTime,
  generateReference,
  setPaymentCommencementDateDaily,
  setPaymentCommencementDateMonthly,
  setPaymentCommencementDateWekly,
  setPaymentDueDateDaily,
  setPaymentDueDateForNonDaily,
} from 'src/common/helpers/generals';

import {
  ApprovalStatus,
  DaysAndWeekAndMonths,
  InterestPaymentStatus,
} from 'src/modules/entities/common.type';

import { LoanSettingService } from '../loan.settings.service';
import { LoanRepository } from '../../repositories/loan.repository';
import { LoanApplicationDto } from '../../dto/apply.for.loan.dto';
import { ApproveLoanDto } from '../../dto/verify.loan.dto';
import { LoanRepaymentDurationCategory } from 'src/modules/config/entities/loans.category.entity';
import { LoanType } from 'src/modules/config/entities/loan.type.entity';
import { BaseDataSource } from 'src/common/helpers/base.data.ource';
import { instanceToPlain } from 'class-transformer';
import { Loan } from '../../entities/loan.entity';

@Injectable()
export class ApplicationService extends BaseDataSource {
  constructor(
    private readonly loanRepo: LoanRepository,
    private readonly loanSettingService: LoanSettingService,
  ) {
    super(loanRepo);
  }

  /**
   * Process the loan and save records to database
   * @param dto
   * @param response
   * @param req
   * @returns
   */
  async applayForLoan(
    @Body() dto: LoanApplicationDto,
    @Res() response: Response,
    @Request() req: Request,
  ): Promise<any> {
    let status = false;
    let statusCode: HttpStatus;
    let message = '';
    let responseData = null;
    const user = await this.getUser(req);

    const loanType = await this.loanSettingService.getLoanTypeById(
      dto.loan_type,
    );

    const repaymenDurationtPlan =
      await this.loanSettingService.getRepaymentDurationCategoriesById(
        dto.loan_durtion_category_id,
      );

    const {
      repayment_amount,
      interest,
      amount,
    } = await this.processLoans(dto, loanType, repaymenDurationtPlan);

    let repaymentAmount = Number(repayment_amount).toFixed(2);

    const repayment_counts = this.repaymentCount(
      loanType,
      repaymenDurationtPlan,
    );

    const interestPaymentCheck = this.checkInterestUpfrontPayment(
      dto,
      amount,
      interest,
      repayment_counts,
      repaymentAmount,
    );

    const repaymentObject = interestPaymentCheck.object;
    repaymentAmount = interestPaymentCheck.amount;
    let loanRepaymentTotal = parseFloat(amount)

    if(dto.interest_payment_status === InterestPaymentStatus.not_paid_upfront){
      loanRepaymentTotal + parseFloat(interest)
    }

    //Save the loan information to database and return the response
    responseData = await this.loanRepo.save({
      ...repaymentObject,
      customer_id: user.id,
      loan_type: dto.loan_type,
      amount: amount,
      interest: interest,
      repayment_rate: parseFloat(repaymentAmount),
      repayment_intervals: repayment_counts,
      loan_duration_category: dto.loan_durtion_category_id,
      expected_repayment_amount: loanRepaymentTotal,
      reference: generateReference(),
    });

    if (responseData) {
      message = 'Data creted';
      status = true;
      statusCode = HttpStatus.CREATED;
    }

    return response
      .status(statusCode)
      .send(responseStructure(status, message, responseData, statusCode));
  }

  

  /**
   * @param amount
   * Calculate daily loan repayment data
   */
  protected calCulateDailyRepaymentPlan(amount: number) {
    return amount / 22; //22 is the days for daily payments
  }

  /**
   *Set how much to be repaid monthly
   * @param amount
   * @param repaymentDuration
   */
  protected calculateMonthlyRepaymentPlan(
    amount: number,
    repaymentDuration = 12,
  ) {
    return amount / repaymentDuration;
  }

  /**
   *Set how much to be paid weekly
   * @param amount
   * @param repaymentDuration
   */
  protected calculateWeeklyRepaymentPlan(
    amount: number,
    repaymentDuration = 12,
  ) {
    const weeks = (repaymentDuration * 30) / 7; //days

    return Math.ceil(amount / weeks);
  }

  /**
   *
   * @param amount
   * @param repaymentDuration
   */
  protected calculateMonthlyRepaymentInterval(
    paymentPlan: number | any,
  ): number {
    return paymentPlan;
  }

  protected calculateInterest(amount, rate): number {
    return (rate / 100) * amount;
  }

  /**
   * Format the daily loans application process
   */
  protected dailyLoansFormating(dto): any {
    const amount = dto.amount;

    const grantedDate = fullDateWithoutTime();
    const repaymentCommencementDate: Date = setPaymentCommencementDateDaily(grantedDate);

    const repaymentAmount: number = this.calCulateDailyRepaymentPlan(amount);
    
    const repaymentDueDate: Date = setPaymentDueDateDaily(new Date( repaymentCommencementDate))
      
    const interest = this.calculateInterest(amount, 15);

    return {
      interest: interest,
      repayment_amount: repaymentAmount,
      repayment_due_date: repaymentDueDate,
      repayment_commencement_date: repaymentCommencementDate,
      amount: amount,
      start_date: grantedDate,
    };
  }

  protected getRepaymentDurationLoanPlan(
    category: LoanRepaymentDurationCategory,
  ): number {
    const paymentDurationPlan = category.category_tagline.split('_')[0];
    return parseInt(paymentDurationPlan);
  }

  /**
   * Format the montly loans application process
   */
  protected monthlyLoansFormating(dto, repaymentCat): any {
    const amount = dto.amount;

    const grantedDate =fullDateWithoutTime();

    const interest: number = this.calculateInterest(amount, 20);

    const repaymentDuration = this.getRepaymentDurationLoanPlan(repaymentCat);

    const repaymentCommencementDate: Date =
      setPaymentCommencementDateMonthly(new Date(grantedDate));

    const repaymentAmount: number = this.calculateMonthlyRepaymentPlan(
      amount,
      repaymentDuration,
    );

    const repaymentDueDate: Date = setPaymentDueDateForNonDaily(
      grantedDate,
      repaymentDuration,
    );

    return {
      interest: interest,
      repayment_amount: repaymentAmount,
      repayment_due_date: repaymentDueDate,
      repayment_commencement_date: repaymentCommencementDate,
      amount: amount,
      start_date: grantedDate,
    };
  }

  /**
   * Format the montly loans application process
   */
  protected weeklyLoansFormating(
    dto,
    repaymentCat: LoanRepaymentDurationCategory,
  ): any {
    const amount = dto.amount;

    const grantedDate = fullDateWithoutTime();

    const interest: number = this.calculateInterest(amount, 18);

    const repaymentDuration = this.getRepaymentDurationLoanPlan(repaymentCat);

    const repaymentCommencementDate: Date = setPaymentCommencementDateWekly(new Date(grantedDate));

    const repaymentAmount: number = this.calculateWeeklyRepaymentPlan(
      amount,
      repaymentDuration,
    );

    const repaymentDueDate: Date = setPaymentDueDateForNonDaily(
      grantedDate,
      repaymentDuration,
    );

    return {
      interest: interest,
      repayment_amount: repaymentAmount,
      repayment_due_date: repaymentDueDate,
      repayment_commencement_date: repaymentCommencementDate,
      amount: amount,
      start_date: grantedDate,
    };
  }

  /**
   * Start the loan application process and return any of the loan type
   * @params dto
   */
  protected async processLoans(
    dto,
    loanType: LoanType,
    loanDurationPlan: LoanRepaymentDurationCategory,
  ): Promise<any> {
    const type = loanType.type;
   
    if (type === DaysAndWeekAndMonths.DAILY) {
      return this.dailyLoansFormating(dto);
    } else if (type === DaysAndWeekAndMonths.WEEKLY) {
      return this.weeklyLoansFormating(dto, loanDurationPlan);
    }
    return this.monthlyLoansFormating(dto, loanDurationPlan);
  }

  /**
   * Calculate how many times the payment willbe made
   * @params category
   * @params dto
   */
  protected repaymentCount(loanType: LoanType, repaymentPlan): number {
    let repayment_counts = 0;
    let repaymenDurationtPlan =
      this.getRepaymentDurationLoanPlan(repaymentPlan);
    const type = loanType.type;
    if (type === DaysAndWeekAndMonths.DAILY) {
      repayment_counts = 22; //for daily loans
    } else if (type === DaysAndWeekAndMonths.WEEKLY) {
      repaymenDurationtPlan *= 30; //days
      repayment_counts = Math.floor(repaymenDurationtPlan / 7); //days in a week
    } else if (type === DaysAndWeekAndMonths.MONTHLY) {
      repayment_counts = repaymenDurationtPlan;
    }
    return repayment_counts;
  }

  /**
   * approve a new loan request and returns the details
   * @param dto
   * @param response
   * @returns
   */
  public async approveLoan(
    @Body() dto: ApproveLoanDto,
    @Res() response: Response,
  ): Promise<any> {
    let status = false;
    let statusCode: HttpStatus;
    let message = '';
    let responseData = null;

    const loanData = await this.loanRepo.findOneOrFail({where:{id:dto.loan_id},
       relations:['loan_type','loan_duration_category'],
     })
     
     /**
      * Soft delete the record for feature records keeping
      */
     if(dto.status === ApprovalStatus.decline){
        await this.loanRepo.createQueryBuilder()
              .softDelete()
              .where('reference=:ref',{ref:loanData.reference})
              .execute()
     }

    const loanType = loanData.loan_type
    

    const repaymenDurationtPlan =loanData.loan_duration_category
      
    const {
      repayment_commencement_date,
      repayment_due_date,
      start_date,
    } = await this.processLoans(dto, loanType, repaymenDurationtPlan);
   
    const loan = await this.updateEntity(dto.loan_id, 'id', {
      verification_status: dto.status,
      comment: dto.comment,
       repayment_due_date: repayment_due_date,
      repayment_start_date: repayment_commencement_date,
      issue_date: start_date,
    });

    if (!loan) {
      message = 'Loan does not exists';
      statusCode = HttpStatus.NOT_FOUND;
    } else {
      message = `Loan was/is ${dto.status.split('_').join(' ')}`;
      status = true;
      statusCode = HttpStatus.CREATED;
      responseData = loan;
    }

    return response
      .status(statusCode)
      .send(responseStructure(status, message, responseData, statusCode));
  }

  /**
   * returns n object containing the interest upfront payment status
   * @param dto
   * @param loanAmount
   * @param interest
   * @param repayment_counts
   * @param repaymentAmount
   * @returns
   */
  private checkInterestUpfrontPayment(
    dto: LoanApplicationDto,
    loanAmount,
    interest,
    repayment_counts,
    repaymentAmount,
  ) {
    let repaymentObject = {};

    if (dto.interest_payment_status == InterestPaymentStatus.not_paid_upfront) {
      let totalAmount = parseFloat(loanAmount);
      totalAmount += interest;
      totalAmount /= repayment_counts;
      repaymentAmount = Number(totalAmount).toFixed(2);

      repaymentObject = {
        interest_payment_status: dto.interest_payment_status,
      };
    }
      
    return { object: repaymentObject, amount: repaymentAmount };
  }

/**
 * 
 * @param reference 
 * @param response 
 * @param req 
 * @returns any
 */
  public async deleteLoan(
    reference,
    @Res() response: Response,
     @Req() req: Request,
  ) {
    let status = false;
    let statusCode: HttpStatus;
    let message = 'no data found';
    let responseData = {};
     const user = await this.getUser(req);

    const loanData:Loan = await this.loanRepo.findOneByOrFail({reference, verification_status:ApprovalStatus.pending})

    if(user.is_admin){
    
      await this.loanRepo.createQueryBuilder()
      .softDelete()
      .where('reference=:ref',{ref:loanData.reference})
      .execute()
      
    }else {
      await this.loanRepo.delete(loanData.id)
    }

    if(loanData){
      statusCode = HttpStatus.CREATED;
      status = true;
      message = 'Loan repayment data updated';
      responseData = loanData
    }

    return response
      .status(statusCode)
      .send(responseStructure(status, message, responseData, statusCode));
  }
}
