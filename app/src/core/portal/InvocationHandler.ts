import {
  PortalSocket,
  RemoteResultPayload,
  RemoteInvokePayload,
  RemoteMethods
} from './types/remote';
import * as invariant from 'invariant';
const isPromise = require('p-is-promise');

interface Remotable {
  localMethods?: any;
  remoteMethods?: any;
  resolvers?: any;
  remoteReady?: (remote: any) => void;
}

export default class InvocationHandler {
  private remotables: Map<string, Remotable> = new Map();
  private socket: PortalSocket;
  private emitter: { emit: (name: string, args: any) => void };
  private listener: { on: (name: string, cb: (result: any) => void) => void };

  constructor(socket: PortalSocket) {
    this.socket = socket;
  }

  public setSocket(emitter: any, listener: any) {
    this.emitter = emitter;
    this.listener = listener;

    this.remotables.forEach((remotable: Remotable, name: string) => {
      this.emitMethods({
        extensionName: name,
        methods: Object.keys(remotable.localMethods)
      });
    });

    this.listener.on('methods', (methods: RemoteMethods) => {
      this.buildRemoteMethodsInvoker(methods);
    });

    this.listener.on('result', (result: RemoteResultPayload) => {
      this.callResolverWithResult(result);
    });

    this.listener.on('invoke', (payload: RemoteInvokePayload) => {
      this.invokeLocalMethod(payload);
    });
  }

  public registerExtension(
    extensionName: string,
    localMethods: any,
    remoteReady: (remote: any) => void
  ) {
    this.remotables.set(extensionName, {
      localMethods,
      remoteReady
    });

    this.emitMethods({
      extensionName,
      methods: Object.keys(localMethods)
    });
  }

  private buildRemoteMethodsInvoker({ extensionName, methods }: RemoteMethods) {
    const remote = {};
    methods.forEach(method => {
      remote[method] = (...args: any[]) => {
        return new Promise((resolve, reject) => {
          this.setResolverForAMethod(extensionName, method, resolve);
          this.emitInvoke(extensionName, method, args);
        });
      };
    });

    const remotable = this.remotables.get(extensionName);

    if (remotable && remotable.remoteReady) {
      remotable.remoteMethods = remote;
      remotable.remoteReady(remote);
    }
  }

  private emitMethods(methods: RemoteMethods) {
    this.emitter.emit('methods', methods);
  }

  private emitInvoke(extensionName: string, method: string, args: any) {
    invariant(this.socket, 'Socket is not available to emit 😭');
    this.emitter.emit('invoke', {
      extensionName,
      methodName: method,
      args
    });
  }

  private emitResult(extensionName: string, methodName: string, result: any) {
    this.emitter.emit('result', {
      extensionName,
      methodName,
      result
    });
  }

  private setResolverForAMethod(
    extensionName: string,
    methodName: string,
    resolver: () => void
  ) {
    const remotable = this.remotables.get(extensionName);

    if (remotable) {
      remotable.resolvers = remotable.resolvers || {};
      remotable.resolvers[methodName] = resolver;
    }
  }

  private callResolverWithResult({
    extensionName,
    methodName,
    result
  }: RemoteResultPayload) {
    const extension = this.remotables.get(extensionName);
    if (extension) {
      const resolver = extension.resolvers[methodName];
      resolver(JSON.parse(result));
    }
  }

  private invokeLocalMethod({
    extensionName,
    methodName,
    args
  }: RemoteInvokePayload) {
    const extension = this.remotables.get(extensionName);
    if (!extension) {
      return;
    }

    const method = extension.localMethods[methodName];
    const handlerResult = method(...args);
    if (isPromise(handlerResult)) {
      handlerResult.then((result: any) => {
        this.emitResult(extensionName, methodName, result);
      });
    } else {
      this.emitResult(extensionName, methodName, handlerResult);
    }
  }
}
