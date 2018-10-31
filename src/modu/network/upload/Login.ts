namespace upload {
    export class Login extends Upload {
        public username: string = Me.deviceId;

        public pack(): any {
            if (!this.username) {
                this.username = "anony_" + Utils.randomInt(1, 10000);
            }

            return super.pack();
        }
    }
}