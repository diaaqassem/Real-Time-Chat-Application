import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Date } from 'mongoose';

@Schema()
export class Message {
  @Prop({ required: true, trim: true })
  content: string;
  @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
  user: mongoose.Types.ObjectId;
  @Prop({ type: mongoose.Types.ObjectId, ref: 'Rooms' })
  room: mongoose.Types.ObjectId;
  @Prop({ required: true })
  createdAt: String;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
