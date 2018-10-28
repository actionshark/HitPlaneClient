namespace download {
    export class ShowToast extends Download {
        public text: string;

        public perform() {
            Toast.showToast(this.text);
        }
    }
}