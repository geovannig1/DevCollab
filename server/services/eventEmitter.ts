import EventEmitter from 'events';

class GithubEmitter extends EventEmitter {
  commit(data: { nodeId: string }) {
    this.emit('commitEvent', data);
  }

  pull(data: { nodeId: string }) {
    this.emit('pullEvent', data);
  }
}

export const emitter = new GithubEmitter();
