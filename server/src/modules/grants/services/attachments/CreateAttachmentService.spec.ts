import AppError from '../../../../common/errors/AppError';
import FakeAttachmentsRepository from '../../infra/db/repositories/fakes/FakeAttachmentsRepository';
import FakeGrantsRepository from '../../infra/db/repositories/fakes/FakeGrantsRepository';
import CreateAttachmentService from './CreateAttachmentService';

let fakeGrantsRepository: FakeGrantsRepository;
let fakeAttachmentsRepository: FakeAttachmentsRepository;
let createAttachment: CreateAttachmentService;

describe('CreateAttachment', () => {
  beforeEach(() => {
    fakeGrantsRepository = new FakeGrantsRepository();
    fakeAttachmentsRepository = new FakeAttachmentsRepository();

    createAttachment = new CreateAttachmentService(
      fakeGrantsRepository,
      fakeAttachmentsRepository,
    );
  });

  it('should be able to create a new attachment', async () => {
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

    const attachment = await createAttachment.execute({
      name: 'Link to google',
      link: 'https://www.google.com',
      grantId: grant.id,
    });

    expect(attachment).toHaveProperty('id');
  });

  it('should not be able to create a new expense attached to a grant that does not exist', async () => {
    await expect(
      createAttachment.execute({
        name: 'Document',
        link: 'https://www.google.com',
        grantId: 'non-existent grant id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
