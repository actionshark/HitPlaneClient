class BattleRequest extends eui.Compont {
    public static requestBattle(enemyId: number) {
        var req: upload.SendRequest = new upload.SendRequest();
        req.enemy = enemyId;
        req.send();
    }

    public static requestAccept(enemyId: number) {
        var req: upload.AcceptRequest = new upload.AcceptRequest();
        req.enemy = enemyId;
        req.send();
    }

    public static requestRemove(enemyId: number) {
        var req: upload.RemoveRequest = new upload.RemoveRequest();
        req.enemy = enemyId;
        req.send();
    }

    private static window: BattleRequest;
    public static showRequest(data: download.RequestBegin) {
        var main: Main = Main.instance;

        var window: BattleRequest = BattleRequest.window;
        if (!window) {
            BattleRequest.window = window = new BattleRequest();
        }

        window.onData(data);
        window.x = (main.stage.stageWidth - window.width) / 2;
        window.y = (main.stage.stageHeight - window.height) / 2;

        main.showWindow({
            window: window,
            touchOutside: false,
        });
    }

    public static closeRequest(enemy: number = null) {
        if (enemy == null || enemy == BattleRequest.window.data.id) {
            Main.instance.removeWindow(BattleRequest.window);
        }
    }

    ///////////////////////////////////////////////////////////

    private lbText: eui.Label;

    private groupAccept: eui.Group;
    private groupCancel: eui.Group;
    private groupRefuse: eui.Group;

    private data: download.RequestBegin;

    private constructor() {
        super("battle_request");
    }

    public onComplete() {
        this.groupAccept.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            BattleRequest.requestAccept(this.data.id);
        }, this);

        this.groupCancel.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            BattleRequest.requestRemove(this.data.id);
            BattleRequest.closeRequest(this.data.id);
        }, this);

        this.groupRefuse.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            BattleRequest.requestRemove(this.data.id);
            BattleRequest.closeRequest(this.data.id);
        }, this);
    }

    private onData(data: download.RequestBegin) {
        this.data = data;

        if (this.data.active) {
            this.lbText.text = "等待【" + this.data.nickname + "】的回应";
            this.groupAccept.visible = false;
            this.groupCancel.visible = true;
            this.groupRefuse.visible = false;
        } else {
            this.lbText.text = "玩家【" + this.data.nickname + "】发出挑战";
            this.groupAccept.visible = true;
            this.groupCancel.visible = false;
            this.groupRefuse.visible = true;
        }
    }
}