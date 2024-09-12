import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

//El gateway es como el controlador del websocket

@WebSocketGateway({//Es para definir una clase como gateway o purta y le damos autorizacion a los que entran respecto del origen.
  cors: {
    origin: '*', // Permite peticiones desde cualquier origen
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;//El servidor con el web socket

  private users: number = 0;

  afterInit(server: Server) {
    console.log('WebSocket initialized');
  }

  handleConnection(client: Socket) {//evento de conexion
    this.users++;
    this.server.emit('users', this.users);//se genera el evento para todos los conectados (eventName,data)
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {//evento de desconexion
    this.users--;
    this.server.emit('users', this.users);
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('messageServer')//El nombre del evento es 'message'
  handleMessage(@MessageBody() message: string, @ConnectedSocket() client: Socket): void {
    this.server.emit('messageClient', { user: client.id, message});
  }

  @SubscribeMessage('example')//Primera practica
  handleEjemplo(@MessageBody() data:string){
    this.server.emit('eventoMensaje',data)//1° nombre del evento, 2° envio la información
    this.server.emit('hola',data+1);
  }

  @SubscribeMessage('json')
  handleEjemplo2(@MessageBody() data:any,@ConnectedSocket() client:Socket){
    this.server.emit('eventoMensaje',data,'metodo n°2')
    client.broadcast.emit('eventoMensaje',data,' Todos recibieron este mensaje menos el que lo manda')
    console.log('Hola mundo')
  }

}
//@MessageBody(): extrae el mensaje de la solicitud

//@ConnectedSocket(): Injecta el socket del cliente al socket del metodo
