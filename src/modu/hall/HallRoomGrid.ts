class HallRoomGrid extends eui.ItemRender {
    public static readonly USER_NUM: number = 4;

    private groupJoin: eui.Group;
    private lbJoin: eui.Label;

    public constructor() {
        super("hall_room_grid");
    }

    public onCreate() {
        Utils.addListener(this.groupJoin, egret.TouchEvent.TOUCH_TAP, function () {
            // TODO
        }, this);
    }

    public onUpdate() {
        var hasMe: boolean = false;

        for (var i: number = 0; i < HallRoomGrid.USER_NUM; i++) {
            var lbUser: eui.Label = this["lbUser" + i];
            var user: download.User = this.data.users[i];

            if (user) {
                lbUser.text = user.nickname;
                lbUser.textColor = user.status ? 0x0099cc : 0x999999;

                if (user.id == Me.userInfo.id) {
                    hasMe = true;
                }
            } else {
                lbUser.text = "";
            }
        }

        if (hasMe) {
            this.lbJoin.text = "回归";
        } else if (this.data.running) {
            this.lbJoin.text = "旁观";
        } else if (this.data.users.length < HallRoomGrid.USER_NUM) {
            this.lbJoin.text = "加入";
        } else {
            this.lbJoin.text = "等待";
        }
    }
}