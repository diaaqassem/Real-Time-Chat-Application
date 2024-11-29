import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Room {
  @Prop({ required: true, trim: true })
  name: string;
  @Prop({
    type: mongoose.Types.ObjectId,
    required: [true, 'ID must be provided'],
    ref: 'User',
  })
  users: mongoose.Types.ObjectId[];

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Message', required: true })
  messages: mongoose.Types.ObjectId[];
  _id: any;
}

export const RoomsSchema = SchemaFactory.createForClass(Room);
