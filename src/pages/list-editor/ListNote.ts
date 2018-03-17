class ListNote {
    private _id: number;
    private _date: number;

    private _title: string;
    
    private _color: string;

    constructor() {

    }

    param_constructor(id: number,
        date: number,
        title: string,
        color: string, 
        checked: number) {
        
        this._id = id;
        this._date = date;
        this._title = title;
        this._color = color;

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

    get color(): string {
        return this._color;
    }

    set color(color: string) {
        this._color = color;
    }

    get id(): number {
        return this._id;
    }

    set id(id: number) {
        this._id = id;
    }

}
export {ListNote};