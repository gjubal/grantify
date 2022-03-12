import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import React, { useCallback, useRef } from 'react';
import { FiLock, FiMail, FiUser } from 'react-icons/fi';
import { useHistory } from 'react-router';
import * as Yup from 'yup';

import Button from '../../components/Button';
import Input from '../../components/Input';
import SideBar from '../../components/SideBar';
import { useAuth } from '../../hooks/authentication';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import { Container } from './styles';

interface ProfileFormData {
  first_name: string;
  last_name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <div className="flex">
      <SideBar signOut={signOut} />
      <ContentContainer title="Profile" />
    </div>
  );
};

const ContentContainer: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="content-container">
      <div className="content-list">
        <h1 className="content-title">{title}</h1>
        <ProfileSection />
      </div>
    </div>
  );
};

const ProfileSection: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const { user, updateUser } = useAuth();

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          first_name: Yup.string().required('First name mandatory'),
          last_name: Yup.string().required('Last name mandatory'),
          email: Yup.string()
            .email('Insert a valid email')
            .required('E-mail mandatory'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: (val: any) => !!val.length,
            then: Yup.string().required('Mandatory field'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: (val: any) => !!val.length,
              then: Yup.string().required('Mandatory field'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), undefined], 'Passwords must match'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          first_name,
          last_name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        const formData = {
          first_name,
          last_name,
          email,
          ...(data.old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };

        const response = await api.put('/profile', formData);

        updateUser(response.data);

        history.push('/');

        addToast({
          type: 'success',
          title: 'Profile updated successfully!',
          description: 'Your new settings have been saved',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Update error',
          description:
            'An error occurred while trying to update your profile, please try again.',
        });
      }
    },
    [addToast, history, updateUser],
  );

  return (
    <Container className="shadow">
      <Form
        ref={formRef}
        initialData={{
          first_name: user.firstName,
          last_name: user.lastName,
          email: user.email,
        }}
        onSubmit={handleSubmit}
      >
        <Input
          name="first_name"
          icon={FiUser}
          placeholder="First name"
          disabled
        />
        <Input
          name="last_name"
          icon={FiUser}
          placeholder="Last name"
          disabled
        />

        <Input name="email" icon={FiMail} placeholder="E-mail" disabled />

        <Input
          containerStyle={{ marginTop: 24 }}
          name="old_password"
          icon={FiLock}
          type="password"
          placeholder="Current password"
        />

        <Input
          name="password"
          icon={FiLock}
          type="password"
          placeholder="New password"
        />

        <Input
          name="password_confirmation"
          icon={FiLock}
          type="password"
          placeholder="Password confirmation"
        />

        <Button type="submit">Confirm changes</Button>
      </Form>
    </Container>
  );
};

export default Profile;
