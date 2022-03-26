import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateAttachmentService from '../../../services/attachments/CreateAttachmentService';
import ListAttachmentsService from '../../../services/attachments/ListAttachmentsService';
import RemoveAttachmentService from '../../../services/attachments/RemoveAttachmentService';
import ShowAttachmentService from '../../../services/attachments/ShowAttachmentService';

export default class AttachmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { grantId } = request.params;

    const listAttachments = container.resolve(ListAttachmentsService);

    const attachments = await listAttachments.findAllByGrantId(grantId);

    return response.json(attachments);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { attachmentId } = request.params;

    const showAttachment = container.resolve(ShowAttachmentService);

    const attachment = await showAttachment.execute({ id: attachmentId });

    return response.json(attachment);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, link } = request.body;
    const { grantId } = request.params;

    const createAttachment = container.resolve(CreateAttachmentService);

    const attachment = await createAttachment.execute({
      name,
      link,
      grantId,
    });

    return response.json(attachment);
  }

  public async destroy(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { attachmentId } = request.params;

    const deleteAttachment = container.resolve(RemoveAttachmentService);

    const attachment = await deleteAttachment.execute({
      id: attachmentId,
    });

    return response.json(attachment);
  }
}
