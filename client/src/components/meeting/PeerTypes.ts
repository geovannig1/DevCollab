import Peer from 'simple-peer';

export interface IPeers {
  peerId: string;
  peer: Peer.Instance;
}
