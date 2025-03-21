import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Verificar se o e-mail já está em uso
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('E-mail já está em uso');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Criar usuário com senha hasheada
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return newUser.save();
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    // Se estiver atualizando a senha, precisamos hashear
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
      
    if (!updatedUser) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    
    return updatedUser;
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, {
      lastLogin: new Date(),
    }).exec();
  }

  async remove(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    return deletedUser;
  }
} 