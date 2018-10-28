class EventMgr extends egret.EventDispatcher {
    public static readonly USERINFO_CHANGE: string = "userinfo_change";

    private static _instance;
    public static get instance(): EventMgr {
        if (!EventMgr._instance) {
            EventMgr._instance = new EventMgr();
        }

        return EventMgr._instance;
    }

    public addAutoListener(view: egret.DisplayObject, type: string, listener: Function, thisObject: any,
            useCapture: boolean = false, priority: number = 0) {

        this.addEventListener(type, listener, thisObject, useCapture, priority);

        var remove = function() {
            this.removeEventListener(type, listener, thisObject, useCapture, priority);
            view.removeEventListener(egret.Event.REMOVED_FROM_STAGE, remove, this);
        };

        view.addEventListener(egret.Event.REMOVED_FROM_STAGE, remove, this);
    }
}