import { AbstractControl, ValidatorFn, FormControl } from '@angular/forms';

export class CustomValidator {

    static ageRestrictValidator(type) {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (control.value !== '') {
                const date = new Date();
                const cDate = new Date(control.value);
                const year = date.getFullYear();
                const cYear = cDate.getFullYear();
                const age = Number(year) - Number(cYear);
                console.log(( age < 18 || age > 64));
                console.log(age);
                if (type === 'Adult' && ( age < 18 || age > 64) === true) {
                    return {ageRestrict: true};
                } else if (type === 'Senior Citizen' && age < 65 === true) {
                    return {ageRestrict: true};
                } else if (type === 'Youth' && ( age < 12 || age > 17) === true) {
                    return {ageRestrict: true};
                } else if (type === 'Child' && ( age < 2 || age > 12) === true) {
                    return {ageRestrict: true};
                } else if ((type === 'Seat Infant' || type === 'Lap Infant') && age > 2 === true) {
                    return {ageRestrict: true};
                }
            }
            return null;
          };
    }

    static verifyPassword(npw) {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (control.value !== '') {
                console.log(control.value + ' = ' + npw);
                if (control.value !== npw) {
                    return {notSame: true};
                }
            }
            return null;
          };
    }

}
