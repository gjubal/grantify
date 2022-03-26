import { getRepository, Repository } from 'typeorm';

import IExpensesRepository from './interfaces/IExpensesRepository';
import Expense from '../entities/Expense';
import ICreateExpenseDTO from '../../../dtos/ICreateExpenseDTO';

export default class ExpensesRepository implements IExpensesRepository {
  private ormRepository: Repository<Expense>;

  constructor() {
    this.ormRepository = getRepository(Expense);
  }

  public async findById(id: string): Promise<Expense | undefined> {
    const expense = await this.ormRepository.findOne(id);

    return expense;
  }

  public async findAllByGrantId(id: string): Promise<Expense[]> {
    const expenses = await this.ormRepository.find({ where: { grantId: id } });

    return expenses;
  }

  public async queryByFilters(name: string, date: string): Promise<Expense[]> {
    const expenses = await this.ormRepository.find({
      where: {
        name,
        date,
      },
    });

    return expenses;
  }

  public async create(expenseData: ICreateExpenseDTO): Promise<Expense> {
    const expense = this.ormRepository.create(expenseData);

    await this.ormRepository.save(expense);

    return expense;
  }

  public async save(expense: Expense): Promise<Expense> {
    return this.ormRepository.save(expense);
  }

  public async delete(expense: Expense): Promise<Expense> {
    return this.ormRepository.remove(expense);
  }
}
