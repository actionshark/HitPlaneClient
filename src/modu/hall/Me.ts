class Me {
    public static userInfo: download.UserInfo = new download.UserInfo();

    public static deviceId: string;

    public static get enableAI(): boolean {
        return Me.userInfo.id == 1;
    }
}