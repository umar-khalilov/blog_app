import { Injectable } from '@nestjs/common';
import { hashPassword, validatePassword } from 'metautil';

@Injectable()
export class HashService {
    async convertToHashPassword(password: string): Promise<string> {
        return hashPassword(password);
    }

    async checkIsMatch(
        password: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return validatePassword(password, hashedPassword);
    }
}
