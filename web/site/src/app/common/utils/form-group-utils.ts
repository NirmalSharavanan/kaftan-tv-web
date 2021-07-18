import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';



export class FormGroupUtils {
    static applyValue(fg: FormGroup, input: Object): FormGroup {
        if (input && fg) {
            Object.keys(fg.controls).forEach(key => {
                if (input.hasOwnProperty(key)) {
                    if (fg.get(key) instanceof FormControl) {
                        fg.get(key).setValue(input[key]);
                    } else {

                    }
                }
            });
        }
        return fg;
    }

    static extractValue(fg: FormGroup, input: Object): any {
        if (input && fg) {
            Object.keys(fg.controls).forEach(key => {
                if (input.hasOwnProperty(key)) {
                    if (fg.get(key) instanceof FormControl) {
                        input[key] = fg.get(key).value;
                    } else {

                    }
                }
            });
        }
        return input;
    }
}
