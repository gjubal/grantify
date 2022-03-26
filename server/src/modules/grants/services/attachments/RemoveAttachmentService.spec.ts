import AppError from '../../../../common/errors/AppError';
import FakeAttachmentsRepository from '../../infra/db/repositories/fakes/FakeAttachmentsRepository';
import FakeGrantsRepository from '../../infra/db/repositories/fakes/FakeGrantsRepository';
import RemoveAttachmentService from './RemoveAttachmentService';

let fakeGrantsRepository: FakeGrantsRepository;
let fakeAttachmentsRepository: FakeAttachmentsRepository;
let removeAttachment: RemoveAttachmentService;

describe('RemoveAttachment', () => {
  beforeEach(() => {
    fakeGrantsRepository = new FakeGrantsRepository();
    fakeAttachmentsRepository = new FakeAttachmentsRepository();

    removeAttachment = new RemoveAttachmentService(
      fakeGrantsRepository,
      fakeAttachmentsRepository,
    );
  });

  it('should throw exception if id provided does not exist', async () => {
    await expect(
      removeAttachment.execute({
        id: '123456789',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should remove an attachment whose id is valid', async () => {
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

    const a = await fakeAttachmentsRepository.create({
      name: 'Salaries',
      link: 'google.com',
      grantId: grant.id,
    });

    await removeAttachment.execute({ id: a.id });

    expect(fakeAttachmentsRepository.findById(a.id)).toMatchObject({});
  });
});
