import AppError from '../../../../common/errors/AppError';
import FakeAttachmentsRepository from '../../infra/db/repositories/fakes/FakeAttachmentsRepository';
import FakeGrantsRepository from '../../infra/db/repositories/fakes/FakeGrantsRepository';
import ListAttachmentsService from './ListAttachmentsService';

let fakeGrantsRepository: FakeGrantsRepository;
let fakeAttachmentsRepository: FakeAttachmentsRepository;
let listAttachments: ListAttachmentsService;

describe('ListAttachments', () => {
  beforeEach(() => {
    fakeGrantsRepository = new FakeGrantsRepository();
    fakeAttachmentsRepository = new FakeAttachmentsRepository();

    listAttachments = new ListAttachmentsService(
      fakeGrantsRepository,
      fakeAttachmentsRepository,
    );
  });

  it('should be able to list all attachments given a grant id', async () => {
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

    await fakeAttachmentsRepository.create({
      name: 'Salaries',
      link: 'google.com',
      grantId: grant.id,
    });

    const attachments = await listAttachments.findAllByGrantId(grant.id);

    expect(attachments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: expect.stringMatching('Salaries'),
        }),
      ]),
    );
    expect(attachments).toHaveLength(1);
  });

  it('should not be able to list attachments for a non-existing grant id', async () => {
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

    await fakeAttachmentsRepository.create({
      name: 'Salaries .pdf',
      link: 'google.com',
      grantId: grant.id,
    });

    await expect(
      listAttachments.findAllByGrantId('12345678'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
