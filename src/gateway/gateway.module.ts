import { Module } from '@nestjs/common';
import { ChatGateWay } from './gateway';
import { RoomsModule } from 'src/rooms/rooms.module';
import { MessageModule } from 'src/message/message.module';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { CustomI18nService } from '../common/services/custom-i18n.service';

@Module({
    imports: [RoomsModule, MessageModule,AuthModule],
    controllers: [],
    providers: [ChatGateWay,CustomI18nService],
})
export class GatewayModule { }
