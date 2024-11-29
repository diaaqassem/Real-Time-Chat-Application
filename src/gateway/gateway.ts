import {
  HttpException,
  HttpStatus,
  Inject,
  OnModuleInit,
  OnApplicationShutdown,
} from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateRoomDto } from './dtos/create-room.dto';
import { RoomsService } from 'src/rooms/rooms.service';
import { JoinRoomDto } from './dtos/join-room.dto';
import { instrument } from '@socket.io/admin-ui';
import { MessageDto } from '../message/dtos/message.dto';
import { MessageService } from 'src/message/message.service';
import mongoose, { ObjectId } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { GetMessagesDto } from './dtos/get-messsages.dto';
import { LeaveRoomDto } from './dtos/leave-room.dto';
import { CustomI18nService } from 'src/common/services/custom-i18n.service';

@WebSocketGateway(5001, {
  cors: {
    origin: 'https://admin.socket.io',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class ChatGateWay
  implements
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnModuleInit,
    OnApplicationShutdown
{
  constructor(
    private roomService: RoomsService,
    private messageService: MessageService,
    private authService: AuthService,
    @Inject(CustomI18nService) private customI18nService: CustomI18nService,
  ) {}

  @WebSocketServer()
  private readonly server: Server;

  //create room
  // private readonly rooms: RoomDto[] = [];

  handleConnection(client: Socket, ...args: any[]) {
    // console.log('Client connected', client.id);
  }

  handleDisconnect(client: Socket) {
    // console.log('Client disconnected', client.id);
    this.removeFromAllRooms(client.data);
  }

  async removeFromAllRooms(clientId) {
    try {
      const rooms = await this.roomService.allRoomsUser(clientId);
      for (const room of rooms) {
        room.users = room.users.filter(
          (userId) => userId.toString() !== clientId,
        );
        if (room.users.length === 0) {
          await room.deleteOne();
        } else {
          await room.save();
        }
        //---------------------frontend comments--------------------
        // this.server.to(room._id.toString()).emit('user_left', {
        //   message: this.customI18nService.translate('gateway.LEAVE_ROOM'),
        //   roomId: room._id,
        //   userId: clientId,
        // });
        //-------------------------------------------------------
        //--------------frontend code--------------------
        this.server.to(room._id.toString()).emit('user_left', {
          message: this.customI18nService.translate('gateway.LEAVE_ROOM'),
          roomID: room._id,
          userID: clientId,
        });
        //-------------------------------------------------------
      }
    } catch (error) {
      console.error(`Error removing client ${clientId} from rooms:`, error);
    }
  }

  async clearAllRoomsAndMessages() {
    try {
      await this.messageService.clearAllMessages();
      await this.roomService.clearAllRooms();
      console.log('All rooms and messages have been cleared.');
      this.server.emit('roomsCleared');
    } catch (error) {
      console.error('Error clearing rooms and messages:', error);
    }
  }

  async onModuleInit() {
    //method is used to enable the Socket.IO admin panel for the gateway.
    instrument(this.server, {
      auth: false,
      mode: 'development',
    });
    await this.clearAllRoomsAndMessages();
  }

  async onApplicationShutdown(signal?: string) {
    await this.clearAllRoomsAndMessages();
  }

  async notFoundUser(client, data) {
    const user = await this.authService.findUser(data.userID);
    if (!user) {
      console.log('err78');
      return this.server
        .to(client.id)
        .emit(
          'invalid',
          this.customI18nService.translate('gateway.USER_ERROR'),
        );
    }
  }

  @SubscribeMessage('Create_Room')
  async createRoom(client: Socket, data: CreateRoomDto) {
    // console.log("data message : ", data);
    // console.log("data id : ", data.user);
    if (!data.userID || !mongoose.isValidObjectId(data.userID) || !data.name) {
      console.log('err');

      return this.server
        .to(client.id)
        .emit(
          'invalid',
          this.customI18nService.translate('gateway.USER_ERROR'),
        );
    }

    try {
      const user = await this.authService.findUser(data.userID);
      if (!user) {
        console.log('err78');
        return this.server
          .to(client.id)
          .emit(
            'invalid',
            this.customI18nService.translate('gateway.USER_ERROR'),
          );
      }
      await this.removeFromAllRooms(data.userID); // for frontend-----------
      const room = await this.roomService.addRoom({
        name: data.name,
        user: data.userID,
      });
      client.data = data.userID;
      console.log(room._id.toString());

      const joinRoom = await this.customI18nService.translate(
        'gateway.CREATE_ROOM',
      );
      //----------------------frontend------------------------ room._id
      this.server
        .to(client.id)
        .emit('joined_room', `${joinRoom}: ${(room.name, room._id)}`); ///////
      // join id(from client.id specific server) in server
      this.server.to(client.id).socketsJoin(room._id.toString());
      // ---------frontend

      await this.roomService.joinRoom(data.userID, room._id.toString());
      // this.server.to(client.id).socketsJoin(data.roomID.toString());
      // console.log(room._id.toString());
      return room;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @SubscribeMessage('Join_Room')
  async joinRoom(client: Socket, data: JoinRoomDto) {
    if (
      !data.userID ||
      !mongoose.isValidObjectId(data.userID) ||
      !data.roomID ||
      !mongoose.isValidObjectId(data.roomID)
    ) {
      return this.server
        .to(client.id)
        .emit(
          'invalid',
          this.customI18nService.translate('gateway.USER_ERROR'),
        );
    }

    try {
      this.notFoundUser(client, data);
      const room = await this.roomService.findRoom(data.roomID);
      if ((await room).users.includes(data.userID)) {
        return this.server.to(client.id).emit('joined_failed', {
          message: this.customI18nService.translate('gateway.USER_EXIT_ROOM'),
        });
      }
      await this.roomService.joinRoom(data.userID, data.roomID);
      client.data = data.userID;

      this.server.to(client.id).emit('joined_room', {
        message: `${this.customI18nService.translate('gateway.JOIN_ROOM')} `,
      });
      // ----------------------frontend comments --------------------
      // this.server.to(data.roomID.toString()).emit('receive_message', {
      //   message: `${this.customI18nService.translate('gateway.JOIN_ROOM')} : ${data.userID} `,
      //   userID: data.userID,
      //   roomID: data.roomID,
      // });
      //----------------------------
      //---------------------frontend code------------------------
      this.server
        .to(data.roomID.toString())
        .emit(
          'joined_room',
          `${this.customI18nService.translate('gateway.JOIN_ROOM')} : ${data.userID} `,
        );
      //----------------------------
      this.server.to(client.id).socketsJoin(data.roomID.toString());
    } catch (error) {
      return this.server.to(client.id).emit('joined_failed', {
        message: this.customI18nService.translate('gateway.JOIN_FAILED'),
      });
    }
  }

  //send message

  @SubscribeMessage('Send_Message')
  async sendMessage(client: Socket, data: MessageDto) {
    if (
      !data.content ||
      !data.roomID ||
      !data.userID ||
      !mongoose.isValidObjectId(data.userID) ||
      !mongoose.isValidObjectId(data.roomID)
    ) {
      return this.server
        .to(client.id)
        .emit(
          'invalid',
          this.customI18nService.translate('gateway.USER_ROOM_ERROR'),
        );
    }

    try {
      const result = await this.messageService.addMessage(data);
      const roomData = await this.roomService.getRoomData(data.roomID);
      this.server.to(data.roomID.toString()).emit('receive_message', {
        message: this.customI18nService.translate('gateway.ARRIVE_MESSAGE'),
        messageData: result.content,
        roomData,
        userID: data.userID,
        roomID: data.roomID,
      });

      // console.log(roomData);
      // console.log('result: ', result);
    } catch (error) {
      console.log(error);
      return this.server.to(client.id).emit('joined_failed', {
        message: this.customI18nService.translate('gateway.JOIN_FAILED'),
      });
    }
  }

  @SubscribeMessage('Get_Messages')
  async getMessages(client: Socket, data: GetMessagesDto) {
    if (!data.roomID || !mongoose.isValidObjectId(data.roomID)) {
      return this.server.to(client.id).emit('invalid', {
        err: 'invalid room ID !',
      });
    }
    try {
      this.notFoundUser(client, data);
      const messages = await this.messageService.getMessagesByRoomId(
        data.roomID,
        data.userID,
      );
      this.server.to(client.id).emit('messages', {
        message: this.customI18nService.translate('gateway.ARRIVE_MESSAGE'),
        messages,
      });
      console.log(messages);
    } catch (error) {
      return this.server.to(client.id).emit('joined_failed', {
        message: this.customI18nService.translate('gateway.JOIN_FAILED'),
      });
    }
  }

  @SubscribeMessage('Leave_Room')
  async leaveRoom(client: Socket, data: LeaveRoomDto) {
    if (!data.roomID || !mongoose.isValidObjectId(data.roomID)) {
      return this.server.to(client.id).emit('invalid', {
        err: this.customI18nService.translate('gateway.CREATE_ROOM'),
      });
    }
    try {
      const roomData = await this.roomService.getRoomData(data.roomID);
      // -------------------------frontend comments --------------------
      // this.server.to(data.roomID.toString()).emit('user_left', {
      //   message: this.customI18nService.translate('gateway.LEAVE_ROOM'),
      //   roomData: roomData,
      //   userLeaved: data.userID,
      // });
      // await this.roomService.leaveRoom(data.roomID, data.userID);
      // this.server.to(client.id).socketsLeave(roomData._id.toString());
      // this.server.to(client.id).emit('user_left', {
      //   message: this.customI18nService.translate('gateway.LEAVE_ROOM'),
      //   roomID: data.roomID,
      //   userID: data.userID,
      // });
      // -------------------------frontend code --------------------
      await this.roomService.leaveRoom(data.roomID, data.userID);
      this.server.to(client.id).socketsLeave(roomData._id.toString());
      this.server.to(data.roomID.toString()).emit('user_left', {
        message: this.customI18nService.translate('gateway.LEAVE_ROOM'),
        roomID: data.roomID,
        userID: data.userID,
      });
      this.server.to(client.id).emit('user_left', {
        message: this.customI18nService.translate('gateway.LEAVE_ROOM'),
        roomID: data.roomID,
        userID: data.userID,
      });
      // ---------------------------------------------------
    } catch (error) {
      console.log(error);
      return this.server
        .to(client.id)
        .emit('joined_failed', { message: 'Could not leave' });
    }
  }
}
