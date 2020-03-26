import DateTimeFormat = Intl.DateTimeFormat;

export class ReceiveMessage {
  content: string;
  token: string;
  toChannel: string;
}

export class SendMessage{
  content: string;
  displayname: string;
  date: number;
  avatarId: string;
  userId: string;
}
