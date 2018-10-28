/**
 * SimpleDialog.showDialog({
 *      text : "要添加好友吗？",
 *      buttons : ["取消", "确定",],
 *      thisObject : this,
 *      callback : function(index : number) {
 *          if (index == 0) {
 *          } else if (index == 1) {
 *          }
 *      },
 * });
 */

class SimpleDialog extends eui.Component {
    public static showDialog(options: any): SimpleDialog {
        var window: SimpleDialog = new SimpleDialog(options);

        Main.instance.showWindow({
            window: window,
            bgColor: 0x000000,
            bgAlpha: 0.4,
        });

        return window;
    }

    ////////////////////////////////////////////////////////////////////////////

    private lbText: eui.Label;

    private options: any;

    private constructor(options: any) {
        super();

        this.options = options;

        Utils.addListener(this, egret.Event.COMPLETE, this.onComplete);
        this.skinName = "resource/layout/simple_dialog.exml";
    }

    private onComplete(event: egret.Event) {
        var main: Main = Main.instance;
        this.x = (main.stage.stageWidth - this.width) / 2;
        this.y = (main.stage.stageHeight - this.height) / 2;

        this.lbText.text = this.options.text;
        this.lbText.y = (this.height - 170 - this.lbText.height) / 2;

        var btnNum: number = this.options.buttons.length;
        var width: number = this.width / btnNum;

        for (let i: number = 0; i < btnNum; i++) {
            var text: string = this.options.buttons[i]
            var x: number = width * (i + 0.5);
            var bgTexture: egret.Texture = (btnNum - i) % 2 == 0 ? RES.getRes("ty_anniu2_png") : null;

            var btn: SimpleDialogButton = new SimpleDialogButton(text, x, bgTexture);

            btn.maxWidth = width * 0.8;
            btn.y = 360;

            Utils.addListener(btn, egret.TouchEvent.TOUCH_TAP, function (event: egret.TouchEvent) {
                if (this.options.callback) {
                    var ret = this.options.callback.call(this.options.thisObject || this, i);
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

class SimpleDialogButton extends eui.Component {
    private imgBg: eui.Image;
    private lbText: eui.Label;

    private text: string;
    private tx: number;
    private bgTexture: egret.Texture;

    public constructor(text: string, tx: number, bgTexture: egret.Texture = null) {
        super();

        this.text = text;
        this.tx = tx;
        this.bgTexture = bgTexture;

        Utils.addListener(this, egret.Event.COMPLETE, this.onComplete);
        this.skinName = "resource/layout/simple_dialog_btn.exml";
    }

    private onComplete(event: egret.Event) {
        this.x = this.tx - this.width / 2;

        if (this.bgTexture) {
            this.imgBg.texture = this.bgTexture;
        }

        this.lbText.text = this.text;
    }
}