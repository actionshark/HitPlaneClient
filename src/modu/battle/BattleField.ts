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
    private rectTurnTop: eui.Label;

    private lbNicknameBtm: eui.Label;
    private rectTurnBtm: eui.Label;

    private sclMap: eui.Scroller;
    private listMap: eui.List;

    private groupTop: eui.Group;
    private groupBtm: eui.Group;

    private idTop: number;
    private idBtm: number;
    private idTurn: number;

    public constructor() {
        super("battle_field");
    }

    public onComplete() {
        this.listMap.itemRenderer = BattleFieldGrid;

        Utils.addListener(this.groupBtm, egret.TouchEvent.TOUCH_TAP, function () {
            if (this.isTurn == 0) {
                this.closeView();
                return;
            }

            SimpleDialog.showDialog({
                hint: "要退出战斗吗？",
                buttons: ["取消", "确定",],
                thisObject: this,
                callback: function(index) {
                    if (index == 1) {
                        this.closeView();
                    }
                },
            });
        }, this);
    }

    private updateTurn() {
        if (this.idTop == this.idTurn) {
            this.rectTurnTop.visible = true;
            this.rectTurnBtm.visible = false;
        } else {
            this.rectTurnTop.visible = false;
            this.rectTurnBtm.visible = true;
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
            var item = {};

            this.parseTile(tile, item);

            dp.addItem(item);
        }

        this.listMap.dataProvider = dp;

        this.updateTurn();
    }

    private onTurnChange(data: download.TurnChange) {
        this.idTurn = data.id;

        if (data.tile) {
            var dp: eui.ArrayCollection = this.listMap.dataProvider as eui.ArrayCollection;
            var index: number = data.row * BattleField.COL_NUM + data.col;

            var item = dp.getItemAt(index);
            this.parseTile(data.tile, item);

            dp.itemUpdated(item);
        }

        this.updateTurn();
    }

    private onBattleEnd(data: download.BattleEnd) {
        var tiles: any[] = data.tiles;
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

    private closeView() {
        Main.instance.removeWindow(this);
    }
}