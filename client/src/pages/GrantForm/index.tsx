import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import Input from '../../components/Input';
import SideBar from '../../components/SideBar';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { Grant } from '../../types/Grant';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import { Content, Section } from './styles';
import convertFromTimestampToString from '../../utils/convertFromTimestampToString';
import convertFromStringToTimestamp from '../../utils/convertFromStringToTimestamp';
import Button from '../../components/Button';

const GrantForm: React.FC = () => {
  const { signOut } = useAuth();
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex">
      <SideBar signOut={signOut} />
      <div className="content-container">
        <div className="content-list">
          {id ? (
            <h1 className="content-title">Edit a grant</h1>
          ) : (
            <h1 className="content-title">Add a new grant</h1>
          )}

          <FormFields />
        </div>
      </div>
    </div>
  );
};

const FormFields: React.FC = () => {
  const [grantName, setGrantName] = useState('');
  const [openDate, setOpenDate] = useState('');
  const [closeDate, setCloseDate] = useState('');
  const [dateWhenFundsWereReceived, setDateWhenFundsWereReceived] =
    useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [status, setStatus] = useState('');
  const [amountRequested, setAmountRequested] = useState(0);
  const [amountApproved, setAmountApproved] = useState(0);
  const [writerName, setWriterName] = useState('');
  const [applicationUrl, setApplicationUrl] = useState('');
  const [sponsoringAgency, setSponsoringAgency] = useState('');
  const { addToast } = useToast();
  const history = useHistory();
  const formRef = useRef<FormHandles>(null);
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const onSubmit = useCallback(
    async (data: Grant) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          grantName: Yup.string().required('Grant name is required'),
          openDate: Yup.string().required('Open date is required'),
          closeDate: Yup.string().required('Close date is required'),
          status: Yup.string().required('Status is required'),
          amountRequested: Yup.string().required(
            'Amount requested is required',
          ),
          amountApproved: Yup.string(),
          writerName: Yup.string(),
          applicationUrl: Yup.string(),
          sponsoringAgency: Yup.string(),
          dateWhenFundsWereReceived: Yup.string(),
          expirationDate: Yup.string(),
        });

        await schema.validate(data, { abortEarly: false });

        if (id) {
          const response = await api.get(`grants/${id}`);

          if (!response.data) {
            history.push('/grants');

            addToast({
              type: 'error',
              title: 'Unable to find grant to update',
              description: 'Please try again.',
            });
          } else {
            const formData = {
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
            };

            await api.put(`/grants/${id}`, formData);

            history.push('/grants');

            addToast({
              type: 'success',
              title: 'Grant updated successfully!',
              description: 'The grant table has been updated.',
            });
          }
        } else {
          const formData = {
            grantName: data.grantName,
            openDate: convertFromStringToTimestamp(data.openDate),
            closeDate: convertFromStringToTimestamp(data.closeDate),
            status: data.status,
            amountRequested: Number(data.amountRequested),
            ...(amountApproved && {
              amountApproved: Number(data.amountApproved),
            }),
            ...(writerName && { writerName: data.writerName }),
            ...(applicationUrl && { applicationUrl: data.applicationUrl }),
            ...(sponsoringAgency && {
              sponsoringAgency: data.sponsoringAgency,
            }),
            ...(dateWhenFundsWereReceived && {
              dateWhenFundsWereReceived: convertFromStringToTimestamp(
                data.dateWhenFundsWereReceived,
              ),
            }),
            ...(expirationDate && {
              expirationDate: convertFromStringToTimestamp(data.expirationDate),
            }),
          };

          await api.post('/grants', formData);

          history.push('/grants');

          addToast({
            type: 'success',
            title: 'Grant added successfully!',
            description: 'The grant table has been updated.',
          });
        }
      } catch (err) {
        console.log(err);
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Unable to add new grant',
          description: 'Please try again.',
        });
      }
    },
    [
      addToast,
      amountApproved,
      amountRequested,
      applicationUrl,
      closeDate,
      dateWhenFundsWereReceived,
      expirationDate,
      grantName,
      history,
      id,
      openDate,
      sponsoringAgency,
      status,
      writerName,
    ],
  );

  useEffect(() => {
    if (id) {
      api.get(`grants/${id}`).then(response => {
        const {
          amountApproved,
          amountRequested,
          closeDate,
          dateWhenFundsWereReceived,
          expirationDate,
          grantName,
          openDate,
          writerName,
          applicationUrl,
          sponsoringAgency,
          status,
        } = response.data;

        setGrantName(grantName);
        setOpenDate(convertFromTimestampToString(openDate));
        setCloseDate(convertFromTimestampToString(closeDate));
        setStatus(status);
        setAmountRequested(amountRequested);
        if (amountApproved) setAmountApproved(amountApproved);
        if (writerName) setWriterName(writerName);
        if (applicationUrl) setApplicationUrl(applicationUrl);
        if (sponsoringAgency) setSponsoringAgency(sponsoringAgency);
        if (dateWhenFundsWereReceived)
          setDateWhenFundsWereReceived(
            convertFromTimestampToString(dateWhenFundsWereReceived),
          );
        if (expirationDate)
          setExpirationDate(convertFromTimestampToString(expirationDate));
      });
    }
  }, [id]);

  return (
    <Content>
      <Section>
        <main>
          <Form onSubmit={onSubmit} ref={formRef}>
            <fieldset>
              <legend>Grant details</legend>
              <Input
                name="grantName"
                label="Name"
                placeholder="Wayne grant"
                value={grantName}
                onChange={e => setGrantName(e.target.value)}
              />

              <Input
                name="openDate"
                label="Open date"
                placeholder="01/01/2022"
                value={id && openDate}
                onChange={e => setOpenDate(e.target.value)}
              />

              <Input
                name="closeDate"
                label="Close date"
                placeholder="12/31/2022"
                value={id && closeDate}
                onChange={e => setCloseDate(e.target.value)}
              />

              <Input
                name="status"
                label="Status"
                placeholder="Pending"
                value={id && status}
                onChange={e => setStatus(e.target.value)}
              />

              <Input
                name="amountRequested"
                label="Amount Requested"
                placeholder="10000"
                value={id && amountRequested}
                onChange={e => setAmountRequested(Number(e.target.value))}
              />

              <Input
                name="amountApproved"
                label="Amount Approved (optional)"
                placeholder="5000"
                value={id && amountApproved}
                onChange={e => setAmountApproved(Number(e.target.value))}
              />

              <Input
                name="applicationUrl"
                label="Application Url (optional)"
                placeholder="https://www.wayneenterprises.com"
                value={id && applicationUrl}
                onChange={e => setApplicationUrl(e.target.value)}
              />

              <Input
                name="sponsoringAgency"
                label="Sponsoring Agency (optional)"
                placeholder="Wayne Enterprises"
                value={id && sponsoringAgency}
                onChange={e => setSponsoringAgency(e.target.value)}
              />

              <Input
                name="dateWhenFundsWereReceived"
                label="Fund Receipt Date (optional)"
                placeholder="01/30/2022"
                value={id && dateWhenFundsWereReceived}
                onChange={e => setDateWhenFundsWereReceived(e.target.value)}
              />

              <Input
                name="expirationDate"
                label="Expiration Date (optional)"
                placeholder="01/15/2023"
                value={id && expirationDate}
                onChange={e => setExpirationDate(e.target.value)}
              />

              <Input
                name="writerName"
                label="Writer Name"
                value={`${user.firstName} ${user.lastName}`}
                disabled
              />
            </fieldset>

            <footer>
              <div>
                {id ? (
                  <Button type="submit">Update grant</Button>
                ) : (
                  <Button type="submit">Create grant</Button>
                )}
              </div>
            </footer>
          </Form>
        </main>
      </Section>
    </Content>
  );
};

export default GrantForm;
