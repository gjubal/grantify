import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateExpenseService from '../../../services/expenses/CreateExpenseService';
import ListExpensesService from '../../../services/expenses/ListExpensesService';
import RemoveExpenseService from '../../../services/expenses/RemoveExpenseService';
import ShowExpenseService from '../../../services/expenses/ShowExpenseService';

export default class ExpensesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { grantId } = request.params;

    const listExpenses = container.resolve(ListExpensesService);

    const expenses = await listExpenses.findAllByGrantId(grantId);

    return response.json(expenses);
  }

  public async query(request: Request, response: Response): Promise<Response> {
    const { id: grantId } = request.params;
    const { name, date } = request.query as { name: string; date: string };

    const listExpenses = container.resolve(ListExpensesService);

    const expenses = await listExpenses.queryByFilters({ name, date, grantId });

    return response.json(expenses);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { expenseId } = request.params;

    const showExpense = container.resolve(ShowExpenseService);

    const expense = await showExpense.execute({ id: expenseId });

    return response.json(expense);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, lineItemCode, budget, amountSpent, date } = request.body;
    const { grantId } = request.params;

    const createExpense = container.resolve(CreateExpenseService);

    const expense = await createExpense.execute({
      name,
      lineItemCode,
      budget,
      amountSpent,
      date,
      grantId,
    });

    return response.json(expense);
  }

  public async destroy(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { expenseId } = request.params;

    const deleteExpense = container.resolve(RemoveExpenseService);

    const expense = await deleteExpense.execute({
      id: expenseId,
    });

    return response.json(expense);
  }
}
