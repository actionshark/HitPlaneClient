namespace download {
    export class NoticeTime extends Download {
        public time: number;

        public perform() {
            Clock.adjustTime(this.time);
        }
    }
}