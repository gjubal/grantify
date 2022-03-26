import AppError from '../../../../common/errors/AppError';
import FakeExpensesRepository from '../../infra/db/repositories/fakes/FakeExpensesRepository';
import FakeGrantsRepository from '../../infra/db/repositories/fakes/FakeGrantsRepository';
import RemoveExpenseService from './RemoveExpenseService';

let fakeGrantsRepository: FakeGrantsRepository;
let fakeExpensesRepository: FakeExpensesRepository;
let removeExpense: RemoveExpenseService;

describe('RemoveGrant', () => {
  beforeEach(() => {
    fakeGrantsRepository = new FakeGrantsRepository();
    fakeExpensesRepository = new FakeExpensesRepository();

    removeExpense = new RemoveExpenseService(
      fakeGrantsRepository,
      fakeExpensesRepository,
    );
  });

  it('should throw exception if id provided does not exist', async () => {
    await expect(
      removeExpense.execute({
        id: '123456789',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should remove an expense whose id is valid', async () => {
    const grant = await fakeGrantsRepository.create({
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
      grantId: grant.id,
    });

    await removeExpense.execute({ id: e.id });

    expect(fakeExpensesRepository.findById(e.id)).toMatchObject({});
  });
});
