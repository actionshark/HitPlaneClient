namespace upload {
    export class Upload {
        public name: string;

        public constructor() {
            var className: string = this["__class__"];
            var index: number = className.indexOf(".");
            this.name = className.substring(index + 1, className.length);
        }

        public pack(): any {
            var data: any = {};

            for (var key in this) {
                var value = this[key];

                if (!StringUtil.startsWith(key, "_") && typeof (value) != "function") {
                    data[key] = value;
                }
            }

            return data;
        }

        public send(): boolean {
            var data = this.pack();
            var str: string = JSON.stringify(data);
            return Connection.instance.send(str);
        }
    }
}