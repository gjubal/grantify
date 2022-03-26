import { v4 as uuid } from 'uuid';
import ICreateExpenseDTO from '../../../../dtos/ICreateExpenseDTO';
import Expense from '../../entities/Expense';

import IExpensesRepository from '../interfaces/IExpensesRepository';

export default class FakeExpensesRepository implements IExpensesRepository {
  private expenses: Expense[] = [];

  public async findById(id: string): Promise<Expense | undefined> {
    const findExpense = this.expenses.find(expense => expense.id === id);

    return findExpense;
  }

  public async findAllByGrantId(id: string): Promise<Expense[]> {
    return this.expenses.filter(e => e.grantId === id);
  }

  public async queryByFilters(name: string, date: string): Promise<Expense[]> {
    const expenses = this.expenses.filter(
      expense => expense.name === name && expense.date === date,
    );

    return expenses;
  }

  public async create(expenseData: ICreateExpenseDTO): Promise<Expense> {
    const expense = new Expense();

    Object.assign(expense, { id: uuid() }, expenseData);

    this.expenses.push(expense);

    return expense;
  }

  public async save(expense: Expense): Promise<Expense> {
    const findIndex = this.expenses.findIndex(
      findExpense => findExpense.id === expense.id,
    );

    this.expenses[findIndex] = expense;

    return expense;
  }

  public async delete(expense: Expense): Promise<Expense> {
    const findExpense = expense;

    this.expenses = this.expenses.filter(e => e.id !== expense.id);

    return findExpense;
  }
}
