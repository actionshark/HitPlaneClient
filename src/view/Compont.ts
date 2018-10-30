namespace eui {
    export class Compont extends Component {
        public constructor(exmlName: string, ...args) {
            super();

            Utils.addListener(this, egret.Event.COMPLETE, function () {
                this.onComplete.call(this, ...args);
            }, this);

            this.skinName = "resource/layout/" + exmlName + ".exml";
        }

        public onComplete(...args) {
        }
    }
}