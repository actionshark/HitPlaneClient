class Connection {
    public static readonly STATUS_CLOSED: number = 1;
    public static readonly STATUS_CONNECTING: number = 2;
    public static readonly STATUS_CONNECTED: number = 3;

    private static _instance: Connection;
    public static get instance(): Connection {
        if (!Connection._instance) {
            Connection._instance = new Connection();
        }

        return Connection._instance;
    }

    //////////////////////////////////////////////////////////////////////

    private ws: egret.WebSocket;

    public url: string;

    private isConnecting: boolean = false;

    private constructor() {
        this.ws = new egret.WebSocket();

        this.ws.addEventListener(egret.Event.CONNECT, this.onConnect, this);
        this.ws.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onData, this);
        this.ws.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);
        this.ws.addEventListener(egret.Event.CLOSE, this.onClose, this);
    }

    public get status(): number {
        if (this.ws && this.ws.connected) {
            return Connection.STATUS_CONNECTED;
        }

        if (this.isConnecting) {
            return Connection.STATUS_CONNECTING;
        }

        return Connection.STATUS_CLOSED;
    }

    public connect() {
        if (this.status != Connection.STATUS_CLOSED) {
            return;
        }

        this.ws.connectByUrl(this.url);

        this.isConnecting = true;
    }

    public send(text: string): boolean {
        if (this.status == Connection.STATUS_CONNECTED) {
            console.log("connection.send()", text);

            this.ws.writeUTF(text);

            return true;
        }

        return false;
    }

    private onConnect() {
        Toast.showToast("连接成功");

        this.isConnecting = false;

        var login: upload.Login = new upload.Login();
        login.username = "test";
        login.send();
    }

    private onData() {
        this.isConnecting = false;

        var text: string = this.ws.readUTF();
        console.log("connection.onData()", text);

        var json = JSON.parse(text);
        var name: string = json.name;
        var clazz = download[name];

        if (!clazz) {
            console.log("download (" + name + ") not found");
            return;
        }

        var dl: download.Download = new clazz();
        dl.parse(json);
        dl.perform();
    }

    private onError(event: egret.IOErrorEvent) {
        console.log("connection.onError()");
    }

    private onClose() {
        Toast.showToast("连接已断开");

        this.isConnecting = false;

        Utils.timer(3000, 1, this.connect, this);
    }
}