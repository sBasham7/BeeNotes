import { Injectable } from '@angular/core';

function _navigator(): any {
  return navigator;
}
function _window(): any {
  return window;
}

@Injectable()
export class WindowRef {
  get nativeWindow(): any {
    return _window();
  }
  get nativeNavigator(): any {
  return _navigator();
  }
  public invertColor(hex: string, bw: boolean) {

    if (hex || hex !== null || hex !== undefined) {

      if (hex.indexOf('#') === 0) {
          hex = hex.slice(1);
      }
      // convert 3-digit hex to 6-digits.
      if (hex.length === 3) {
          hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);

      if (bw) {
          // http://stackoverflow.com/a/3943023/112731
          return (r * 0.299 + g * 0.587 + b * 0.114) > 186
              ? '#000000'
              : '#FFFFFF';
      }
      // invert color components
      const rString = (255 - r).toString(16);
      const gString = (255 - g).toString(16);
      const bString = (255 - b).toString(16);
      // pad each with zeros and return

      return '#' + this.padZero(rString, rString.length) + 
        this.padZero(gString, gString.length) + 
        this.padZero(bString, bString.length);
    } else {

      console.log(hex);
  
      return '#000000';
    }
  }
  padZero (str: string, len: number) {
    len = len || 2;
    const zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
  }
}
