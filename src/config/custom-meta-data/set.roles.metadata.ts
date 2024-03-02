import { SetMetadata } from '@nestjs/common';
import { ActionEnums } from 'src/storage/data/action.enums';

export const RoleActions = (actions) => SetMetadata('actions', actions)