class EditDialog extends eui.Compont {
    public static showEditDialog(data) {
        var main: Main = Main.instance;

        var window: EditDialog = new EditDialog(data);
        window.x = (main.stage.stageWidth - window.width) / 2;
        window.y = (main.stage.stageHeight - window.height) / 2;

        main.showWindow({
            window: window,
        });
    }

    ////////////////////////////////////////////////////////////

    private lbHint: eui.Label;

    private etInput: eui.EditableText;

    private groupCancel: eui.Group;
    private groupConfirm: eui.Group;

    private data;

    private constructor(data) {
        super("edit_dialog", data);
    }

    public onComplete(data) {
        this.data = data;
        
        this.lbHint.text = this.data.hintText || "点击下方输入";

        this.etInput.text = this.data.inputDefault || "";
        this.etInput.prompt = this.data.inputPrompt || "点击输入";
        this.etInput.maxChars = this.data.maxChars || 20;

        Utils.addListener(this.groupCancel, egret.TouchEvent.TOUCH_TAP, function () {
            if (this.data.onCancel) {
                var notClose: boolean = this.data.onCancel.call(this.data.thisObject);

                if (notClose) {
                    return;
                }
            }

            this.close();
        }, this);

        Utils.addListener(this.groupConfirm, egret.TouchEvent.TOUCH_TAP, function () {
            var notClose: boolean = this.data.onConfirm.call(this.data.thisObject, this.etInput.text);

            if (notClose) {
                return;
            }

            this.close();
        }, this);
    }

    private close() {
        Main.instance.removeWindow(this);
    }
}