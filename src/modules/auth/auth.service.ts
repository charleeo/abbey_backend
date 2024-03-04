import * as bcrypt from 'bcrypt';
import { instanceToPlain } from 'class-transformer';
import { responseStructure } from 'src/common/helpers/response.structure';

import {
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Users } from '../user/entities/user.entity';
import { UserService } from '../user/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  /**
   * Check if the email provided matches any record in the database
   *
   * */
  async validateUser(username: string, pass: string) {
    // find if user exist with this email
    let userData = await this.userService.findOneWithRoles(username);
    const user = await this.userService.findOneByEmail(username);

    if (!user) {
      return null;
    }

    // find if user password match
    const match = await this.comparePassword(pass, user.password);
    if (!match) {
      return null;
    }

    userData = instanceToPlain(userData);
    
    const { password, ...result } = user;
    return result;
  }

  public async login(req, res) {
    let status: boolean =false;
    let message = '';
    let code = 200;
    let responseData = null;
    const remember = req.remember
    const user = await this.userService.findOneByEmail(req.email);
    const { token } = await this.generateToken(
      instanceToPlain(user), remember
    );
    if (token) {
      status = true;
      message = 'Login successful';
      code = 200;
    }

    delete user['password'];
    delete user['created_at'];
    delete user['updated_at'];

    responseData = user;
    responseData.token = token;
    return res
      .status(HttpStatus.OK)
      .send(responseStructure(status, message, responseData, HttpStatus.OK));
  }


  public async createUser(user, res) {
    let status = false;
    let error = null;
    let message = '';
    let responseData = null;

    try {
      const password = await this.hashPassword(user.password);

      const newUser = await this.userService.create({ ...user, password });

      delete newUser['password'];

      if (newUser) {
        status = true;
        message = 'User created';
      }
      responseData = newUser;
    } catch (e) {
      error = e.message;
    }
    return res
      .status(HttpStatus.CREATED)
      .send(
        responseStructure(status, message, responseData, HttpStatus.CREATED),
      );
  }

  private async generateToken(user,remember?) {
    const exp:any = process.env.TOKEN_EXPIRATION

     const token = remember?  this.jwtService.sign(user,{expiresIn:exp})
     :
     await this.jwtService.sign(user)
     
    
    return { token };
  }

  public async verifyToken(token) {
    const valid = await this.jwtService.verify(token);
    return valid;
  }

  private async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  private async comparePassword(enteredPassword, dbPassword) {
    return await bcrypt.compare(enteredPassword, dbPassword);
  }
}
