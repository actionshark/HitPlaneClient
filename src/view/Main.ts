class Main extends eui.Component {
    private static _instance: Main;
    public static get instance(): Main {
        return Main._instance;
    }

    /////////////////////////////////////////////////////////////////////////////////////////

    private windows: any = [];

    public screenWidth: number;
    public screenHeight: number;

    private launchCompleted: boolean = false;

    public constructor() {
        super();

        Main._instance = this;

        Bridge.register();
    }

    protected createChildren(): void {
        super.createChildren();

        egret.lifecycle.addLifecycleListener(function (context) {
        })

        egret.lifecycle.onPause = function () {
            egret.ticker.pause();

            Main.instance.onPause();
        }

        egret.lifecycle.onResume = function () {
            egret.ticker.resume();

            Main.instance.onResume();
        }

        egret.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

        var pl: PreviewLoading = new PreviewLoading();
        this.addChild(pl);
        pl.start();
    }

    public onResume() {
        if (!this.launchCompleted) {
            return;
        }
    }

    public onPause() {
        if (!this.launchCompleted) {
            return;
        }
    }

    /////////////////////////////////////////////////////////////////////////////////////////

    public pickWindow(): any {
        if (this.windows.length > 0) {
            return this.windows[this.windows.length - 1];
        }

        return null;
    }

    public popWindow(): any {
        var options = this.pickWindow();

        if (options) {
            this.removeWindow(options.window);
        }

        return options;
    }

    public removeWindow(window: egret.DisplayObject): boolean {
        var length: number = this.windows.length;

        for (var i: number = length - 1; i >= 0; i--) {
            if (window == this.windows[i].window) {
                this.windows.splice(i, 1);

                if (window.parent) {
                    window.parent.removeChild(window);
                }

                if (i == length - 1) {
                    if (window["onPause"]) {
                        window["onPause"].call(window);
                    }

                    var temp: any = this.pickWindow();
                    if (temp && temp.window.onResume) {
                        temp.window.onResume.call(temp.window);
                    }
                }

                return true;
            }
        }

        return false;
    }

    public clearWindows() {
        while (this.popWindow());
    }

    public get numWindows(): number {
        return this.windows.length;
    }

    public showWindow(options: any) {
        var window: egret.DisplayObject = options.window;

        if (!options.through) {
            var rect: eui.Rect = new eui.Rect(this.stage.stageWidth, this.stage.stageHeight);

            if (typeof (options.bgColor) == "number") {
                rect.fillColor = options.bgColor;
            } else {
                rect.fillColor = 0x000000;
            }

            if (typeof (options.bgAlpha) == "number") {
                rect.alpha = options.bgAlpha;
            } else {
                rect.alpha = 0.3;
            }

            Utils.addListener(rect, egret.TouchEvent.TOUCH_TAP, function (event: egret.TouchEvent) {
                if (window.hitTestPoint(event.stageX, event.stageY, false)) {
                    return;
                }

                if (options.touchOutside == true) {
                    this.removeWindow(window);
                } else if (typeof (options.touchOutside) == "function") {
                    options.touchOutside.call(options.thisObject || window);
                }
            }, this);

            Utils.addListener(window, egret.Event.REMOVED_FROM_STAGE, function () {
                this.removeChild(rect);
            }, this);

            this.addChild(rect);
        }

        if (options.fullScreen) {
            window.height = this.stage.stageHeight;
        }

        if (window.parent) {
            window.parent.removeChild(window);
        }
        this.addChild(window);

        if (!options.special) {
            this.windows.push(options);

            Utils.addListener(window, egret.Event.REMOVED_FROM_STAGE, function (event: egret.Event) {
                this.removeWindow(window);
            }, this);

            if (this.windows.length > 1) {
                var temp: any = this.windows[this.windows.length - 2]
                if (temp.window.onPause) {
                    temp.onPuase.call(temp.window);
                }
            }

            if (window["onResume"]) {
                window["onResume"].call(window);
            }
        }
    }
}