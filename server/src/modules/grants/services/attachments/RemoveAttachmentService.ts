import { inject, injectable } from 'tsyringe';
import AppError from '../../../../common/errors/AppError';
import Attachment from '../../infra/db/entities/Attachment';
import IAttachmentsRepository from '../../infra/db/repositories/interfaces/IAttachmentsRepository';
import IGrantsRepository from '../../infra/db/repositories/interfaces/IGrantsRepository';

interface IRequest {
  id: string;
}

@injectable()
export default class RemoveAttachmentService {
  constructor(
    @inject('GrantsRepository')
    private grantsRepository: IGrantsRepository,

    @inject('AttachmentsRepository')
    private attachmentsRepository: IAttachmentsRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<Attachment | undefined> {
    const attachment = await this.attachmentsRepository.findById(id);

    if (!attachment) {
      throw new AppError('An attachment with the id provided does not exist.');
    }

    await this.attachmentsRepository.delete(attachment);

    return attachment;
  }
}
