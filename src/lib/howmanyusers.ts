import { Socket, Presence } from 'phoenix';
import { nanoid } from 'nanoid';
import MurmurHash3 from 'imurmurhash';

type Listener = (onlineNum: number) => void;

interface Config {
  endpointURL?: string;
  listener?: Listener;
}

export class HowManyUsers {
  readonly endpointURL: string = 'wss://ws.howmanyusers.my.id/socket';
  readonly listener?: Listener;
  readonly hashPage: string;
  readonly user: string;
  private socket;
  private channel;

  constructor(readonly page: string, config?: Config) {
    if (config) {
      this.endpointURL = config.endpointURL || this.endpointURL;
      this.listener = config.listener;
    }
    this.hashPage = MurmurHash3(page).result();
    this.user = nanoid(10);
  }

  start() {
    this.socket = new Socket(this.endpointURL, {
      params: { user_id: this.user },
    });

    this.channel = this.socket.channel(`page:${this.hashPage}`, {});
    let presence = new Presence(this.channel);

    this.socket.connect();

    if (this.listener) {
      const listBy = (_id, { metas: [_first, ...rest] }) => {
        const count = rest.length + 1;
        return count;
      };

      presence.onSync(() => {
        const listOnline = presence.list(listBy);
        const onlineNum = listOnline.reduce((a, b) => a + b, 0);
        this.listener(onlineNum);
      });
    }

    this.channel.join();
  }

  stop() {
    this.channel.leave();
    this.socket.disconnect();
  }
}
