class Toast extends eui.Component {
    public static list : Array<Toast> = new Array();

    public static showToast(text : string, duration : number = 2000) {
        if (! text || text.length < 1) {
            return;
        }

        Main.instance.showWindow({
            window : new Toast(text, duration),
            through : true,
            special : true,
        });
    }

    //////////////////////////////////////////////////////////////////////

    private lbText : eui.Label;

    private text : string;
    private duration : number;

    private constructor(text : string, duration : number) {
        super();

        this.touchEnabled = false;
        this.touchChildren = false;

        this.text = text;
        this.duration = duration;

        Utils.addListener(this, egret.Event.COMPLETE, this.onComplete);
        this.skinName = "resource/layout/toast.exml";
    }

    private onComplete(event : egret.Event) {
        var heightDelta : number = this.height - this.lbText.height;

        this.lbText.text = this.text;

        var main : Main = Main.instance;

        this.height = this.lbText.height + heightDelta;
        this.x = (main.stage.stageWidth - this.width) / 2;
        this.y = (main.stage.stageHeight - this.height) / 2;

        Toast.list.push(this);

        Utils.timer(20, 10, function() {
            for (var i : number = 0; i < Toast.list.length; i++) {
                var toast : Toast = Toast.list[i];

                if (toast == this) {
                    break;
                }

                toast.y -= 16;
            }
        }, this);

        Utils.timer(this.duration, 1, function() {
            Utils.timer(20, 25, function() {
                this.alpha -= 0.04;
                this.y -= 16;

                if (this.alpha <= 0 && this.parent) {
                    this.parent.removeChild(this);
                }
            }, this);
        }, this);

        Utils.addListener(this, egret.Event.REMOVED_FROM_STAGE, function(event : egret.Event) {
            for (var i : number = 0; i < Toast.list.length; i++) {
                var toast : Toast = Toast.list[i];

                if (toast == this) {
                    Toast.list.splice(i, 1);
                    break;
                }
            }
        });
    }
}