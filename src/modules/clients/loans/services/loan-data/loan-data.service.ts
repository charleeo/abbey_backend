import { Request, Response } from 'express';
import { responseStructure } from 'src/common/helpers/response.structure';
import { HttpStatus, Injectable, Query, Req, Res } from '@nestjs/common';
import { Loan } from '../../entities/loan.entity';
import { LoanRepository } from '../../repositories/loan.repository';
import { BaseDataSource } from 'src/common/helpers/base.data.ource';
import { ApprovalStatus, DaysAndWeekAndMonths, RepaymentStatus } from 'src/modules/entities/common.type';
import { Users } from 'src/modules/user/entities/user.entity';
import { Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { calculatOverdue, getMonthName } from 'src/common/helpers/generals';
import { LoanTypeRepository } from 'src/modules/config/repository/loan.type.repository';

@Injectable()
export class LoanDataService extends BaseDataSource {
  private readonly DAILY: string;
  private readonly MONTHLY: string;
  private readonly WEEKLY: string;

  constructor(private readonly loanRepo: LoanRepository, private readonly loanTypeRepo:LoanTypeRepository) {
    super(loanRepo)
  }

  public async getAloanForAUSer(user, status = null): Promise<Loan> {
    const loanData = await this.loanRepo
      .createQueryBuilder('loan')
      .where('loan.verification_status = :status', {
        status
      })
      .andWhere('loan.customer_id = :customerID', { customerID: user.id })
      .getOne();
    return loanData;
  }

  /**
   * Get all the loans associated to this user and also be able to filter by some conditions
   * @param user 
   * @param status 
   * @returns 
   */
  public async getAllloanForAUSer(user, param): Promise<any> {
    
    const qb =  this.loanRepo
    .createQueryBuilder('loan')
    .leftJoinAndSelect('loan.loan_duration_category', 'loan_repayment_duration_categoriess')
    .leftJoinAndSelect('loan.loan_type', 'loan_types')
    .leftJoinAndSelect('loan.repayments', 'repayments', 'repayments.confirmation_status = :status', { status: RepaymentStatus.pending })
    .orderBy("loan.created_at", 'DESC')
    
    if(!user.is_admin){
      qb.where('loan.customer_id = :customerID', { customerID: user.id });
    }

    if (param.status !== undefined && param.status !== null && param?.status.length ) {
      const status = param.status
      qb.andWhere('loan.verification_status = :loanStatus', {
        loanStatus:status
      });
    }

    if (param.from_amount !== undefined && param.from_amount !== null && param?.from_amount > 0 ) {
      const amount = param.from_amount
      qb.andWhere('loan.amount >= :from_amount', {
       from_amount: amount
      });
    }

    if (param.to_amount !== undefined && param.to_amount !== null && param?.to_amount > 0 ) {
      const amount = param.to_amount
      qb.andWhere('loan.amount <= :to_amount', {
       to_amount: amount
      });
    }
    return qb;
  }

  public async userLoans(user: any, @Res() res: Response, @Query() query: any,@Req() req: Request): Promise<any> {
   
    let status = false;
    let message = '';
    let responseData: object = null;
    let statusCode: HttpStatus;
   
    const loanData = await this.findPaginatedData<Loan>({
      repository:this.loanRepo,
      req,
      route:'loan-data/user/loans',
      query,
      relations:['repayments','loan_type','loan_duration_category'],
      condition:  this.queryConditions(user,query),
      order:{created_at:'desc'}
    })
   
    if (loanData?.items?.length) {
      statusCode = HttpStatus.OK;
      status = true;
      responseData = loanData;
      message ="Loan data fetched"
    } else statusCode = HttpStatus.NO_CONTENT;
    return res
      .status(statusCode)
      .send(responseStructure(status, message, responseData, statusCode));
  }

/**
 * Prepare a condition to be used for the query
 * @param user 
 * @param param 
 * @returns 
 */
  protected queryConditions(user:Users,param:any){
    let condition : any ={}
     if(!user.is_admin){
      condition.customer_id = user.id
    }

    if (param.status !== undefined && param.status !== null && param?.status.length ) {
      const status = param.status
      condition.verification_status = status
    }

   if (param.from_amount !== undefined && param.from_amount !== null && param?.from_amount > 0) {
        const amount = param.from_amount;
        condition.amount = MoreThanOrEqual(amount); // Use standard SQL comparison
    }

    if (param.to_amount !== undefined && param.to_amount !== null && param?.to_amount > 0) {
        const amount = param.to_amount;
        condition.amount = LessThanOrEqual(amount); // Use standard SQL comparison
    }
   
    return condition
  }

  protected dashboardCondition(user:Users, year:number = new Date().getFullYear())
  {
    const yearStart = new Date(year, 0, 1); // January 1st of the specified year
    const yearEnd = new Date(year, 11, 31, 23, 59, 59); // December 31st of the specified year

    let condition : any = {}
    condition.verification_status = ApprovalStatus.verified
    condition.issue_date = Between(yearStart, yearEnd)

     if(!user.is_admin){
      condition.customer_id = user.id
    }
    return condition
  }

/**
 * 
 * @param user 
 * @param res 
 * @param query 
 * @param req 
 * @returns Promise
 */
   public async dashboardData(user: any, @Res() res: Response, @Query() query: any): Promise<any> {
    let status = false;
    let message = '';
    let responseData: any = null;
    let statusCode: HttpStatus;
    const year = query.year
    let qb =  this.loanRepo.createQueryBuilder('loan')
     .leftJoinAndSelect('loan.loan_type', 'loan_type')
     .where('loan.verification_status=:status',{status: ApprovalStatus.verified})
    . andWhere('EXTRACT(YEAR FROM loan.issue_date) = :year', { year })

    if(!user.is_admin){
      qb.andWhere('loan.customer_id=:userId',{userId:user.id})
    }
    const approvedOverdue = await qb.getMany()

    let overDue = 0;
    approvedOverdue.map( async(loan:Loan) => {

     overDue += parseFloat(
      calculatOverdue({
        loanType: loan.loan_type.type,
        repaymentStartDate: loan.repayment_start_date,
        repaymentRate: loan.repayment_rate,
        totalPaid:loan.repayment_sum
      })
      )
      
    })

    statusCode = HttpStatus.OK;
    status = true;
    responseData = {
      pending : (await this.createQueryBuilder(user,ApprovalStatus.pending, year).getCount()),
      approved : (await this.createQueryBuilder(user,ApprovalStatus.verified, year).getCount()),
      reviewed : (await this.createQueryBuilder(user,ApprovalStatus.reviewed, year).getCount()),
      declined : (await this.createQueryBuilder(user,ApprovalStatus.decline, year).getCount()),
      sumOfApproved : (await this.createSumOfData(user,ApprovalStatus.verified, year).getRawOne()),
      sumOfDeclined : (await this.createSumOfData(user,ApprovalStatus.decline, year).getRawOne()),
      overDue: overDue
    };
    message ="Dashboard data fetched"
    return res
      .status(statusCode)
      .send(responseStructure(status, message, responseData, statusCode));
  }


/**
 * 
 * @param user 
 * @param res 
 * @param query 
 * @param req 
 * @returns Promise
 */
   public async chartsData(user: any, @Res() res: Response,@Query() query: any): Promise<any> {
   
    let message = '';
    let responseData: any = {};
    let statusCode: HttpStatus;
    const year:number = query.year
    statusCode = HttpStatus.OK;
    const  status = true;
    const sumOfData  = await this.getData(ApprovalStatus.verified, year, user)

    const dailyLoanType = await this.loanTypeRepo.findOne({where:{type: DaysAndWeekAndMonths.DAILY}})

    const weeklyLoanType = await this.loanTypeRepo.findOne({where:{type: DaysAndWeekAndMonths.WEEKLY}})

    const monthlyLoanType = await this.loanTypeRepo.findOne({where:{type: DaysAndWeekAndMonths.MONTHLY}})

    const yearlyLoanType = await this.loanTypeRepo.findOne({where:{type: DaysAndWeekAndMonths.YEARLY}})

    const dailyLoanCounts = await this.getCountForLoanTypes(user, dailyLoanType.id,year).getCount()

    const weeklyLoanCounts = await this.getCountForLoanTypes(user, weeklyLoanType.id, year ).getCount()
    const monthlyLoanCounts = await this.getCountForLoanTypes(user, monthlyLoanType.id, year ).getCount()
    const yearlyLoanCounts = await this.getCountForLoanTypes(user, yearlyLoanType.id,year ).getCount()
    const countArrays = [dailyLoanCounts, weeklyLoanCounts, monthlyLoanCounts, yearlyLoanCounts]

    responseData.approved = sumOfData.approved
    responseData.repaid = sumOfData.totalRepaid
    responseData.countArray = countArrays
   
    return res
      .status(statusCode)
      .send(responseStructure(status, message, responseData, statusCode));
  }

  /**
   * Extract data for each month of a given year
   * @param status 
   * @param year 
   */
  public async getData(status: string, year: number = new Date().getFullYear(), user: Users): Promise<any> {
    let qb =  this.loanRepo.createQueryBuilder('loan')
    .select('EXTRACT(MONTH FROM loan.issue_date) as month')
    .addSelect('COALESCE(SUM(loan.expected_repayment_amount), 0)', 'sumAmount', ) // COALESCE handles NULL sums and returns 0 instead
    .addSelect('COALESCE(SUM(loan.repayment_sum), 0)', 'repaymentSum') // COALESCE handles NULL sums and returns 0 instead
    .where('loan.verification_status = :status', { status })
    .andWhere('EXTRACT(YEAR FROM loan.issue_date) = :year', { year })
    
    if(!user.is_admin){
        qb.andWhere('loan.customer_id = :userId', { userId: user.id }) 
    }
    
   const result =  await qb.groupBy('month')
                  .orderBy('month') // Ensure the months are in order
                  .getRawMany();
    const approved: { [key: string]: number } = {};
    const totalRepaid: { [key: string]: number } = {};
   
    for (let i = 1; i <= 12; i++) {
      const monthData = result.find(item => parseInt(item.month) === i);
      approved[getMonthName(i)] = monthData ? parseFloat(monthData.sumAmount) : 0;
      totalRepaid[getMonthName(i)] = monthData ? parseFloat(monthData.repaymentSum) : 0;
    }

    return {approved, totalRepaid};
  }

  /**
   * 
   * @param user 
   * @param status 
   * @returns 
   */
  protected createQueryBuilder(user?:Users, status?:any, year:number = new Date().getFullYear())
  {
    let qb =  this.loanRepo.createQueryBuilder('loan')
    .where('loan.verification_status=:status',{status})
    .andWhere('EXTRACT(YEAR FROM loan.issue_date) = :year', { year })
   
    if(!user.is_admin){
      qb .andWhere('loan.customer_id = :userId', { userId: user.id }) 
    }
    return qb
  }


  /**
   * 
   * @param user 
   * @param status 
   * @returns 
   */
  protected getCountForLoanTypes(user?:Users,  loanType?:number, year:number = new Date().getFullYear())
  {
    let qb =  this.loanRepo.createQueryBuilder('loan')
    .where('loan.verification_status=:status',{status:ApprovalStatus.verified})
    .andWhere('loan.loan_type=:loanType',{loanType})
    .andWhere('EXTRACT(YEAR FROM loan.issue_date) = :year', { year })

    if(!user.is_admin){
      qb .andWhere('loan.customer_id = :userId', { userId: user.id }) 
    }
    return qb
  }


  /**
   * 
   * @param user 
   * @param status 
   * @returns 
   */
  protected  createSumOfData(user?:Users, status?:any,year:number = new Date().getFullYear())
  {
    let sumQb =null
    if(status && status === ApprovalStatus.decline){
    sumQb =  this.loanRepo.createQueryBuilder('loan')
    .withDeleted()
    .where('loan.verification_status=:status',{status})
    .andWhere('EXTRACT(YEAR FROM loan.issue_date) = :year', { year })
    .select('SUM(amount)','amount')
    }else{

    sumQb =  this.loanRepo.createQueryBuilder('loan')
    .where('loan.verification_status=:status',{status})
    .andWhere('EXTRACT(YEAR FROM loan.issue_date) = :year', { year })
    .select('SUM(amount)','amount')
    .addSelect('SUM(repayment_sum)','repayment_sum')
    .addSelect('SUM(expected_repayment_amount)','expected_repayment_amount')
    }

    if(!user.is_admin){
      sumQb .andWhere('loan.customer_id = :userId', { userId: user.id }) 
    }

    return sumQb
  }
}


