import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { logErrors } from 'src/common/helpers/logging';

import {
  HttpStatus,
  Injectable,
  Res,
} from '@nestjs/common';

import { responseStructure } from '../../../common/helpers/response.structure';

import adminUsers from '../../../storage/data/super_tech_admin.json';
import repaymentPlans from '../../../storage/data/loan.type.json';
import mortgages from '../../../storage/data/mortgages.json';
import { UserRepository } from '../../user/user.repository';
import { Roles } from '../entities/roles.entity';
import {
  LoanRepaymentDurationCategoryRepository,
} from '../repository/loan.repayment.duration.category.repository';
import { RoleRepository } from '../repository/roles.repository';
import { ApprovalStatus } from 'src/modules/entities/common.type';
import { MortgageRepository } from '../repository/Mortgage.repository';
import { LoanRepaymentPlanRepository } from '../repository/LoanRepaymentPlan.repository';

@Injectable()
export class ConfigService {
  constructor(
    private roleRepo: RoleRepository,
    private readonly userRepo: UserRepository,
    private readonly loanCategory: LoanRepaymentDurationCategoryRepository,
    private readonly mortgage: MortgageRepository,
    private readonly repaymentPlan: LoanRepaymentPlanRepository,
  ) {}

  async create(): Promise<any> {
    let error: string;
    let message: string;
    const responseData: object = {};
    let status: boolean;
    try {
      
      const categoryObjects = [];
      
      for (let i = 10; i <= 30; i=i+ 5) {
        categoryObjects.push({
          categoryName: `${i} year${i === 1 ? '' : 's'} Repayment`,
          categoryTag: `${i}year${i === 1 ? '' : 's'}`,
        });
      }
     
      categoryObjects.map((cat) => {
        this.loanCategory.upsert(
          {
            category_name: cat.categoryName,
            category_tagline: cat.categoryTag,
          },
          ['category_tagline'],
        );
        responseData['Category'] = 'Category created';
      });

      await this.createMortgages(responseData)
      await this.createAdminUsersAndAsignRole(responseData)
      await this.createRepaymentPlan(responseData)
      status = true;
      message = 'Config data created';
    } catch (e) {
      logErrors(e);
      error = e.message;
      status = false;
    }
    return responseStructure(status, error ?? message, responseData);
  }

  

  async getRolesByName(role: string): Promise<Roles> {
    return await this.roleRepo.findOneBy({ role });
  }




  /**
   * Create a user that will act an an aadmin during configuration
   * @param responseData
   * @returns
   */
  async createAdminUsersAndAsignRole(responseData): Promise<any> {
    adminUsers.map(async (user) => {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      const users = await this.userRepo.upsert(
        {
          email: user.email,
          password: hashedPassword,
          firstname: user.name,
          is_admin: true,
        },
        ['email'],
      );
    });

    responseData['users'] = 'Admins created';
    return responseData;
  }


  /**
   * Create a user that will act an an aadmin during configuration
   * @param responseData
   * @returns
   */
  async createMortgages(responseData): Promise<any> {
    mortgages.map(async (mortgage) => {
      await this.mortgage.upsert(
        {
          name: mortgage.name,
          price: mortgage.price,
          status: mortgage.status,
          repayment_status: mortgage.repayment_status,
          interest: mortgage.interest
        },
        ['name'],
      );
    });

    responseData['mortgage'] = 'Mortgages created';
    return responseData;
  }

  
  /**
   * Create a user that will act an an aadmin during configuration
   * @param responseData
   * @returns
   */
  async createRepaymentPlan(responseData): Promise<any> {
    repaymentPlans.map(async (repayment) => {
      await this.repaymentPlan.upsert(
        {
          name: repayment.name
        },
        ['name'],
      );
    });

    responseData['plan'] = 'Repayment plan created';
    return responseData;
  }

  

  async getCategoriesById(id) {
    return await this.loanCategory.findOne({ where: { id } });
  }

  async getLoanDependencies(@Res() response: Response) {
    const message = '';
    let responseData: object = {};
    let status: boolean;
    let statusCode: HttpStatus;
    const loanCategoryDuration = await this.loanCategory.find();
    const loan_type = await this.repaymentPlan.find();
    const mortgages = await this.mortgage.find();
    statusCode = HttpStatus.OK;
    responseData = {  loan_duration: loanCategoryDuration,loan_type,mortgages };
    return response
      .status(statusCode)
      .send(responseStructure(status, message, responseData, statusCode));
  }


  async setLoanApprovalTypes(@Res() response: Response) {
    
    const message = '';
    let responseData: object = {};
    let status: boolean;
    let statusCode: HttpStatus;
    
    statusCode = HttpStatus.OK;
    responseData = Object.values( ApprovalStatus) ;
    return response
      .status(statusCode)
      .send(responseStructure(status, message, responseData, statusCode));
  }
}
