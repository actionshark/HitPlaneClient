namespace download {
    export class Logout extends Download {
        public reason: string;

        public perform() {
            if (this.reason) {
                Toast.showToast(this.reason);
            }

            Hall.instance.setHint("未登录");
        }
    }
}