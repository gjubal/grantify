import { inject, injectable } from 'tsyringe';

import AppError from '../../../common/errors/AppError';
import IUsersRepository from '../infra/db/repositories/interfaces/IUsersRepository';
import User from '../infra/db/entities/User';

interface IRequest {
  userId: string;
}

@injectable()
class DeleteUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ userId }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('The user specified does not exist.');
    }

    await this.usersRepository.delete(user);

    return user;
  }
}

export default DeleteUserService;
