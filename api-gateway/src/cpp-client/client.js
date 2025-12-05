import net from 'net';
import { EventEmitter } from 'events';
import protobuf from 'protobufjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let protobufRoot = null;
let BidRequest = null;
let BidResponse = null;

// Load protobuf definitions
async function loadProtobuf() {
  if (!protobufRoot) {
    const protoPath = join(__dirname, '../../proto/bid.proto');
    protobufRoot = await protobuf.load(protoPath);
    BidRequest = protobufRoot.lookupType('bidding.BidRequest');
    BidResponse = protobufRoot.lookupType('bidding.BidResponse');
  }
}

class CppClient extends EventEmitter {
  constructor(host, port) {
    super();
    this.host = host;
    this.port = port;
    this.socket = null;
    this.connected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.reconnectDelay = 1000;
  }

  async connect() {
    await loadProtobuf();
    
    return new Promise((resolve, reject) => {
      this.socket = new net.Socket();
      
      this.socket.on('connect', () => {
        this.connected = true;
        this.reconnectAttempts = 0;
        this.emit('connected');
        resolve();
      });

      this.socket.on('error', (error) => {
        this.connected = false;
        this.emit('error', error);
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        } else {
          reject(error);
        }
      });

      this.socket.on('close', () => {
        this.connected = false;
        this.emit('disconnected');
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        }
      });

      this.socket.on('data', (data) => {
        this.handleResponse(data);
      });

      this.socket.connect(this.port, this.host);
    });
  }

  scheduleReconnect() {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    setTimeout(() => {
      this.connect().catch(console.error);
    }, delay);
  }

  handleResponse(data) {
    if (data.length < 4) return;
    
    const messageLength = data.readUInt32BE(0);
    if (data.length < 4 + messageLength) return;
    
    const messageData = data.slice(4, 4 + messageLength);
    try {
      const response = BidResponse.decode(messageData);
      this.emit('response', response);
    } catch (error) {
      console.error('Failed to decode response:', error);
    }
  }

  async sendBidRequest(requestData) {
    if (!this.connected || !this.socket) {
      throw new Error('Not connected to C++ engine');
    }

    try {
      const request = BidRequest.create(requestData);
      const message = BidRequest.encode(request).finish();
      
      const buffer = Buffer.alloc(4 + message.length);
      buffer.writeUInt32BE(message.length, 0);
      message.copy(buffer, 4);
      
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Request timeout'));
        }, 10000);

        const handler = (response) => {
          clearTimeout(timeout);
          this.removeListener('response', handler);
          resolve(response);
        };

        this.once('response', handler);
        this.socket.write(buffer);
      });
    } catch (error) {
      throw new Error(`Failed to send bid request: ${error.message}`);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.destroy();
      this.socket = null;
      this.connected = false;
    }
  }
}

let cppClient = null;

export async function initCppClient() {
  // Skip initialization in development mode or if host is not set
  if (process.env.NODE_ENV === 'development' || !process.env.CPP_ENGINE_HOST || process.env.CPP_ENGINE_HOST === 'cpp-engine') {
    console.log('C++ client initialization skipped (development mode)');
    return null;
  }
  
  const host = process.env.CPP_ENGINE_HOST;
  const port = parseInt(process.env.CPP_ENGINE_PORT || '5000');
  
  cppClient = new CppClient(host, port);
  await cppClient.connect();
  
  return cppClient;
}

export function getCppClient() {
  return cppClient;
}

