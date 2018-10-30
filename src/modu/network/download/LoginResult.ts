namespace download {
    export class LoginResult extends Download {
        public error: string;

        public perform() {
            if (this.error) {
                Toast.showToast(this.error);
                return;
            }

            new upload.GetTime().send();
            new upload.GetBattleInfo().send();
        }
    }
}