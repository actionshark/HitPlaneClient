class Hall extends eui.Compont {
    private static _instance: Hall;
    public static get instance(): Hall {
        if (!Hall._instance) {
            Hall._instance = new Hall();
        }

        return Hall._instance;
    }

    ///////////////////////////////////////////////

    private sclRooms: eui.Scroller;
    private listRooms: eui.List;

    private lbNickname: eui.Label;
    private lbMoney: eui.Label;
    private lbHint: eui.Label;

    private groupNickname: eui.Group;
    private groupRefresh: eui.Group;

    private constructor() {
        super("hall");
    }

    public onComplete() {
        this.height = Main.instance.stage.stageHeight;

        this.listRooms.itemRenderer = HallRoomGrid;
        this.listRooms.dataProvider = new eui.ArrayCollection();

        Utils.addListener(this.groupNickname, egret.TouchEvent.TOUCH_TAP, function () {
            EditDialog.showEditDialog({
                hintText: "取一个响亮的名字吧",
                inputDefault: Me.userInfo.nickname,
                thisObject: this,
                onConfirm: function (text: string) {
                    if (!upload.SetNickname.setNickname(text)) {
                        return true;
                    }

                    return false;
                },
            });
        }, this);

        Utils.addListener(this.groupRefresh, egret.TouchEvent.TOUCH_TAP, function () {
            this.requestGetRoomList(true);
        }, this);

        this.connect();

        EventMgr.instance.addEventListener(EventMgr.USERINFO_CHANGE, function () {
            this.lbNickname.text = Me.userInfo.nickname;
            this.lbMoney.text = Me.userInfo.money;
        }, this);
    }

    private connect() {
        Connection.instance.connect();

        this.requestGetRoomList();
        Utils.timer(1000, 0, function () {
            this.requestGetRoomList();
        }, this);
    }

    private roomListRequestPoint: number = 0;
    private requestGetRoomList() {
        var curr: number = new Date().getTime();
        if (curr - this.roomListRequestPoint < 5000) {
            return;
        }

        var suc: boolean = new upload.GetRoomList().send();
        if (suc) {
            this.roomListRequestPoint = curr;
        }
    }

    public onRoomList(rooms: download.Room[]) {
        this.listRooms.dataProvider = new eui.ArrayCollection(rooms);
    }

    public setHint(text: string) {
        this.lbHint.text = text;
    }
}