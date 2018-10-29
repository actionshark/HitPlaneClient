namespace upload {
    export class SetNickname extends Upload {
        public static setNickname(nickname: string): boolean {
            if (!nickname || nickname.length < 1 || nickname.length > 20) {
                Toast.showToast("昵称长度为1-20");
                return false;
            }

            var req: SetNickname = new SetNickname();
            req.nickname = nickname;
            req.send();

            return true;
        }

        public nickname: string;
    }
}