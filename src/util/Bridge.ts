class Bridge {
    public static callNative(methodName: string, params: any = null) {
        egret.ExternalInterface.call(methodName, params ? JSON.stringify(params) : "{}");
    }

    public static register() {
        egret.ExternalInterface.addCallback("deviceInfo", function (message: string) {
            var json = JSON.parse(message);

            Main.instance.screenWidth = json.screenWidth;
            Main.instance.screenHeight = json.screenHeight;

            Me.deviceId = StringUtil.md5(json.deviceId);
        });

        var backDownTime: number = 0;
        egret.ExternalInterface.addCallback("onBackDown", function (message: string) {
            if (!Hall.instance) {
                return;
            }

            var options: any = Main.instance.pickWindow();

            if (options == null) {
                var now: number = new Date().getTime();

                if (now - backDownTime > 1000) {
                    Toast.showToast("连续按返回键退出");
                    backDownTime = now;
                } else {
                    Bridge.callNative("exitApp");
                }
            }

            var onBackDown: Function = options.onBackDown;
            if (!onBackDown || !onBackDown()) {
                Main.instance.removeWindow(options.window);
            }
        });
    }
}