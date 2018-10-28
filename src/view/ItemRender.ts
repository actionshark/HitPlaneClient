namespace eui {
    export class ItemRender extends ItemRenderer {
        protected inited: boolean = false;

        public constructor(exmlName: string) {
            super();

            Utils.addListener(this, egret.Event.COMPLETE, function () {
                this.inited = true;

                this.onCreate();

                this.dataChanged();
            }, this);

            this.skinName = "resource/layout/" + exmlName + ".exml";
        }

        public dataChanged() {
            if (this.inited && this.data) {
                this.onUpdate();
            }
        }

        public onCreate() {
        }

        public onUpdate() {
        }
    }
}