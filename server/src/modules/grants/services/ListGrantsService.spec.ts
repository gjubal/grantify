import FakeGrantsRepository from '../infra/db/repositories/fakes/FakeGrantsRepository';
import ListGrantService from './ListGrantsService';

let fakeGrantsRepository: FakeGrantsRepository;
let listGrant: ListGrantService;

describe('ListGrants', () => {
  beforeEach(() => {
    fakeGrantsRepository = new FakeGrantsRepository();

    listGrant = new ListGrantService(fakeGrantsRepository);
  });

  it('should be able to list all grants with the same writer name', async () => {
    await fakeGrantsRepository.create({
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
    });

    await fakeGrantsRepository.create({
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
    });

    const grants = await listGrant.findByWriterName({
      writerName: 'Bruce Wayne',
    });

    expect(grants).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          writerName: expect.stringMatching('Bruce Wayne'),
        }),
      ]),
    );
    expect(grants).toHaveLength(2);
  });

  it('should be able to list grants specific grant name', async () => {
    await fakeGrantsRepository.create({
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
    });

    await fakeGrantsRepository.create({
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
    });

    const grant = await listGrant.findByGrantName({
      grantName: 'COVID Grant Fall 2021',
    });

    expect(grant?.writerName).toEqual('Bruce Wayne');
  });

  it('should be able to list all grants', async () => {
    await fakeGrantsRepository.create({
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
    });

    await fakeGrantsRepository.create({
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
    });

    const grants = await listGrant.findAll();

    expect(grants).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          grantName: expect.stringMatching('SG Grant Fall 2021'),
        }),
      ]),
    );
    expect(grants).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          grantName: expect.stringMatching('COVID Grant Fall 2021'),
        }),
      ]),
    );
    expect(grants).toHaveLength(2);
  });
});
