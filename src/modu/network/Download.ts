namespace download {
    export class Download {
        public type: string;

        public parse(json) {
            for (var key in json) {
                this[key] = json[key];
            }
        }

        public perform() {
            
        }
    }
}