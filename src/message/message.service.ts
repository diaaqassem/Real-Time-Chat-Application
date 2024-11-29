import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { MessageDto } from 'src/message/dtos/message.dto';
import { Room } from 'src/rooms/schema/rooms.schema';
import { Message } from './schema/message.schema';
import * as crypto from 'crypto';

@Injectable()
export class MessageService {
  private readonly secretKey = Buffer.from(process.env.SECRET_KEY, 'base64'); // This is 32 bytes
  // Replace with a more secure key
  private readonly ivLength = 16; // Initialization vector length

  constructor(
    @InjectModel(Room.name) private rooms: Model<Room>,
    @InjectModel(Message.name) private messages: Model<Message>,
  ) {}

  private encrypt(text: string): string {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv('aes-256-cbc', this.secretKey, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  private decrypt(text: string): string {
    const [ivHex, encryptedText] = text.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = Buffer.from(encryptedText, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.secretKey, iv);
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }

  async addMessage(data: MessageDto) {
    const room = await this.rooms.findById(data.roomID).exec();
    if (!room) throw new BadRequestException({ message: 'Room not found' });
    if (!room.users.includes(data.userID)) {
      throw new BadRequestException({ message: "User isn't in the chat" });
    }

    const encryptedContent = this.encrypt(data.content); // Encrypt the message content
    const newMessage = await this.messages.create({
      user: data.userID,
      room: data.roomID,
      content: encryptedContent,
      createdAt: new Date().toISOString(),
    });

    await newMessage.save();
    await this.rooms.updateOne(
      { _id: data.roomID },
      { $push: { messages: newMessage._id } },
    );

    return { newMessage, content: this.decrypt(newMessage.content) };
  }

  async getMessagesByRoomId(
    roomId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
  ): Promise<Message[]> {
    const room = await this.rooms.findById(roomId).exec();
    if (!room) throw new BadRequestException({ message: 'Room not found' });
    if (!room.users.includes(userId)) {
      throw new BadRequestException({ message: "User isn't in the chat" });
    }

    const messages = await this.messages.find({ room: roomId });

    // Decrypt messages before returning
    return messages.map((message) => ({
      ...message.toObject(),
      content: this.decrypt(message.content), // Decrypt the content
    }));
  }

  async clearAllMessages() {
    return await this.messages.deleteMany({});
  }
}
