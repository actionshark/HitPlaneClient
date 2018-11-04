namespace download {
    export class NeedLogin extends Download {
        public perform() {
            Hall.instance.setHint("正在登录");
            new upload.Login().send();
        }
    }
}