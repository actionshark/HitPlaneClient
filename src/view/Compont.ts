namespace eui {
    export class Compont extends Component {
        public constructor(exmlName: string) {
            super();

            Utils.addListener(this, egret.Event.COMPLETE, this.onComplete, this);
            this.skinName = "resource/layout/" + exmlName + ".exml";
        }

        public onComplete(event: egret.Event) {
        }
    }
}