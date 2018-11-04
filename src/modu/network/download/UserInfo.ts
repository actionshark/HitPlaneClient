namespace download {
    export class UserInfo extends Download {
        public id: number = 0;
        public nickname: string = "";
        public money: number = 0;

        public perform() {
            Me.userInfo = this;

            var event: egret.Event = new egret.Event(EventMgr.USERINFO_CHANGE);
            EventMgr.instance.dispatchEvent(event);
        }
    }
}