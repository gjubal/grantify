import { v4 as uuid } from 'uuid';
import ICreateUserDTO from '../../../../dtos/ICreateUserDTO';

import User from '../../entities/User';
import IUsersRepository from '../interfaces/IUsersRepository';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findById(id: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.id === id);

    return findUser;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.email === email);

    return findUser;
  }

  public async findAll(): Promise<User[]> {
    return this.users;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();

    user.id = uuid();
    user.firstName = userData.firstName;
    user.lastName = userData.lastName;
    user.email = userData.email;
    user.password = userData.password;

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users[findIndex] = user;

    return user;
  }

  public async delete(user: User): Promise<User> {
    this.users.filter(u => u.id !== user.id);

    return user;
  }
}

export default FakeUsersRepository;
