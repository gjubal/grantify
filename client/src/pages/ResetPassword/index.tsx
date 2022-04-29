import React, { useRef, useCallback } from 'react';
import { FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory, useLocation } from 'react-router-dom';

import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';
import { Container, Content, AnimationContainer } from './styles';

import api from '../../services/api';
import { FaFire } from 'react-icons/fa';

interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const location = useLocation();

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          password: Yup.string().required('Password is a mandatory field'),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password'), null],
            'Incorrect confirmation',
          ),
        });

        await schema.validate(data, { abortEarly: false });

        const { password, password_confirmation } = data;
        const token = new URLSearchParams(location.search).get('token');

        if (!token) {
          throw new Error();
        }

        await api.post('/password/reset', {
          password,
          password_confirmation,
          token,
        });

        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Error',
          description:
            'An error occurred when you tried to reset your password, please try again.',
        });
      }
    },
    [addToast, history, location.search],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <div className="sidebar-icon group bg-white text-secondary">
            <FaFire size="80" />
          </div>

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Reset password</h1>

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

            <Button type="submit">Change password</Button>
          </Form>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default ResetPassword;
