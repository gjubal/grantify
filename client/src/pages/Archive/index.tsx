import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useCallback,
  useRef,
} from 'react';
import { BsPaperclip } from 'react-icons/bs';
import { useParams } from 'react-router';
import Button from '../../components/Button';
import Divider from '../../components/Divider';
import Input from '../../components/Input';
import SideBar from '../../components/SideBar';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';
import { Attachment } from '../../types/Attachment';
import { AnimationContainer, Container } from './styles';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import { Grant } from '../../types/Grant';

const Archive: React.FC = () => {
  const [grant, setGrant] = useState<Grant>();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [open, setOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const { signOut } = useAuth();
  const { addToast } = useToast();
  const formRef = useRef<FormHandles>(null);

  const deleteAttachment = useCallback(
    (grantId: string, attachmentId: string) => {
      api
        .get<Attachment>(`attachments/${grantId}/${attachmentId}`)
        .then(async response => {
          setAttachments(
            attachments.filter(
              attachment => attachment.id !== response.data.id,
            ),
          );
          await api.delete(`attachments/${grantId}/${response.data.id}`);

          addToast({
            type: 'success',
            title: 'Attachment removed!',
            description: 'The changes have been saved successfully.',
          });
        });
    },
    [addToast, attachments],
  );

  const onSubmit = useCallback(
    async (data: Attachment) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Attachment name is required'),
          link: Yup.string().required('Link is required'),
        });

        await schema.validate(data, { abortEarly: false });

        const formData = {
          name: data.name,
          link: data.link,
        };

        const attachmentResponse = await api.post<Attachment>(
          `attachments/${id}`,
          formData,
        );

        setAttachments([
          ...attachments,
          {
            id: attachmentResponse.data.id,
            name: attachmentResponse.data.name,
            link: attachmentResponse.data.link,
            grantId: attachmentResponse.data.grantId,
          },
        ]);

        setOpen(false);

        addToast({
          type: 'success',
          title: 'File added successfully!',
          description: 'The attachments table has been updated.',
        });
      } catch (err) {
        console.log(err);
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Unable to add new expense',
          description: 'Please try again.',
        });
      }
    },
    [id, attachments, addToast],
  );

  useEffect(() => {
    api.get(`/grants/${id}`).then(response => setGrant(response.data));
    api
      .get(`/attachments/${id}`)
      .then(response => setAttachments(response.data));
  }, [id]);

  return (
    <div className="flex">
      <SideBar signOut={signOut} />
      <ContentContainer
        title="Archive"
        grant={grant}
        attachments={attachments}
        deleteAttachment={deleteAttachment}
        onSubmit={onSubmit}
        open={open}
        setOpen={setOpen}
      />
    </div>
  );
};

const ContentContainer: React.FC<{
  title: string;
  grant: Grant | undefined;
  attachments: Attachment[];
  deleteAttachment: any;
  onSubmit: any;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}> = ({
  title,
  grant,
  attachments,
  deleteAttachment,
  onSubmit,
  open,
  setOpen,
}) => {
  return (
    <div className="content-container">
      <div className="content-list">
        <h1 className="content-title">{title}</h1>
        {grant && (
          <>
            <p className="my-4 text-gray-500">{grant.grantName}</p>
            <div className="grid grid-cols-1 p-6">
              <ArchiveList
                setOpen={setOpen}
                attachments={attachments}
                deleteAttachment={deleteAttachment}
              />
            </div>
          </>
        )}
        {open && <AddFileForm setOpen={setOpen} onSubmit={onSubmit} />}
      </div>
    </div>
  );
};

const ArchiveList: React.FC<{
  setOpen: Dispatch<SetStateAction<boolean>>;
  attachments: Attachment[];
  deleteAttachment: any;
}> = ({ setOpen, attachments, deleteAttachment }) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
      <Container>
        <div className="flex flex-row items-center mb-2 justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Important files
          </h3>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mx-2 text-lg leading-6 font-medium text-indigo-600 hover:text-indigo-800"
          >
            +
          </button>
        </div>
        <div className=" border-t border-gray-200">
          <dl className="">
            <div className="bg-white">
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {attachments.length !== 0 && (
                  <ul className="my-4 border border-gray-200 rounded-md divide-y divide-gray-200">
                    {attachments.map(attachment => (
                      <li
                        key={attachment.id}
                        className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                      >
                        <div className="flex-1 flex items-center">
                          <BsPaperclip
                            className="flex-shrink-0 h-5 w-5 text-gray-500"
                            aria-hidden="true"
                          />
                          <a
                            href={attachment.link}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <span className="mx-2 flex-1 w-0 truncate">
                              {attachment.name}
                            </span>
                          </a>
                        </div>
                        <div className="mx-2 flex-shrink-0">
                          <button
                            type="button"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                            onClick={() => {
                              // eslint-disable-next-line no-restricted-globals
                              const option = confirm(
                                `Are you sure you want to delete the attachment ${attachment.name}? This action cannot be reversed`,
                              );
                              option &&
                                deleteAttachment(
                                  attachment.grantId,
                                  attachment.id,
                                );
                            }}
                          >
                            x
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </Container>
    </div>
  );
};

const AddFileForm: React.FC<{
  setOpen: Dispatch<SetStateAction<boolean>>;
  onSubmit: any;
}> = ({ setOpen, onSubmit }) => {
  return (
    <AnimationContainer>
      <section className="grid grid-cols-1">
        <div className="bg-white my-4 p-6 rounded-xl mx-2 shadow-lg">
          <div className="">
            <div className="flex justify-between mb-3">
              <h3 className="text-gray-700">Add a new attachment</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mx-2 text-indigo-600 hover:text-indigo-800"
              >
                X
              </button>
            </div>
            <Divider />
            <div className="flex flex-col my-4">
              <Form onSubmit={onSubmit}>
                <Input
                  name="name"
                  label="Name"
                  placeholder="Tax document #1 - 2021"
                />
                <Input
                  name="link"
                  label="Link"
                  placeholder="https://www.drive.google.com/"
                />
                <Button type="submit">Add attachment</Button>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </AnimationContainer>
  );
};

export default Archive;
