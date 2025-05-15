import * as bcrypt from 'bcrypt';

export class PasswordUtil {
  // 비밀번호 암호화
  static async hash(password: string): Promise<string> {
    const saltRounds = 10; //보안 강도
    return await bcrypt.hash(password, saltRounds);
  }

  // 비밀번호 비교
  static async compare(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
