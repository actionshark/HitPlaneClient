namespace download {
    export class RequestEnd extends Download {
        public id: number;
        public reason: string;

        public perform() {
            if (this.reason) {
                Toast.showToast(this.reason);
            }

            BattleRequest.closeRequest(this.id);
        }
    }
}