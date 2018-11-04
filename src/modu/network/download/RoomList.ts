namespace download {
    export class User {
        public id: number;
        public nickname: string;
        public status: boolean;
    }

    export class Room {
        public id: number;
        public running: boolean;
        public users: User[];
    }

    export class RoomList extends Download {
        public rooms: Room[];

        public perform() {
            Hall.instance.onRoomList(this.rooms);
        }
    }
}