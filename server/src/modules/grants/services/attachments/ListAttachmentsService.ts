import { inject, injectable } from 'tsyringe';
import AppError from '../../../../common/errors/AppError';
import Attachment from '../../infra/db/entities/Attachment';
import IAttachmentsRepository from '../../infra/db/repositories/interfaces/IAttachmentsRepository';
import IGrantsRepository from '../../infra/db/repositories/interfaces/IGrantsRepository';

@injectable()
export default class ListAttachmentsService {
  constructor(
    @inject('GrantsRepository')
    private grantsRepository: IGrantsRepository,

    @inject('AttachmentsRepository')
    private attachmentsRepository: IAttachmentsRepository,
  ) {}
  public async findAllByGrantId(id: string): Promise<Attachment[]> {
    const grant = await this.grantsRepository.findById(id);

    if (!grant) {
      throw new AppError('A grant with the provided id does not exist.');
    }

    const attachments = await this.attachmentsRepository.findAllByGrantId(
      grant.id,
    );

    return attachments;
  }
}
