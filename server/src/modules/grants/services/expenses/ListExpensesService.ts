import { inject, injectable } from 'tsyringe';
import AppError from '../../../../common/errors/AppError';
import Expense from '../../infra/db/entities/Expense';
import IExpensesRepository from '../../infra/db/repositories/interfaces/IExpensesRepository';
import IGrantsRepository from '../../infra/db/repositories/interfaces/IGrantsRepository';

interface IQueryRequest {
  name: string;
  date: string;
  grantId: string;
}

@injectable()
export default class ListExpensesService {
  constructor(
    @inject('GrantsRepository')
    private grantsRepository: IGrantsRepository,

    @inject('ExpensesRepository')
    private expensesRepository: IExpensesRepository,
  ) {}
  public async findAllByGrantId(id: string): Promise<Expense[]> {
    const grant = await this.grantsRepository.findById(id);

    if (!grant) {
      throw new AppError('A grant with the provided id does not exist.');
    }

    const expenses = await this.expensesRepository.findAllByGrantId(grant.id);

    return expenses;
  }

  public async queryByFilters({
    name,
    date,
    grantId,
  }: IQueryRequest): Promise<Expense[]> {
    const grant = await this.grantsRepository.findById(grantId);

    if (!grant) {
      throw new AppError('A grant with the provided id does not exist.');
    }

    const expenses = await this.expensesRepository.queryByFilters(name, date);

    return expenses;
  }
}
