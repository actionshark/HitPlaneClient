namespace download {
    export class UserList extends Download {
        public list;

        public perform() {
            var ul: UserInfo[] = [];

            for (var i: number = 0; i < this.list.length; i++) {
                var item = this.list[i];
                var ui: UserInfo = new UserInfo();

                ui.id = item.id;
                ui.nickname = item.nickname;
                ui.status = item.status;

                ul.push(ui);
            }

            Hall.instance.onUserList(ul);
        }
    }
}