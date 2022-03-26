import { inject, injectable } from 'tsyringe';
import AppError from '../../../../common/errors/AppError';
import Expense from '../../infra/db/entities/Expense';
import IExpensesRepository from '../../infra/db/repositories/interfaces/IExpensesRepository';
import IGrantsRepository from '../../infra/db/repositories/interfaces/IGrantsRepository';

interface IRequest {
  id: string;
}

@injectable()
export default class RemoveExpenseService {
  constructor(
    @inject('GrantsRepository')
    private grantsRepository: IGrantsRepository,

    @inject('ExpensesRepository')
    private expensesRepository: IExpensesRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<Expense | undefined> {
    const expense = await this.expensesRepository.findById(id);

    if (!expense) {
      throw new AppError('An expense with the id provided does not exist.');
    }

    await this.expensesRepository.delete(expense);

    return expense;
  }
}
