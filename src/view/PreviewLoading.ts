class PreviewLoading extends eui.Component {
    private listeners : any[] = [];

    private lbHint : eui.Label;

    public async start() {
        var self : PreviewLoading = this;

        self.createHint();

        await new Promise(function(resolve, reject) {
            self.setHint("加载配置");

            self.addListener(RES, RES.ResourceEvent.CONFIG_COMPLETE, function() {
                resolve();
            }, self);
            RES.loadConfig(Config.DEF_RES_PATH, "resource/");
        });

        Utils.timer(10, 1, function() {
            Bridge.callNative("onLoadStart");
        }, this);

        await new Promise(function(resolve, reject) {
            self.setHint("加载资源");

            self.addListener(RES, RES.ResourceEvent.ITEM_LOAD_ERROR, function() {
                self.setHint("item load error");
            }, self);
            self.addListener(RES, RES.ResourceEvent.GROUP_LOAD_ERROR, function() {
                self.setHint("group load error");
            }, self);
            self.addListener(RES, RES.ResourceEvent.GROUP_PROGRESS, function(event: RES.ResourceEvent) {
                self.setHint("加载资源 " + event.itemsLoaded + " / " + event.itemsTotal);
            }, self);
            self.addListener(RES, RES.ResourceEvent.GROUP_COMPLETE, function() {
                resolve();
            }, self);
            RES.loadGroup("preload");
        });

        await new Promise(function(resolve, reject) {
            self.setHint("加载布局");

            var theme : eui.Theme = new eui.Theme("resource/default.thm.json", self.stage);
            self.addListener(theme, egret.Event.COMPLETE, function() {
                resolve();
            }, self);
        });

        self.setHint("进入应用");

        this.parent.removeChild(this);
        Main.instance.showWindow({
            window : Hall.instance,
            through : true,
            special : true,
        });

        self.removeListeners();
    }

    private createHint() {
        var stage : egret.Stage = Main.instance.stage;

        var bg : eui.Rect = new eui.Rect(stage.stageWidth, stage.stageHeight, 0xcccccc);
        this.addChild(bg);

        this.lbHint = new eui.Label();
        this.lbHint.size = 60;
        this.lbHint.width = stage.stageWidth;
        this.lbHint.height = stage.stageHeight;
        this.lbHint.textAlign = egret.HorizontalAlign.CENTER;
        this.lbHint.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.lbHint.textColor = 0x666666;
        this.addChild(this.lbHint);
    }

    private addListener(obj : any, name : string, callback : Function, thisObject : any) {
        this.listeners.push({
            obj : obj,
            name : name,
            callback : callback,
            thisObject : thisObject,
        });

        obj.addEventListener(name, callback, thisObject);
    }

    private removeListeners() {
        for (var i : number = 0; i < this.listeners.length; i++) {
            var item : any = this.listeners[i];

            item.obj.removeEventListener(item.name, item.callback, item.thisObject);
        }

        this.listeners.length = 0;
    }

    private setHint(text : string) {
        this.lbHint.text = text;
    }
}