class AIResult {
    public row: number;
    public col: number;
}

class AI {
    public static readonly PLANE: number[][] = [
        [BattleFieldGrid.TILE_EMPTY, BattleFieldGrid.TILE_EMPTY, BattleFieldGrid.TILE_HEAD, BattleFieldGrid.TILE_EMPTY, BattleFieldGrid.TILE_EMPTY,],
        [BattleFieldGrid.TILE_BODY, BattleFieldGrid.TILE_BODY, BattleFieldGrid.TILE_BODY, BattleFieldGrid.TILE_BODY, BattleFieldGrid.TILE_BODY,],
        [BattleFieldGrid.TILE_EMPTY, BattleFieldGrid.TILE_EMPTY, BattleFieldGrid.TILE_BODY, BattleFieldGrid.TILE_EMPTY, BattleFieldGrid.TILE_EMPTY,],
        [BattleFieldGrid.TILE_EMPTY, BattleFieldGrid.TILE_BODY, BattleFieldGrid.TILE_BODY, BattleFieldGrid.TILE_BODY, BattleFieldGrid.TILE_EMPTY,],
    ];

    private map: number[][];

    private injuryTop: number;
    private injuryBtm: number;
    private injuryLeft: number;
    private injuryRight: number;

    public constructor() {
    }

    public init(tiles: any[]) {
        this.map = [];

        this.injuryTop = BattleField.ROW_NUM;
        this.injuryBtm = 0;
        this.injuryLeft = BattleField.COL_NUM;
        this.injuryRight = 0;

        var index: number = 0;

        for (var row: number = 0; row < BattleField.ROW_NUM; row++) {
            this.map[row] = [];

            for (var col: number = 0; col < BattleField.COL_NUM; col++) {
                var status: number = tiles[index++].status

                this.map[row][col] = status;

                if (status == BattleFieldGrid.STATUS_INJURY) {
                    this.injuryTop = Math.min(this.injuryTop, row);
                    this.injuryBtm = Math.max(this.injuryBtm, row);
                    this.injuryLeft = Math.min(this.injuryLeft, col);
                    this.injuryRight = Math.max(this.injuryRight, col);
                }
            }
        }
    }

    public onTurn(row: number, col: number, status: number) {
        this.map[row][col] = status;

        if (status == BattleFieldGrid.STATUS_INJURY) {
            this.injuryTop = Math.min(this.injuryTop, row);
            this.injuryBtm = Math.max(this.injuryBtm, row);
            this.injuryLeft = Math.min(this.injuryLeft, col);
            this.injuryRight = Math.max(this.injuryRight, col);
        }
    }

    public calc(): AIResult {
        var max: number = 0;
        var counts: number[][] = this.count();

        for (var row: number = 0; row < counts.length; row++) {
            for (var col: number = 0; col < counts[0].length; col++) {
                max = Math.max(max, counts[row][col]);
            }
        }

        var result: AIResult[] = [];
        for (var row: number = 0; row < counts.length; row++) {
            for (var col: number = 0; col < counts[0].length; col++) {
                if (counts[row][col] == max) {
                    var rst: AIResult = new AIResult();
                    rst.row = row;
                    rst.col = col;

                    result.push(rst);
                }
            }
        }

        var index: number = Utils.randomInt(0, result.length - 1);
        return result[index];
    }

    public count(): number[][] {
        var counts: number[][] = [];
        for (var row: number = 0; row < BattleField.ROW_NUM; row++) {
            counts[row] = [];

            for (var col: number = 0; col < BattleField.COL_NUM; col++) {
                counts[row][col] = 0;
            }
        }

        ///////////////////////////////////////////////////////////////////////////

        var plane: number[][] = [];
        for (var row: number = 0; row < AI.PLANE.length; row++) {
            plane[row] = [];

            for (var col: number = 0; col < AI.PLANE[0].length; col++) {
                plane[row][col] = AI.PLANE[row][col];
            }
        }

        this.countOne(counts, plane);

        ///////////////////////////////////////////////////////////////////////////

        var plane: number[][] = [];
        for (var row: number = 0; row < AI.PLANE.length; row++) {
            plane[row] = [];

            for (var col: number = 0; col < AI.PLANE[0].length; col++) {
                plane[row][col] = AI.PLANE[AI.PLANE.length - 1 - row][col];
            }
        }

        this.countOne(counts, plane);

        ///////////////////////////////////////////////////////////////////////////

        var plane: number[][] = [];
        for (var row: number = 0; row < AI.PLANE[0].length; row++) {
            plane[row] = [];

            for (var col: number = 0; col < AI.PLANE.length; col++) {
                plane[row][col] = AI.PLANE[col][row];
            }
        }

        this.countOne(counts, plane);

        ///////////////////////////////////////////////////////////////////////////

        var plane: number[][] = [];
        for (var row: number = 0; row < AI.PLANE[0].length; row++) {
            plane[row] = [];

            for (var col: number = 0; col < AI.PLANE.length; col++) {
                plane[row][col] = AI.PLANE[AI.PLANE.length - 1 - col][row];
            }
        }

        this.countOne(counts, plane);

        return counts;
    }

    private countOne(counts: number[][], plane: number[][]) {
        var rowNum: number = plane.length;
        var colNum: number = plane[0].length;

        var hr: number = undefined;
        var hc: number = undefined;

        for (var row: number = 0; row < rowNum; row++) {
            for (var col: number = 0; col < colNum; col++) {
                if (plane[row][col] == BattleFieldGrid.TILE_HEAD) {
                    hr = row;
                    hc = col;
                    break;
                }
            }

            if (hr != undefined) {
                break;
            }
        }

        var top: number = Math.max(this.injuryBtm - rowNum + 1, 0);
        var btm: number = Math.min(this.injuryTop, BattleField.ROW_NUM - rowNum);
        var left: number = Math.max(this.injuryRight - colNum + 1, 0);
        var right: number = Math.min(this.injuryLeft, BattleField.COL_NUM - colNum);

        for (var row: number = top; row <= btm; row++) {
            for (var col: number = left; col <= right; col++) {
                if (this.match(plane, row, col)) {
                    counts[hr + row][hc + col]++;
                }
            }
        }
    }

    private match(plane: number[][], row: number, col: number): boolean {
        for (var r: number = 0; r < plane.length; r++) {
            for (var c: number = 0; c < plane[0].length; c++) {
                var status: number = this.map[r + row][c + col];
                var tile: number = plane[r][c];

                if (status == BattleFieldGrid.STATUS_NORMAL) {
                    continue;
                }

                if (status == BattleFieldGrid.STATUS_MISS && tile == BattleFieldGrid.TILE_EMPTY) {
                    continue;
                }

                if (status == BattleFieldGrid.STATUS_INJURY && tile == BattleFieldGrid.TILE_BODY) {
                    continue;
                }

                return false;
            }
        }

        return true;
    }
}