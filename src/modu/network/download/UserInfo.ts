namespace download {
    export class UserInfo extends Download {
        public static readonly STATUS_IDLE: number = 1;
        public static readonly STATUS_BATTLE: number = 2;
        public static readonly STATUS_WATCH: number = 3;

        public id: number = 0;
        public nickname: string = "";
        public status: number = 0;

        public perform() {
            Me.userInfo = this;

            var event: egret.Event = new egret.Event(EventMgr.USERINFO_CHANGE);
            EventMgr.instance.dispatchEvent(event);
        }
    }
}