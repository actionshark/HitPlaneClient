namespace download {
    export class NeedLogin extends Download {
        public perform() {
            new upload.Login().send();
            Hall.instance.setHint("正在登录");
        }
    }
}