import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../../shared/models/user.model';

@Pipe({ name: 'roleFilter' })
export class RoleFilterPipe implements PipeTransform {
  transform(users: User[], role: string): User[] {
    return users.filter(u => u.role === role);
  }
}
