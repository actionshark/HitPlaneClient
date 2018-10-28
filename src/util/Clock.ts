class Clock {
    private static delta: number = 0;

    public static getTime(): number {
        return new Date().getTime() + Clock.delta;
    }

    public static adjustTime(time: number) {
        Clock.delta = time - new Date().getTime();
    }
}