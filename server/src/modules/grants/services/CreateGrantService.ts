import { inject, injectable } from 'tsyringe';

import IGrantsRepository from '../infra/db/repositories/interfaces/IGrantsRepository';
import Grant from '../infra/db/entities/Grant';
import AppError from '../../../common/errors/AppError';

interface IRequest {
  grantName: string;
  openDate: Date;
  closeDate: Date;
  status: string;
  amountRequested: number;
  amountApproved: number;
  writerName: string;
  applicationUrl: string;
  sponsoringAgency: string;
  dateWhenFundsWereReceived: Date;
  expirationDate: Date;
  notes: string;
}

@injectable()
export default class CreateGrantService {
  constructor(
    @inject('GrantsRepository')
    private grantsRepository: IGrantsRepository,
  ) {}

  public async execute({
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
    const checkIfGrantNameExists = await this.grantsRepository.findByGrantName(
      grantName,
    );

    if (checkIfGrantNameExists) {
      throw new AppError('A grant with the name provided already exists.');
    }

    const grant = await this.grantsRepository.create({
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
    });

    return grant;
  }
}
