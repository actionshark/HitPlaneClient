class StringUtil {
    private static MD5: md5 = new md5();
    public static md5(input: any): string {
        return StringUtil.MD5.hex_md5(input).toLowerCase();
    }

    private static HEX_STR: string = "0123456789abcdef";
    public static str2hex(input: string): string {
        var output: string = "";

        for (var i: number = 0; i < input.length; i++) {
            var cc: number = input.charCodeAt(i);

            output += StringUtil.HEX_STR.charAt((cc >>> 12) & 0x0f) +
                StringUtil.HEX_STR.charAt((cc >>> 8) & 0x0f) +
                StringUtil.HEX_STR.charAt((cc >>> 4) & 0x0f) +
                StringUtil.HEX_STR.charAt(cc & 0x0f);
        }

        return output;
    }
    public static hex2str(input: string): string {
        var ccs: number[] = [];

        for (var i: number = 0; i < input.length; i += 4) {
            var code: number = parseInt(input.substr(i, 4), 16);
            ccs.push(code);
        }

        return String.fromCharCode.apply(String, ccs);
    }

    public static formatLeftTime(target: number): string {
        var now: number = new Date().getTime();
        var delta: number = target - now;

        if (delta <= 0) {
            return "00:00";
        }

        delta = Math.floor(delta / 1000);
        var ret: string = StringUtil.numWidth(Math.floor(delta / 60) % 60, 2) + ":"
            + StringUtil.numWidth(delta % 60, 2);

        delta = Math.floor(delta / 3600);
        if (delta <= 0) {
            return ret;
        }

        ret = StringUtil.numWidth(delta, 2) + ":" + ret;
        return ret;
    }

    public static formatElapsedTime(target: number): string {
        var now: number = new Date().getTime();
        var delta: number = Math.floor((now - target) / 1000);

        if (delta < 60) {
            return "刚刚";
        }

        delta = Math.floor(delta / 60);
        if (delta < 60) {
            return delta + "分钟前";
        }

        delta = Math.floor(delta / 60);
        if (delta < 24) {
            return delta + "小时前";
        }

        delta = Math.floor(delta / 24);
        if (delta < 365) {
            return delta + "天前";
        }

        delta = Math.floor(delta / 365);
        return delta + "年前";
    }

    public static formatElapsedDate(target: number): string {
        var now: number = new Date().getTime();
        var delta: number = Math.floor((now - target) / 1000);

        if (delta < 60) {
            return "刚刚";
        }

        delta = Math.floor(delta / 60);
        if (delta < 60) {
            return delta + "分钟前";
        }

        delta = Math.floor(delta / 60);
        if (delta < 24) {
            return delta + "小时前";
        }

        var td: Date = new Date();
        td.setTime(target);

        return td.getFullYear() + "-" + StringUtil.numWidth(td.getMonth() + 1, 2) + "-" + StringUtil.numWidth(td.getDate(), 2);
    }

    public static numWidth(num: number, preWidth: number = 1, subWidth: number = 0): string {
        var pre: string = Math.floor(num).toString();

        while (pre.length < preWidth) {
            if (pre.charAt(0) == "-") {
                pre = "-0" + pre.substring(1);
            } else {
                pre = "0" + pre;
            }
        }

        var sub: string = "";

        for (var i: number = 0; i < subWidth; i++) {
            num = num * 10;
            sub = sub + num % 10;
        }

        if (sub && sub.length > 0) {
            return pre + "." + sub;
        } else {
            return pre;
        }
    }

    public static format(str: string, ...args): string {
        var result: string = str;

        if (args.length > 0) {
            if (args.length == 1 && typeof (args[0]) == "object") {
                for (var key in args[0]) {
                    var value = args[0][key];

                    if (value != undefined) {
                        var reg = new RegExp("({" + key + "})", "g");
                        result = result.replace(reg, value);
                    }
                }
            } else {
                for (var i = 0; i < args.length; i++) {
                    if (args[i] != undefined) {
                        var reg = new RegExp("({)" + i + "(})", "g");
                        result = result.replace(reg, args[i]);
                    }
                }
            }
        }

        return result;
    }

    public static cutText(tf: egret.TextField, numLines: number = 1) {
        if (tf.numLines <= numLines) {
            return;
        }

        var text: string = tf.text;
        var left: number = 0;
        var right: number = text.length;
        var ret: string = text;

        while (left <= right) {
            var mid: number = Math.floor((left + right) / 2);
            var txt: string = text.substring(0, mid) + "...";

            tf.text = txt;

            if (tf.numLines <= numLines) {
                ret = txt;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        tf.text = ret;
    }

    public static trimNum(num: number): string {
        num = Math.round(num * 1000000) / 1000000;

        var str: string = num + "";

        var index: number = str.lastIndexOf(".");
        if (index != -1) {
            var i = str.length - 1;

            while (i > index) {
                if (str.charAt(i) != "0") {
                    str = str.substr(0, i + 1);
                    break;
                }

                i--;
            }

            if (i == str.length - 1) {

            } else if (i == index) {
                str = str.substr(0, i);
            } else {
                str = str.substr(0, i + 1);
            }
        }

        return str;
    }

    public static startsWith(str: string, word: string): boolean {
        if (str.length < word.length) {
            return false;
        }

        return str.substr(0, word.length) == word;
    }

    public static endsWith(str: string, word: string): boolean {
        if (str.length < word.length) {
            return false;
        }

        return str.substr(str.length - word.length, word.length) == word;
    }
}