import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Room } from './schema/rooms.schema';
import mongoose, { Model } from 'mongoose';
import { RoomDto } from './dtos/room.dto';

@Injectable()
export class RoomsService {
  logger: Logger = new Logger('rooms');
  constructor(@InjectModel(Room.name) private rooms: Model<Room>) {
    this.logger.log('Rooms Service is running');
  }
  async addRoom(data: RoomDto): Promise<Room> {
    const createRoom = await this.rooms.create({
      name: data.name,
      // users: [data.user], // -------------frontend
      users: [],
      messages: [],
    });
    return createRoom;
    // return await createRoom.save();
  }

  async findRoom(id: mongoose.Types.ObjectId): Promise<Room> {
    return await this.rooms.findById({ _id: id });
  }

  async joinRoom(
    userID: mongoose.Types.ObjectId,
    roomID: mongoose.Types.ObjectId,
  ) {
    //check on room
    let room = this.findRoom(roomID);
    if (!room) return new NotFoundException('No room found');
    //check if user is already in room
    if ((await room).users.includes(userID)) {
      throw new NotFoundException('User is already in room');
    }

    return await this.rooms.updateOne(
      { _id: roomID },
      { $push: { users: userID } },
    );
  }

  removeUserFromRoom(userId: string, roomId: string) {
    return this.rooms
      .updateOne({ _id: roomId }, { $pull: { users: userId } })
      .exec();
  }

  async getRoomData(id: mongoose.Types.ObjectId) {
    let data = await this.rooms
      .findById(id)
      .populate({
        path: 'users',
        select: 'name email',
      })
      .populate({
        path: 'messages',
        select: 'content',
      });
    return data;
  }

  async leaveRoom(
    roomId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
  ) {
    let room = await this.findRoom(roomId);
    if (!room) throw new NotFoundException('No such room');
    if (!room.users.includes(userId)) {
      throw new NotFoundException('User is not in the room');
    }
    return this.rooms.updateOne(
      { _id: roomId },
      {
        $pull: { users: userId },
      },
    );
  }

  async clearAllRooms() {
    return await this.rooms.deleteMany({});
  }

  async allRoomsUser(userId: string) {
    const rooms = await this.rooms.find({ users: userId }).exec();
    return rooms;
  }
}
