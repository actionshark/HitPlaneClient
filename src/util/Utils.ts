class Utils {
    public static addListener(view: any, type: string, listener: Function,
        thisObject: any = null, useCapture: boolean = false, priority: number = 0) {

        if (thisObject == null) {
            thisObject = view;
        }

        var callback = function (event: egret.Event) {
            view.removeEventListener(type, listener, thisObject, useCapture);
            view.removeEventListener(egret.Event.REMOVED_FROM_STAGE, callback, this);
        };

        view.addEventListener(type, listener, thisObject, useCapture, priority);
        view.addEventListener(egret.Event.REMOVED_FROM_STAGE, callback, this);
    }

    /**
     * 定时执行
     * @param {number} delay - 延迟时间，单位ms
     * @param {number} times - 次数，0代表一直循环
     * @param {Function} callback - 回调
     * @param {any} thisObject - callback的this，选填
     */
    public static timer(delay: number, times: number, callback: Function, thisObject: any): egret.Timer {
        if (!thisObject) {
            thisObject = this;
        }

        var timer: egret.Timer = new egret.Timer(delay, times);

        if (times > 0) {
            var fun: Function = function (event: egret.TimerEvent) {
                callback.call(thisObject, event);

                if (timer.repeatCount <= 1) {
                    timer.removeEventListener(egret.TimerEvent.TIMER, fun, thisObject);
                    timer.stop();
                }
            }

            timer.addEventListener(egret.TimerEvent.TIMER, fun, thisObject);
        } else {
            timer.addEventListener(egret.TimerEvent.TIMER, callback, thisObject);
        }

        timer.start();

        return timer;
    }

    // 从 [startInt, endInt] 中随机取一个整数
    public static randomInt(startInt: number, endInt: number): number {
        return startInt + Math.floor(Math.random() * (endInt - startInt + 1));
    }

    // 从 [startFloat, endFloat] 中随机取一个数
    public static randomFloat(startFloat: number, endFloat: number): number {
        return startFloat + Math.random() * (endFloat - startFloat);
    }

    public static randomArray(array: any[], startIdx: number = 0, endIdx: number = array.length - 1) {
        for (var i: number = startIdx; i <= endIdx; i++) {
            var idx: number = Utils.randomInt(startIdx, i);

            var temp = array[i];
            array[i] = array[idx];
            array[idx] = temp;
        }
    }

    public static convertScrollView(container: egret.DisplayObjectContainer): egret.ScrollView {
        var sv: egret.ScrollView = new egret.ScrollView();
        sv.x = 0;
        sv.y = 0;
        sv.width = container.width;
        sv.height = container.height;

        sv.setContent(container.getChildAt(0));
        container.addChild(sv);

        return sv;
    }

    public static merge(...args) {
        var ret = {};

        for (var i: number = 0; i < args.length; i++) {
            var arg = args[i];

            for (var key in arg) {
                ret[key] = arg[key];
            }
        }

        return ret;
    }

    public static addToList(dp: eui.ArrayCollection, info, key: string = "id"): boolean {
        for (var i: number = 0; i < dp.length; i++) {
            var item = dp.getItemAt(i);

            if (item[key] != undefined && item[key] == info[key]) {
                dp.replaceItemAt(info, i);
                return true;
            }
        }

        dp.addItem(info);
        return false;
    }

    public static longPress(node: egret.DisplayObject, callback: Function, thisObject) {
        var timer: egret.Timer;

        var run: Function = function () {
            callback.call(thisObject);
        };

        var stop: Function = function () {
            if (timer) {
                timer.stop();
                timer.removeEventListener(egret.TimerEvent.TIMER, run, this);
                timer = null;
            }
        };

        Utils.addListener(node, egret.TouchEvent.TOUCH_BEGIN, function () {
            run();

            timer = Utils.timer(200, 1, function () {
                timer = new egret.Timer(60);
                timer.addEventListener(egret.TimerEvent.TIMER, run, this);
                timer.start();
            }, this);
        }, this);

        Utils.addListener(node, egret.TouchEvent.TOUCH_END, stop, this);
        Utils.addListener(node, egret.TouchEvent.TOUCH_CANCEL, stop, this);
        Utils.addListener(node, egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, stop, this);
    }
}