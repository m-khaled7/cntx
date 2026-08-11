import {
    IsEmail,
    IsString,
    MinLength,
    MaxLength,
    Matches,
} from 'class-validator';



// --- DTO ---
export class RegisterDto {
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(64, { message: 'Password must not exceed 64 characters' })
    @Matches(/(?=.*[a-z])/, {
        message: 'Password must contain at least one lowercase letter',
    })
    @Matches(/(?=.*[A-Z])/, {
        message: 'Password must contain at least one uppercase letter',
    })
    @Matches(/(?=.*\d)/, {
        message: 'Password must contain at least one number',
    })
    @Matches(/(?=.*[!@#$%^&*(),.?":{}|<>])/, {
        message: 'Password must contain at least one special character',
    })
    @Matches(/^\S*$/, {
        message: 'Password must not contain spaces',
    })
    password: string;

    @IsString()
    confirmPassword: string;
}
