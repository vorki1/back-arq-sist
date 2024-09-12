import { Module } from '@nestjs/common';
import { ChatGateway } from './chat/chat.gateway';

@Module({
  providers: [ChatGateway]//aqui van los controlers??
})
export class ChatModule {}
