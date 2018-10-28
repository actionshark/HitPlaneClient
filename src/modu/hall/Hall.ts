class Hall extends eui.Compont {
    private static _instance: Hall;
    public static get instance(): Hall {
        if (!Hall._instance) {
            Hall._instance = new Hall();
        }

        return Hall._instance;
    }

    ///////////////////////////////////////////////

    private sclUsers: eui.Scroller;
    private listUsers: eui.List;

    private lbNickname: eui.Label;

    private constructor() {
        super("hall");
    }

    public onComplete() {
        this.height = Main.instance.stage.stageHeight;

        this.listUsers.itemRenderer = HallUserGrid;
        this.listUsers.dataProvider = new eui.ArrayCollection();

        this.connect();

        EventMgr.instance.addEventListener(EventMgr.USERINFO_CHANGE, function () {
            this.lbNickname.text = Me.userInfo.nickname;
        }, this);
    }

    private connect() {
        var conn: Connection = Connection.instance;
        conn.url = "ws://127.0.0.1:10001/hitplane";
        conn.connect();

        this.requestGetTime();
        this.requestGetUserList();
        Utils.timer(1000, 0, function () {
            this.requestGetTime();
            this.requestGetUserList();
        }, this);
    }

    private timeRequestPoint: number = 0;
    private requestGetTime() {
        var curr: number = new Date().getTime();
        if (curr - this.timeRequestPoint < 30000) {
            return;
        }

        var suc: boolean = new upload.GetTime().send();
        if (suc) {
            this.timeRequestPoint = curr;
        }
    }

    private userListRequestPoint: number = 0;
    private requestGetUserList() {
        var curr: number = new Date().getTime();
        if (curr - this.userListRequestPoint < 5000) {
            return;
        }

        var suc: boolean = new upload.GetUserList().send();
        if (suc) {
            this.userListRequestPoint = curr;
        }
    }

    public onUserList(list: download.UserInfo[]) {
        this.listUsers.dataProvider = new eui.ArrayCollection(list);
    }
}