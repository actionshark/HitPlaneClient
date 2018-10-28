namespace download {
    export class RequestBegin extends Download {
        public id: number;
        public nickname: string;
        public active: boolean;

        public perform() {
            BattleRequest.showRequest(this);
        }
    }
}