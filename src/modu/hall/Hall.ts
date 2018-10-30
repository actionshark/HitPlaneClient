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
    private groupRefresh: eui.Group;

    private lbNickname: eui.Label;
    private groupModify: eui.Group;

    private constructor() {
        super("hall");
    }

    public onComplete() {
        this.height = Main.instance.stage.stageHeight;

        this.listUsers.itemRenderer = HallUserGrid;
        this.listUsers.dataProvider = new eui.ArrayCollection();

        Utils.addListener(this.groupModify, egret.TouchEvent.TOUCH_TAP, function () {
            EditDialog.showEditDialog({
                hintText: "取一个响亮的名字吧",
                inputDefault: Me.userInfo.nickname,
                thisObject: this,
                onConfirm: function(text: string) {
                    if (! upload.SetNickname.setNickname(text)) {
                        return true;
                    }

                    return false;
                },
            });
        }, this);

        Utils.addListener(this.groupRefresh, egret.TouchEvent.TOUCH_TAP, function() {
            this.requestGetUserList(true);
        }, this);

        this.connect();

        EventMgr.instance.addEventListener(EventMgr.USERINFO_CHANGE, function () {
            this.lbNickname.text = Me.userInfo.nickname;
        }, this);
    }

    private connect() {
        var conn: Connection = Connection.instance;
        conn.connect();

        this.requestGetUserList();
        Utils.timer(1000, 0, function() {
            this.requestGetUserList();
        }, this);
    }

    private userListRequestPoint: number = 0;
    private requestGetUserList(force: boolean = false) {
        var curr: number = new Date().getTime();
        if (!force && curr - this.userListRequestPoint < 5000) {
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