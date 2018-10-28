class HallUserGrid extends eui.ItemRender {
    private lbNickname: eui.Label;
    private lbStatus: eui.Label;

    public constructor() {
        super("hall_user_grid");
    }

    public onCreate() {
        Utils.addListener(this, egret.TouchEvent.TOUCH_TAP, function() {
            if (this.data.id != Me.userInfo.id) {
                BattleRequest.requestBattle(this.data.id);
            }
        }, this);
    }

    public onUpdate() {
        this.lbNickname.text = this.data.nickname;
        this.lbNickname.textColor = this.data.id == Me.userInfo.id ? 0xff6666 : 0x333333;

        switch (this.data.status) {
            case download.UserInfo.STATUS_IDLE:
                this.lbStatus.text = "空闲";
                this.lbStatus.textColor = 0x99cc66;
                break;

            case download.UserInfo.STATUS_BATTLE:
                this.lbStatus.text = "游戏中";
                this.lbStatus.textColor = 0xff6666;
                break;

            case download.UserInfo.STATUS_WATCH:
                this.lbStatus.text = "观战中";
                this.lbStatus.textColor = 0x0066cc;
                break;
            
            default:
                this.lbStatus.text = "未知";
                this.lbStatus.textColor = 0x000000;
                break;
        }
    }
}