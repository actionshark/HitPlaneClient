class Bridge {
    public static callNative(methodName: string, params: any = null) {
        egret.ExternalInterface.call(methodName, params ? JSON.stringify(params) : "{}");
    }

    public static register() {
        egret.ExternalInterface.addCallback("deviceInfo", function (message: string) {
            var json = JSON.parse(message);

            Main.instance.screenWidth = json.screenWidth;
            Main.instance.screenHeight = json.screenHeight;

            if (json.contentHeight && json.contentHeight > 0) {
                Main.instance.screenHeight = json.contentHeight;
            }
        });
    }
}