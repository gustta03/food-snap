export class Message {
  private constructor(
    public readonly id: string,
    public readonly from: string,
    public readonly to: string,
    public readonly body: string,
    public readonly timestamp: Date,
    public readonly isGroup: boolean,
    public readonly groupId?: string
  ) {}

  static create(
    id: string,
    from: string,
    to: string,
    body: string,
    isGroup: boolean = false,
    groupId?: string
  ): Message {
    return new Message(id, from, to, body, new Date(), isGroup, groupId);
  }

  static fromWhatsApp(
    id: string,
    from: string,
    to: string,
    body: string,
    timestamp: Date,
    isGroup: boolean,
    groupId?: string
  ): Message {
    return new Message(id, from, to, body, timestamp, isGroup, groupId);
  }
}

