namespace download {
    export class BattleEnd extends Download {
        public winner: number;
        public tiles: any[];

        public perform() {
            BattleField.onBattleEnd(this);
        }
    }
}