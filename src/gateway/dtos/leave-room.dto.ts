import { PartialType } from '@nestjs/mapped-types';
import { JoinRoomDto } from './join-room.dto';

export class LeaveRoomDto extends PartialType(JoinRoomDto) {}
