import AppError from '../../../../common/errors/AppError';
import FakeAttachmentsRepository from '../../infra/db/repositories/fakes/FakeAttachmentsRepository';
import FakeGrantsRepository from '../../infra/db/repositories/fakes/FakeGrantsRepository';
import ShowAttachmentService from './ShowAttachmentService';

let fakeGrantsRepository: FakeGrantsRepository;
let fakeAttachmentsRepository: FakeAttachmentsRepository;
let showAttachment: ShowAttachmentService;

describe('ShowAttachment', () => {
  beforeEach(() => {
    fakeGrantsRepository = new FakeGrantsRepository();
    fakeAttachmentsRepository = new FakeAttachmentsRepository();

    showAttachment = new ShowAttachmentService(
      fakeGrantsRepository,
      fakeAttachmentsRepository,
    );
  });

  it('should be able to show an attachment based on its id', async () => {
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

    const a = await fakeAttachmentsRepository.create({
      name: 'Salaries',
      link: 'google.com',
      grantId: g.id,
    });

    const attachment = await showAttachment.execute({ id: a.id });

    expect(attachment?.id).toEqual(a.id);
  });

  it('should not show an attachment whose id does not exist', async () => {
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

    await fakeAttachmentsRepository.create({
      name: 'Salaries',
      link: 'google.com',
      grantId: grant.id,
    });

    await expect(
      showAttachment.execute({ id: '123456' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
