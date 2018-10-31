namespace download {
    export class BattleEnd extends Download {
        public uid: number;
        public tiles: any[];

        public perform() {
            BattleField.onBattleEnd(this);
        }
    }
}