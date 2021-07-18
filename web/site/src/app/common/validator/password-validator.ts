import { AbstractControl, ValidationErrors } from '@angular/forms';

export class PasswordValidator {
    static validateSamePassword(oldPassword: string, newPassword: string) {
        return (fg: AbstractControl): ValidationErrors | null => {
            if (fg.get(oldPassword).dirty && fg.get(newPassword).dirty
                && fg.get(oldPassword).value === fg.get(newPassword).value) {
                return { 'samePassword': true };
            }
            return null;
        };
    }
    static validateConfirmPassword(newPassword: string, confirmPassword: string) {
        return (fg: AbstractControl): ValidationErrors | null => {
            if (fg.get(newPassword).dirty && fg.get(confirmPassword).dirty
                && fg.get(newPassword).value !== fg.get(confirmPassword).value) {
                return { 'confirmPassword': true };
            }
            return null;
        };
    }
}
