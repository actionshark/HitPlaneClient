namespace download {
    export class TurnChange extends Download {
        public id: number;

        public row: number;
        public col: number;
        public tile;

        public perform() {
            BattleField.onTurnChange(this);
        }
    }
}