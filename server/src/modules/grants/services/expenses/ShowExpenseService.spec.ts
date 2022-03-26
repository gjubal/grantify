import AppError from '../../../../common/errors/AppError';
import FakeExpensesRepository from '../../infra/db/repositories/fakes/FakeExpensesRepository';
import FakeGrantsRepository from '../../infra/db/repositories/fakes/FakeGrantsRepository';
import ShowExpenseService from './ShowExpenseService';

let fakeGrantsRepository: FakeGrantsRepository;
let fakeExpensesRepository: FakeExpensesRepository;
let showExpense: ShowExpenseService;

describe('ShowExpense', () => {
  beforeEach(() => {
    fakeGrantsRepository = new FakeGrantsRepository();
    fakeExpensesRepository = new FakeExpensesRepository();

    showExpense = new ShowExpenseService(
      fakeGrantsRepository,
      fakeExpensesRepository,
    );
  });

  it('should be able to show an expense based on its id', async () => {
    const g = await fakeGrantsRepository.create({
      grantName: 'COVID Grant Fall 2021',
      openDate: new Date('2021-10-18T03:24:00'),
      closeDate: new Date('2021-10-25T03:24:00'),
      status: 'Pending',
      amountRequested: 2000.0,
      amountApproved: 1000.0,
      writerName: 'Bruce Wayne',
      applicationUrl: 'www.unf.edu',
      sponsoringAgency: 'Wayne Enterprises',
      dateWhenFundsWereReceived: new Date('2021-10-21T03:24:00'),
      expirationDate: new Date('2021-12-30T03:24:00'),
      notes: 'Lorem ipsum',
    });

    const e = await fakeExpensesRepository.create({
      name: 'Salaries',
      lineItemCode: 1,
      budget: 3000,
      amountSpent: 400.59,
      date: '06/2021',
      grantId: g.id,
    });

    const expense = await showExpense.execute({ id: e.id });

    expect(expense?.id).toEqual(e.id);
  });

  it('should not show an expense whose id does not exist', async () => {
    const grant = await fakeGrantsRepository.create({
      grantName: 'SG Grant Fall 2021',
      openDate: new Date('2021-10-18T03:24:00'),
      closeDate: new Date('2021-10-25T03:24:00'),
      status: 'Approved',
      amountRequested: 3000.99,
      amountApproved: 1500.34,
      writerName: 'Bruce Wayne',
      applicationUrl: 'www.unf.edu',
      sponsoringAgency: 'Wayne Enterprises',
      dateWhenFundsWereReceived: new Date('2021-10-21T03:24:00'),
      expirationDate: new Date('2021-12-30T03:24:00'),
      notes: 'Lorem ipsum',
    });

    const e = await fakeExpensesRepository.create({
      name: 'Salaries',
      lineItemCode: 1,
      budget: 3000,
      amountSpent: 400.59,
      date: '06/2021',
      grantId: grant.id,
    });

    await expect(showExpense.execute({ id: '123456' })).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
