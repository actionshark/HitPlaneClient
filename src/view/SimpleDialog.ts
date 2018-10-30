/**
 * SimpleDialog.showDialog({
 *      hint : "要添加好友吗？",
 *      buttons : ["取消", "确定",],
 *      thisObject : this,
 *      callback : function(index : number) {
 *          if (index == 0) {
 *          } else if (index == 1) {
 *          }
 *      },
 * });
 */

class SimpleDialog extends eui.Compont {
    public static showDialog(data): SimpleDialog {
        var main: Main = Main.instance;

        var window: SimpleDialog = new SimpleDialog(data);
        window.x = (main.stage.stageWidth - window.width) / 2;
        window.y = (main.stage.stageHeight - window.height) / 2;

        main.showWindow({
            window: window,
        });

        return window;
    }

    ////////////////////////////////////////////////////////////////////////////

    private lbHint: eui.Label;

    private data: any;

    private constructor(data) {
        super("simple_dialog", data);
    }

    public onComplete(data) {
        this.data = data;

        this.lbHint.text = this.data.hint;

        var btnNum: number = this.data.buttons.length;
        var width: number = this.width / btnNum;

        for (let i: number = 0; i < btnNum; i++) {
            var text: string = this.data.buttons[i]
            var x: number = width * (i + 0.5);

            var btn: SimpleDialogButton = new SimpleDialogButton(text, x);

            btn.maxWidth = width * 0.8;
            btn.y = 420;

            Utils.addListener(btn, egret.TouchEvent.TOUCH_TAP, function (event: egret.TouchEvent) {
                if (this.data.callback) {
                    var ret = this.data.callback.call(this.data.thisObject || this, i);
                    if (ret) {
                        return;
                    }
                }

                this.parent.removeChild(this);
            }, this);

            this.addChild(btn);
        }
    }
}

class SimpleDialogButton extends eui.Compont {
    private lbText: eui.Label;

    public constructor(text: string, tx: number) {
        super("simple_dialog_btn", text, tx);
    }

    public onComplete(text: string, tx: number) {
        this.lbText.text = text;

        this.x = tx - this.width / 2;
    }
}