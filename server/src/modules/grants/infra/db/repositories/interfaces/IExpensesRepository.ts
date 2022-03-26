import ICreateExpenseDTO from '../../../../dtos/ICreateExpenseDTO';
import Expense from '../../entities/Expense';

export default interface IExpensesRepository {
  findById(id: string): Promise<Expense | undefined>;
  findAllByGrantId(id: string): Promise<Expense[]>;
  queryByFilters(name: string, date: string): Promise<Expense[]>;
  create(data: ICreateExpenseDTO): Promise<Expense>;
  save(grant: Expense): Promise<Expense>;
  delete(grant: Expense): Promise<Expense>;
}
