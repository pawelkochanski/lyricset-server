import { InstanceType } from 'typegoose';
import { UserRole } from '../../user/models/user-role.enum';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/user/models/user.model';

@Injectable()
export class RolesGuard implements CanActivate {
constructor(private readonly _reflector: Reflector){}

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const roles = this._reflector.get<UserRole[]>('roles', context.getHandler());
    if(!roles){
      return false;
    }
    const request = context.switchToHttp().getRequest();
    const user : InstanceType<User> = request.user;
    if (user && roles.includes(user.role)){
      return true;
    }
  }
}
