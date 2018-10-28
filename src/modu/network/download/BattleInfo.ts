namespace download {
    export class BattleInfo extends Download {
        public idA: number;
        public nicknameA: string;

        public idB: number;
        public nicknameB: string;

        public turn: number;

        public tiles: any[];

        public perform() {
            BattleField.onBattleInfo(this);
        }
    }
}