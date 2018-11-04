namespace download {
    export class LoginResult extends Download {
        public error: string;

        public perform() {
            if (this.error) {
                Hall.instance.setHint("登录出错");
                Toast.showToast(this.error);
                return;
            }

            Hall.instance.setHint("已登录");

            new upload.GetTime().send();
            // TODO
        }
    }
}