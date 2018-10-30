namespace download {
    export class BattleEnd extends Download {
        public winnerId: number;
        public tiles: any[];

        public perform() {
            BattleField.onBattleEnd(this);
        }
    }
}