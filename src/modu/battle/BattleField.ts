class BattleField extends eui.Compont {
    public static requestPlay(index: number) {
        var req: upload.PlayBattle = new upload.PlayBattle();
        req.row = Math.floor(index / BattleField.COL_NUM);
        req.col = index % BattleField.COL_NUM;
        req.send();
    }

    private static window: BattleField;

    private static checkWindow(checkOnly: boolean): boolean {
        var window: BattleField = BattleField.window;
        if (!window) {
            if (checkOnly) {
                return false;
            }

            window = BattleField.window = new BattleField();
        }

        if (!window.parent) {
            if (checkOnly) {
                return false;
            }

            Main.instance.showWindow({
                window: window,
                fullScreen: true,
                onBackDown: function () {
                    window.showMenu();
                    return true;
                },
            });
        }

        return true;
    }

    public static onBattleInfo(data: download.BattleInfo) {
        BattleField.checkWindow(false);
        BattleField.window.onBattleInfo(data);
    }

    public static onTurnChange(data: download.TurnChange) {
        if (BattleField.checkWindow(true)) {
            BattleField.window.onTurnChange(data);
        }
    }

    public static onBattleEnd(data: download.BattleEnd) {
        if (BattleField.checkWindow(true)) {
            BattleField.window.onBattleEnd(data);
        }
    }

    public static readonly ROW_NUM: number = 8;
    public static readonly COL_NUM: number = 8;

    /////////////////////////////////////////////////////////////////////////

    private lbNicknameTop: eui.Label;
    private lbHintTop: eui.Label;

    private lbNicknameBtm: eui.Label;
    private lbHintBtm: eui.Label;

    private sclMap: eui.Scroller;
    private listMap: eui.List;

    private groupTop: eui.Group;
    private groupBtm: eui.Group;

    private idTop: number;
    private idBtm: number;
    private idTurn: number;

    private ai: AI = new AI();

    public constructor() {
        super("battle_field");
    }

    public onComplete() {
        this.listMap.itemRenderer = BattleFieldGrid;

        this.groupBtm.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (this.idTurn == 0) {
                this.closeView();
            } else {
                this.showMenu();
            }
        }, this);
    }

    private updateTurn() {
        if (this.idTop == this.idTurn) {
            this.lbHintTop.text = "行动中";
            this.lbHintBtm.text = "";
        } else if (this.idBtm == this.idTurn) {
            this.lbHintTop.text = "";
            this.lbHintBtm.text = "行动中";
        } else {
            this.lbHintTop.text = "";
            this.lbHintBtm.text = "关闭";
        }
    }

    private onBattleInfo(data: download.BattleInfo) {
        var swap: boolean;
        if (data.idA == Me.userInfo.id) {
            swap = true;
        } else if (data.idB == Me.userInfo.id) {
            swap = false;
        } else if (data.idA > data.idB) {
            swap = true;
        } else {
            swap = false;
        }

        if (swap) {
            this.idTop = data.idB;
            this.idBtm = data.idA;
        } else {
            this.idTop = data.idA;
            this.idBtm = data.idB;
        }

        this.lbNicknameTop.text = this.idTop == data.idA ? data.nicknameA : data.nicknameB;
        this.lbNicknameBtm.text = this.idBtm == data.idA ? data.nicknameA : data.nicknameB;

        this.idTurn = data.turn;

        var dp: eui.ArrayCollection = new eui.ArrayCollection();

        for (var i: number = 0; i < data.tiles.length; i++) {
            var tile = data.tiles[i];
            var item: any = {};

            this.parseTile(tile, item);

            dp.addItem(item);
        }

        this.listMap.dataProvider = dp;

        this.updateTurn();

        if (Me.enableAI) {
            this.ai.init(data.tiles);
            
            var counts: number[][] = this.ai.count();

            for (var row: number = 0; row < BattleField.ROW_NUM; row++) {
                for (var col: number = 0; col < BattleField.COL_NUM; col++) {
                    var item = dp.getItemAt(BattleField.COL_NUM * row + col);
                    var cnt: number = counts[row][col];

                    if (item.text != cnt) {
                        item.text = cnt;
                        dp.itemUpdated(item);
                    }
                }
            }

            if (this.idTurn == Me.userInfo.id) {
                var result: AIResult = this.ai.calc();
                var pb: upload.PlayBattle = new upload.PlayBattle();
                pb.row = result.row;
                pb.col = result.col;
                pb.send();
            }
        }
    }

    private onTurnChange(data: download.TurnChange) {
        this.idTurn = data.id;

        var dp: eui.ArrayCollection = this.listMap.dataProvider as eui.ArrayCollection;
        var index: number = data.row * BattleField.COL_NUM + data.col;

        for (var i: number = 0; i < dp.length; i++) {
            var item = dp.getItemAt(i);

            if (i == index) {
                this.parseTile(data.tile, item);
                item.showStroke = true;
                dp.itemUpdated(item);
            } else if (item.showStroke) {
                item.showStroke = false;
                dp.itemUpdated(item);
            }
        }

        this.updateTurn();

        if (Me.enableAI) {
            if (this.idTurn != 0) {
                this.ai.onTurn(data.row, data.col, data.tile.status);

                var counts: number[][] = this.ai.count();

                for (var row: number = 0; row < BattleField.ROW_NUM; row++) {
                    for (var col: number = 0; col < BattleField.COL_NUM; col++) {
                        var item = dp.getItemAt(BattleField.COL_NUM * row + col);
                        var cnt: number = counts[row][col];

                        if (item.text != cnt) {
                            item.text = cnt;
                            dp.itemUpdated(item);
                        }
                    }
                }

                if (this.idTurn == Me.userInfo.id) {
                    var result: AIResult = this.ai.calc();
                    var pb: upload.PlayBattle = new upload.PlayBattle();
                    pb.row = result.row;
                    pb.col = result.col;
                    pb.send();
                }
            }
        }
    }

    private onBattleEnd(data: download.BattleEnd) {
        var tiles: any[] = data.tiles;

        if (tiles) {
            var dp: eui.ArrayCollection = this.listMap.dataProvider as eui.ArrayCollection;

            for (var i: number = 0; i < tiles.length; i++) {
                var tile = tiles[i];
                var item = dp.getItemAt(i);

                item.status = tile.type == BattleFieldGrid.TILE_EMPTY ? BattleFieldGrid.STATUS_NORMAL : BattleFieldGrid.STATUS_GOAL;

                if (tile.owner == this.idTop) {
                    item.owner = BattleFieldGrid.OWNER_TOP;
                } else if (tile.owner == this.idBtm) {
                    item.owner = BattleFieldGrid.OWNER_BTM;
                } else {
                    item.owner = BattleFieldGrid.OWNER_NULL;
                }

                dp.itemUpdated(item);
            }
        } else if (data.uid == Me.userInfo.id) {
            Toast.showToast("逃跑成功");
            this.closeView();
        } else {
            Toast.showToast("对方已逃跑");
            this.idTurn = 0;
            this.updateTurn();
        }

        this.updateTurn();
    }

    private parseTile(server, client) {
        client.status = server.status;

        if (server.owner == this.idTop) {
            client.owner = BattleFieldGrid.OWNER_TOP;
        } else if (server.owner == this.idBtm) {
            client.owner = BattleFieldGrid.OWNER_BTM;
        } else {
            client.owner = BattleFieldGrid.OWNER_NULL;
        }
    }

    private showMenu() {
        SimpleDialog.showDialog({
            hint: "请选择",
            buttons: ["退出", "暂离", "取消",],
            thisObject: this,
            callback: function (index) {
                if (index == 0) {
                    new upload.QuitBattle().send();
                } else if (index == 1) {
                    this.closeView();
                }
            },
        });
    }

    private closeView() {
        Main.instance.removeWindow(this);

        new upload.GetUserList().send();
    }
}