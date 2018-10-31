namespace download {
    export class RequestBegin extends Download {
        public id: number;
        public nickname: string;
        public active: boolean;

        public perform() {
            BattleRequest.showRequest(this);

            if (Me.enableAI) {
                if (!this.active) {
                    var ar: upload.AcceptRequest = new upload.AcceptRequest();
                    ar.enemy = this.id;
                    ar.send();
                }
            }
        }
    }
}