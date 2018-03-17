class TextNote {

    private _id: number;
    private _date: number;

    private _title: string;
    private _text: string;

    private _color: string;

    private _checked: number;

    constructor() {

    }

    param_constructor(id: number,
        date: number,
        title: string,
        text: string, 
        color: string, 
        checked: number){
        
        this._id = id;
        this._date = date;
        this._title = title;
        this._text = text;
        this._color = color;
        this._checked = checked;

        return this;
    }

    get date(): number{
        return this._date;
    }

    set date(_date: number){
        this._date = _date;
    }

    get title(): string {
        return this._title;
    }

    set title(title: string) {
        this._title = title;
    }

    get text(): string {
        return this._text;
    }

    set text(text: string) {
        this._text = text;
    }

    get color(): string {
        return this._color;
    }

    set color(color: string) {
        this._color = color;
    }

    get checked(): number {
        return this._checked;
    }

    set checked(checked: number) {
        this._checked = checked;
    }

    get id(): number {
        return this._id;
    }

    set id(id: number) {
        this._id = id;
    }

}
export {TextNote};
