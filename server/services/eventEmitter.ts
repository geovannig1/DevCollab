import EventEmitter from 'events';

class GithubEmitter extends EventEmitter {
  commit(data: { nodeId: string }) {
    this.emit('commitEvent', data);
  }

  pull() {
    this.emit('pullEvent', 'test pull');
  }
}

export const emitter = new GithubEmitter();
