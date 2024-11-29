import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomsSchema } from './schema/rooms.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomsSchema }]),
  ],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
