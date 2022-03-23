import { inject, injectable } from 'tsyringe';

import IGrantsRepository from '../infra/db/repositories/interfaces/IGrantsRepository';
import Grant from '../infra/db/entities/Grant';
import AppError from '../../../common/errors/AppError';

interface IRequest {
  id: string;
  grantName?: string;
  openDate?: Date;
  closeDate?: Date;
  status?: string;
  amountRequested?: number;
  amountApproved?: number;
  writerName?: string;
  applicationUrl?: string;
  sponsoringAgency?: string;
  dateWhenFundsWereReceived?: Date;
  expirationDate?: Date;
  notes?: string;
}

@injectable()
export default class UpdateGrantService {
  constructor(
    @inject('GrantsRepository')
    private grantsRepository: IGrantsRepository,
  ) {}

  public async execute({
    id,
    grantName,
    openDate,
    closeDate,
    status,
    amountRequested,
    amountApproved,
    writerName,
    applicationUrl,
    sponsoringAgency,
    dateWhenFundsWereReceived,
    expirationDate,
    notes,
  }: IRequest): Promise<Grant | undefined> {
    const grant = await this.grantsRepository.findById(id);

    if (!grant) {
      throw new AppError('A grant with the id provided does not exist.');
    }

    grantName && (grant.grantName = grantName);
    openDate && (grant.openDate = openDate);
    closeDate && (grant.closeDate = closeDate);
    status && (grant.status = status);
    amountRequested && (grant.amountRequested = amountRequested);
    amountApproved && (grant.amountApproved = amountApproved);
    writerName && (grant.writerName = writerName);
    applicationUrl && (grant.applicationUrl = applicationUrl);
    sponsoringAgency && (grant.sponsoringAgency = sponsoringAgency);
    dateWhenFundsWereReceived &&
      (grant.dateWhenFundsWereReceived = dateWhenFundsWereReceived);
    expirationDate && (grant.expirationDate = expirationDate);
    notes && (grant.notes = notes);

    await this.grantsRepository.save(grant);

    return grant;
  }
}
