import { Injectable } from '@nestjs/common';
import { hashPassword, validatePassword } from 'metautil';

@Injectable()
export class HashService {
    public async convertToHashPassword(password: string): Promise<string> {
        return hashPassword(password);
    }

    public async checkIsMatch(
        password: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return validatePassword(password, hashedPassword);
    }
}
