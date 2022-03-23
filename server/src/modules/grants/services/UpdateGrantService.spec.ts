import AppError from '../../../common/errors/AppError';
import FakeGrantsRepository from '../infra/db/repositories/fakes/FakeGrantsRepository';
import UpdateGrantService from './UpdateGrantService';

let fakeGrantsRepository: FakeGrantsRepository;
let updateGrant: UpdateGrantService;

describe('UpdateGrant', () => {
  beforeEach(() => {
    fakeGrantsRepository = new FakeGrantsRepository();

    updateGrant = new UpdateGrantService(fakeGrantsRepository);
  });

  it('should be able to update a grant', async () => {
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
      expirationDate: new Date('2021-12-31T03:24:00'),
      notes:
        "What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Why do we use it? It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
    });

    const updatedGrant = await updateGrant.execute({
      id: g.id,
      grantName: 'SG Grant',
      openDate: new Date('2021-11-18T05:00:00'),
      closeDate: new Date('2021-11-25T05:00:00'),
      status: 'Approved',
      amountRequested: 3140,
      amountApproved: 1900,
      writerName: 'Bruce Wayne',
      applicationUrl: 'www.unf.edu',
      sponsoringAgency: 'Wayne Enterprises',
      dateWhenFundsWereReceived: new Date('2021-10-21T03:24:00'),
      expirationDate: new Date('2021-12-31T03:24:00'),
    });

    expect(updatedGrant?.grantName).toBe('SG Grant');
    expect(updatedGrant?.status).toBe('Approved');
  });

  it('should throw exception if id provided does not exist', async () => {
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
      expirationDate: new Date('2021-12-31T03:24:00'),
      notes:
        "What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Why do we use it? It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
    });

    await expect(
      updateGrant.execute({
        id: '123456789',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
