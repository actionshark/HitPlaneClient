class BattleFieldGrid extends eui.ItemRender {
    public static readonly STATUS_NORMAL: number = 0;
    public static readonly STATUS_MISS: number = 1;
    public static readonly STATUS_INJURY: number = 2;
    public static readonly STATUS_GOAL: number = 3;

    public static readonly TILE_EMPTY: number = 0;
    public static readonly TILE_BODY: number = 1;
    public static readonly TILE_HEAD: number = 2;

    public static readonly OWNER_NULL: number = 0;
    public static readonly OWNER_TOP: number = 1;
    public static readonly OWNER_BTM: number = 2;

    private rectBg: eui.Rect;
    private rectTop: eui.Rect;
    private rectBtm: eui.Rect;

    public constructor() {
        super("battle_field_grid");
    }

    public onCreate() {
        Utils.addListener(this, egret.TouchEvent.TOUCH_TAP, function () {
            BattleField.requestPlay(this.itemIndex);
        }, this);
    }

    public onUpdate() {
        var fillColor: number;

        switch (this.data.status) {
            case BattleFieldGrid.STATUS_MISS:
                fillColor = 0x99cc66;
                break;

            case BattleFieldGrid.STATUS_INJURY:
                fillColor = 0xff9999;
                break;

            case BattleFieldGrid.STATUS_GOAL:
                fillColor = 0xff0000;
                break;

            default:
                fillColor = 0xffffff;
                break;
        }

        this.rectBg.fillColor = fillColor;

        this.rectTop.visible = this.data.owner == BattleFieldGrid.OWNER_TOP;
        this.rectBtm.visible = this.data.owner == BattleFieldGrid.OWNER_BTM;
    }
}