import * as bcrypt from 'bcrypt';
import { instanceToPlain } from 'class-transformer';
import { Response } from 'express';
import { logErrors } from 'src/common/helpers/logging';

import {
  HttpStatus,
  Injectable,
  Res,
} from '@nestjs/common';

import { responseStructure } from '../../../common/helpers/response.structure';
import {
  ADMINROLES,
  ALLDUTIES,
  NOACTIONASSIGNED,
  NOTASSIGNED,
} from '../../../config/constants';
import actions from '../../../storage/data/actions.json';
import duties from '../../../storage/data/duties.json';
import loanTypes from '../../../storage/data/loan.types.json';
import locations from '../../../storage/data/locations.json';
import roles from '../../../storage/data/roles.json';
import adminUsers from '../../../storage/data/super_tech_admin.json';
import { UserRepository } from '../../user/user.repository';
import { Duties } from '../entities/duties.entity';
import { Roles } from '../entities/roles.entity';
import { UserRoles } from '../entities/user.role.entity';
import { ActionRepository } from '../repository/actions.repository';
import { DutyRepository } from '../repository/duties.repository';
import {
  LoanRepaymentDurationCategoryRepository,
} from '../repository/loan.repayment.duration.category.repository';
import { LoanTypeRepository } from '../repository/loan.type.repository';
import { LocationRepository } from '../repository/locations.repository';
import { RoleRepository } from '../repository/roles.repository';
import { UserRoleRepository } from '../repository/user_roles.repository';
import { ApprovalStatus } from 'src/modules/entities/common.type';

@Injectable()
export class ConfigService {
  constructor(
    private roleRepo: RoleRepository,
    private actionRepo: ActionRepository,
    private dutyRepo: DutyRepository,
    private readonly userRoleRepo: UserRoleRepository,
    private readonly locationRepo: LocationRepository,
    private readonly userRepo: UserRepository,
    private readonly loanCategory: LoanRepaymentDurationCategoryRepository,
    private readonly loanType: LoanTypeRepository,
  ) {}

  async create(): Promise<any> {
    let error: string;
    let message: string;
    const responseData: object = {};
    let status: boolean;
    try {
      roles.map(async (role) => {
        responseData['roles'] = 'Roles created';
        await this.roleRepo.upsert(
          { role_name: role.role_name, role: role.role },
          ['role'],
        );
      });

      actions.map((action) => {
        this.actionRepo.upsert(
          { tag_line: action.tag_line, actions: action.action },
          ['tag_line'],
        );
        responseData['actions'] = 'Actions created';
      });

      loanTypes.map((type) => {
        this.loanType.upsert(
          {
            type: type.type,
            description: type.description,
            status: type.status,
          },
          ['type'],
        );
        responseData['loan_types'] = 'Loan Types created';
      });

      locations.map((location) => {
        this.locationRepo.upsert({ locationName: location.name }, [
          'locationName',
        ]);
        responseData['locations'] = 'Locations created';
      });

      //constructing the loan category object instead of manually creating it
      const categoryObjects = [];

      for (let i = 1; i < 13; i++) {
        categoryObjects.push({
          categoryName: `${i} Month${i === 1 ? '' : 's'} Repayment`,
          categoryTag: `${i}_month${i === 1 ? '' : 's'}`,
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

      duties.map((duty) => {
        this.dutyRepo.upsert({ name: duty.name }, ['name']);
        responseData['duties'] = 'Duties created';
      });

      await this.createAdminUsersAndAsignRole(responseData);
      status = true;
      message = 'Config data created';
    } catch (e) {
      logErrors(e);
      error = e.message;
      status = false;
    }
    return responseStructure(status, error ?? message, responseData);
  }

  async assignRoleToUser(userRole): Promise<UserRoles> {
    let error: any = null;
    let status = false;
    let message = '';
    const responseData: any = null;

    try {
      const userId: number = userRole.userId;
      const roleId: number = userRole.roleId;
      const dutyId: number = userRole.dutyId;
      const actionIds: string[] = userRole.actions;
      if (!(await this.userRepo.findOneBy({ id: userId }))) {
        message = 'provided userId is invalid';
        return responseStructure(status, error ?? message, responseData);
      }
      const selectedRole: Roles = await this.roleRepo.findOneBy({ id: roleId });

      const {
        duty,
        status: assignmentStatus,
        actions,
      } = await this.formatRole(selectedRole, dutyId, actionIds);
      const actionId: string = actions.join(',');
      const data = {
        user: userId,
        roleId,
        dutyId: duty,
        actions: actionId,
        status: assignmentStatus,
      };
      this.userRoleRepo.upsert(data, ['user']);
    } catch (e) {
      error = e.message;
    }
    if (!error) message = 'roles assigned';
    status = true;
    return responseStructure(status, error ?? message, responseData);
  }

  async getRolesByName(role: string): Promise<Roles> {
    return await this.roleRepo.findOneBy({ role });
  }

  /**
   *
   * @param name
   * @returns
   */
  async getDutiessByName(name: string): Promise<Duties> {
    return await this.dutyRepo.findOneBy({ name });
  }

  /**
   *
   * @returns
   */
  async getAllActions(): Promise<any[]> {
    const actions = await this.actionRepo.find();
    const actionIds: number[] = [];
    actions.map((action) => {
      actionIds.push(action.id);
    });
    return actionIds;
  }

  /**
   *
   * @param selectedRole
   * @param dutyId
   * @param actionIds
   * @returns
   */
  async formatRole(selectedRole: Roles, dutyId: number, actionIds: any) {
    let assignmentStatus = 1;

    if (ADMINROLES.includes(selectedRole.role)) {
      dutyId = (await this.dutyRepo.findOneBy({ name: ALLDUTIES })).id;
      const actions = await this.actionRepo.find({ select: ['id'] });
      const actionsArray = [];
      actions.map((a) => actionsArray.push(a.id));
      actionIds = actionsArray;
    } else {
      const noDuty = await this.dutyRepo.findOneBy({ id: dutyId });
      actionIds = Array.from(new Set(actionIds)); //only non repeating items
      if (noDuty.name == NOTASSIGNED) {
        actionIds = [
          (await this.actionRepo.findOneBy({ tag_line: NOACTIONASSIGNED })).id,
        ];
        assignmentStatus = 0;
      }
    }
    return { duty: dutyId, status: assignmentStatus, actions: actionIds };
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
      this.assignRolesDynamically(users.raw[0]);
    });
    responseData['users'] = 'Admins created';
    return responseData;
  }

  /**
   * Assign  role to admin users from the configuration settings
   * @param user
   */
  async assignRolesDynamically(user): Promise<void> {
    const all_duties_object = await this.getDutiessByName(ALLDUTIES);
    const all_duties = instanceToPlain(all_duties_object);
    const superAdminRole: Roles = await this.getRolesByName(
      ADMINROLES['super_admin'],
    );
    const actions: number[] = await this.getAllActions();
    user['userId'] = user.id;
    user['roleId'] = superAdminRole.id;
    user['dutyId'] = all_duties.id;
    user['actions'] = actions;
    await this.assignRoleToUser(user);
  }

  async getCategoriesById(id) {
    return await this.loanCategory.findOne({ where: { id } });
  }

  async getLoanDependencies(@Res() response: Response) {
    let error: string;
    const message = '';
    let responseData: object = {};
    let status: boolean;
    let statusCode: HttpStatus;
    const loanType = await this.loanType.find();
    const loanCategoryDuration = await this.loanCategory.find();
    statusCode = HttpStatus.OK;
    responseData = { loan_type: loanType, loan_duration: loanCategoryDuration };
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
