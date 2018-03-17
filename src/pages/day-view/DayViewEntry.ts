class DayViewEntry {

    private _id: number;
    private _title: string;
    private _foregroundColor: string;
    private _backgroundColor: string;
    private _type: string;

    constructor(id: number, 
        title: string,
        foregroundColor: string, 
        backgroundColor: string,
        type: string){

      this._id = id;
      this._title = title;
      this._foregroundColor = foregroundColor;
      this._backgroundColor = backgroundColor;
      this._type = type;

    }

    get id(): number {
        return this._id;
    }

    set id(id: number) {
        this._id = id;
    }

    get title(): string {
        return this._title;
    }

    set title(title: string) {
        this._title = title;
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

    get type(): string {
        return this._type;
    }

    set type(type: string) {
        this._type = type;
    }

}
export {DayViewEntry}
