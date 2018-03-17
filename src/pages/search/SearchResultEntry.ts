class SearchResultEntry {

    private _id: number;
    private _title: string;
    private _foregroundColor: string;
    private _backgroundColor: string;
    private _type: string;
    private _date: number;

    constructor(id: number,
        title: string,
        foregroundColor: string,
        backgroundColor: string,
        type: string,
        date: number) {

        this._id = id;
        this._title = title;
        this._foregroundColor = foregroundColor;
        this._backgroundColor = backgroundColor;
        this._type = type;
        this._date = date;
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

    get date(): number {
        return this._date;
    }

    set date(_date: number) {
        this._date = _date;
    }

}
export { SearchResultEntry }
