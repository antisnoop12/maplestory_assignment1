import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '@user/schemas/user.schema';
import { UserDto } from '@user/dto/user.dto';
import { PasswordUtil } from '@utils/util.password';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // 사용자 생성
  async create(userDto: UserDto): Promise<UserDocument> {
    // 이메일 중복 체크
    const existingUser = await this.userModel.findOne({ email: userDto.email });
    if (existingUser) {
      throw new ConflictException('이미 존재하는 이메일입니다');
    }

    // 비밀번호 해시화
    const hashedPassword = await PasswordUtil.hash(userDto.password);

    const newUser = new this.userModel({
      ...userDto,
      password: hashedPassword,
    });

    return await newUser.save();
  }

  // ID로 사용자 찾기
  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다');
    }
    return user;
  }

  // 이메일로 사용자 찾기
  async findByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다');
    }
    return user;
  }

  // 모든 사용자 조회
  async findAll(): Promise<UserDocument[]> {
    return await this.userModel.find();
  }

  // 사용자 정보 수정
  async update(id: string, userDto: UserDto): Promise<UserDocument> {
    // 비밀번호가 포함되어 있다면 해시화
    if (userDto.password) {
      userDto.setPassword(await PasswordUtil.hash(userDto.password));
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      userDto,
      { new: true }, // 업데이트된 문서 반환
    );

    if (!updatedUser) {
      throw new NotFoundException('사용자를 찾을 수 없습니다');
    }

    return updatedUser;
  }

  // 사용자 삭제
  async delete(id: string): Promise<UserDocument> {
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new NotFoundException('사용자를 찾을 수 없습니다');
    }
    return deletedUser;
  }
}
