import {
  PortalSocket,
  RemoteResultPayload,
  RemoteInvokePayload,
  RemoteMethods
} from './types/remote';
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

  public setSocket(socket: PortalSocket) {
    this.socket = socket;

    this.remotables.forEach((remotable: Remotable, name: string) => {
      this.emitMethods({
        extensionName: name,
        methods: Object.keys(remotable.localMethods)
      });
    });

    this.socket.emit('requestMethods', {});

    this.socket.on((message: any) => {
      if (message.event === 'methods') {
        this.buildRemoteMethodsInvoker(message);
      } else if (message.event === 'result') {
        this.callResolverWithResult(message);
      } else if (message.event === 'invoke') {
        this.invokeLocalMethod(message);
      } else if (message.event === 'requestMethods') {
        this.remotables.forEach((remotable: Remotable, name: string) => {
          this.emitMethods({
            extensionName: name,
            methods: Object.keys(remotable.localMethods)
          });
        });
      }
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
    this.socket.emit('methods', methods);
  }

  private emitInvoke(extensionName: string, method: string, args: any) {
    this.socket.emit('invoke', {
      extensionName,
      methodName: method,
      args
    });
  }

  private emitResult(extensionName: string, methodName: string, result: any) {
    this.socket.emit('result', {
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
