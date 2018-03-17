class CalendarDay{

    private _date: Date;

    private _dayName: string;
    private _dayNumber: number;

    private _foregroundColor: string;
    private _backgroundColor: string;

    constructor(date: Date,
            dayName: string, 
            dayNumber: number, 
            foregroundColor: string, 
            backgroundColor: string){
        
        this._date = date;
        this._dayName = dayName;
        this._dayNumber = dayNumber;
        this._foregroundColor = foregroundColor;
        this._backgroundColor = backgroundColor;

    }

    get date(): Date{
        return this._date;
    }

    set date(_date: Date){
        this._date = _date;
    }

    get dayName(): string {
        return this._dayName;
    }

    set dayName(dayName: string) {
        this._dayName = dayName;
    }

    get dayNumber(): number {
        return this._dayNumber;
    }

    set dayNumber(dayNumber: number) {
        this._dayNumber = dayNumber;
    }

    get foregroundColor(): string {
        return this._foregroundColor;
    }

    set foregroundColor(foregroundColor: string) {
        this._foregroundColor = foregroundColor;
    }

    get backgroundColor(): string {
        return this._backgroundColor;
    }

    set backgroundColor(backgroundColor: string) {
        this._backgroundColor = backgroundColor;
    }

    get height(): string {
        return '98%';
    }

    set height(height: string) {
    }

}

export {CalendarDay};
