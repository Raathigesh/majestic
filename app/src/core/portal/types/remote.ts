export interface RemoteMethods {
  extensionName: string;
  methods: string[];
}

export interface RemoteInvokePayload {
  extensionName: string;
  methodName: string;
  args: any;
}

export interface RemoteResultPayload {
  extensionName: string;
  methodName: string;
  result: any;
}

export interface PortalSocket {
  emit: (event: string, payload: any) => void;
  on: (event: string, callback: any) => void;
}
