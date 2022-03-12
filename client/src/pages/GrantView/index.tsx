import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useAuth } from '../../hooks/authentication';
import SideBar from '../../components/SideBar';
import { useParams } from 'react-router';
import api from '../../services/api';
import { Grant } from '../../types/Grant';
import { BsFillArchiveFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import Input from '../../components/Input';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import Button from '../../components/Button';
import Divider from '../../components/Divider';
import {
  AnimationContainer,
  ButtonSpan,
  Entry,
  ExpenseContainer,
  ExpenseRowContainer,
} from './styles';
import { Expense } from '../../types/Expense';
import { useToast } from '../../hooks/toast';
import { FormHandles } from '@unform/core';
import getValidationErrors from '../../utils/getValidationErrors';

const GrantView: React.FC = () => {
  const [grant, setGrant] = useState<Grant>();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [open, setOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const { signOut } = useAuth();
  const { addToast } = useToast();
  const formRef = useRef<FormHandles>(null);

  const deleteExpense = useCallback(
    (grantId: string, expenseId: string) => {
      api
        .get<Expense>(`grants/view/${grantId}/${expenseId}`)
        .then(async response => {
          setExpenses(
            expenses.filter(expense => expense.id !== response.data.id),
          );
          await api.delete(`grants/view/${grantId}/${response.data.id}`);

          addToast({
            type: 'success',
            title: 'Expense removed!',
            description: 'The changes have been saved successfully.',
          });
        });
    },
    [addToast, expenses],
  );

  const onSubmit = useCallback(
    async (data: Expense) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Expense name is required'),
          lineItemCode: Yup.number(),
          budget: Yup.number().required('Budget is required'),
          amountSpent: Yup.number(),
          date: Yup.string().required('Date is required'),
        });

        await schema.validate(data, { abortEarly: false });

        const formData = {
          name: data.name,
          lineItemCode: data.lineItemCode,
          budget: data.budget,
          amountSpent: data.amountSpent,
          date: data.date,
        };

        const expenseResponse = await api.post<Expense>(
          `/grants/view/${id}`,
          formData,
        );

        setExpenses([
          ...expenses,
          {
            id: expenseResponse.data.id,
            name: expenseResponse.data.name,
            lineItemCode: Number(expenseResponse.data.lineItemCode),
            budget: Number(expenseResponse.data.budget),
            amountSpent: Number(expenseResponse.data.amountSpent),
            date: expenseResponse.data.date,
            grantId: expenseResponse.data.grantId,
          },
        ]);

        setOpen(false);

        addToast({
          type: 'success',
          title: 'Expense added successfully!',
          description: 'The expenses table has been updated.',
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
    [id, expenses, addToast],
  );

  useEffect(() => {
    api
      .get<Grant>(`grants/${id}`)
      .then(response => setGrant(response.data))
      .catch(error => error);
    api
      .get<Expense[]>(`grants/view/${id}`)
      .then(response => setExpenses(response.data))
      .catch(error => error);
  }, [id]);

  return (
    <>
      {grant && (
        <div className="flex">
          <SideBar signOut={signOut} />
          <div className="content-container">
            <div className="content-list">
              <GrantGrid grant={grant} expenses={expenses} />
              <div className="my-4 text-gray-500">
                <Link
                  to={`${id}/archive`}
                  className="flex flex-row items-center"
                >
                  <BsFillArchiveFill />
                  <p className="mx-2">Archive</p>
                </Link>
              </div>
              <ExpensesBreakdown
                expenses={expenses}
                setOpen={setOpen}
                deleteExpense={deleteExpense}
              />
              {open && (
                <AddExpenseForm
                  setOpen={setOpen}
                  onSubmit={onSubmit}
                  formRef={formRef}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const GrantGrid: React.FC<{ grant: Grant; expenses: Expense[] }> = ({
  grant,
  expenses,
}) => {
  return (
    <>
      <h1 className="content-title">{grant.grantName}</h1>

      <section className="grid grid-cols-3 gap-5">
        <DataBox
          title={'Amount Requested'}
          data={grant.amountRequested.toString()}
        />
        {grant.amountApproved && (
          <DataBox
            title={'Amount Approved'}
            data={grant.amountApproved.toString()}
          />
        )}
        {grant.amountApproved && expenses.length !== 0 && (
          <DataBox
            title={'Remaining Balance'}
            data={(
              grant.amountApproved -
              expenses
                .map(expense => Number(expense.amountSpent))
                .reduce((acc, cv) => (acc += cv))
            ).toFixed(2)}
          />
        )}
        <DataBox title={'Open Date'} data={grant.openDate} />
        <DataBox title={'Close Date'} data={grant.closeDate} />
        {grant.expirationDate && (
          <DataBox title={'Expiration Date'} data={grant.expirationDate} />
        )}
        {grant.dateWhenFundsWereReceived && (
          <DataBox
            title={'Fund Receipt Date'}
            data={grant.dateWhenFundsWereReceived}
          />
        )}
        {grant.writerName && (
          <DataBox title={'Writer'} data={grant.writerName} />
        )}
        {grant.sponsoringAgency && (
          <DataBox
            title={'Sponsoring Agency (Grantor)'}
            data={grant.sponsoringAgency}
            link={grant.applicationUrl}
          />
        )}
        <DataBox title={'Status'} data={grant.status} />
      </section>
    </>
  );
};

const DataBox: React.FC<{ title: string; data: string; link?: string }> = ({
  title,
  data,
  link,
}) => {
  return (
    <div className="bg-white my-4 p-6 rounded-xl mx-2 shadow-md">
      <div className="text-gray-500 mb-3">
        <h4>{title}</h4>
      </div>
      <div>
        {!!Date.parse(data) && isNaN(Number(data)) && (
          <h3>
            {new Date(data).getUTCMonth() + 1}/{new Date(data).getUTCDate()}/
            {new Date(data).getUTCFullYear()}
          </h3>
        )}

        <span className="text-lg antialiased font-bold">
          {!isNaN(Number(data)) && <h3>${data}</h3>}
        </span>

        {title === 'Application Url' && !link && <h3>{data}</h3>}

        {title === 'Application Url' && link && (
          <h3>
            <a href={link}>{data}</a>
          </h3>
        )}

        {title === 'Status' && data === 'Approved' && (
          <h3 className="px-2 inline-flex text-md leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            {data}
          </h3>
        )}
        {title === 'Status' && data === 'Pending' && (
          <h3 className="px-2 inline-flex text-md leading-5 font-semibold rounded-full bg-blue-100 text-blue-700">
            {data}
          </h3>
        )}
        {title === 'Status' && data === 'Declined' && (
          <h3 className="px-2 inline-flex text-md leading-5 font-semibold rounded-full bg-red-200 text-red-700">
            {data}
          </h3>
        )}
        {title === 'Status' && data === 'Missed Deadline' && (
          <h3 className="px-2 inline-flex text-md leading-5 font-semibold rounded-full bg-red-100 text-yellow-800">
            {data}
          </h3>
        )}
        {title === 'Status' && data === 'Incomplete' && (
          <h3 className="px-2 inline-flex text-md leading-5 font-semibold rounded-full bg-cyan-200 text-cyan-900">
            {data}
          </h3>
        )}
        {title === 'Status' && data === 'Inactive' && (
          <h3 className="px-2 inline-flex text-md leading-5 font-semibold rounded-full bg-gray-300 text-gray-800">
            {data}
          </h3>
        )}
        {title === 'Status' &&
          ![
            'Approved',
            'Pending',
            'Incomplete',
            'Inactive',
            'Declined',
            'Missed Deadline',
          ].includes(data) && (
            <h3 className="inline-flex text-md leading-5 font-semibold rounded-full">
              {data}
            </h3>
          )}
      </div>
    </div>
  );
};

const ExpensesBreakdown: React.FC<{
  expenses: Expense[];
  setOpen: Dispatch<SetStateAction<boolean>>;
  deleteExpense: any;
}> = ({ expenses, setOpen, deleteExpense }) => {
  return (
    <>
      <h1 className="content-title">Expenses</h1>
      <ExpenseContainer>
        <div className="bg-white my-4 p-6 rounded-xl mx-2 shadow-lg">
          <div className="flex justify-between mb-3">
            <h3 className="text-gray-500 text-md">Expense</h3>
            <h3 className="text-gray-500 text-md">Line Item</h3>
            <h3 className="text-gray-500 text-md">Budget</h3>
            <h3 className="text-gray-500 text-md">Amount Spent</h3>
            <h3 className="text-gray-500 text-md">Date</h3>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mx-2 text-indigo-600 hover:text-indigo-900"
            >
              +
            </button>
          </div>
          <Divider />
          <div className="my-4">
            {expenses.map(expense => (
              <ExpenseRow
                key={expense.id}
                expense={expense}
                deleteExpense={deleteExpense}
              />
            ))}
          </div>
          {expenses.length !== 0 && <Divider />}
          <div className="flex flex-col items-center">
            <h3 className="my-4 text-gray-500">Total expenses</h3>
            <h3 className="text-lg">
              $
              {expenses.length !== 0
                ? expenses
                    .map(expense => Number(expense.amountSpent))
                    .reduce((acc, cv) => (acc += cv))
                    .toFixed(2)
                : 0}
            </h3>
          </div>
        </div>
      </ExpenseContainer>
    </>
  );
};

const ExpenseRow: React.FC<{ expense: Expense; deleteExpense: any }> = ({
  expense,
  deleteExpense,
}) => {
  return (
    <ExpenseRowContainer>
      <Entry width="4" justification="start">
        {expense.name}
      </Entry>
      <Entry width="1" justification="center">
        {expense.lineItemCode}
      </Entry>
      <Entry width="4" justification="end">
        ${expense.budget}
      </Entry>
      <Entry width="5" justification="center">
        ${expense.amountSpent}
      </Entry>
      <Entry width="0" justification="center">
        {expense.date}
      </Entry>

      <ButtonSpan>
        <button
          type="button"
          onClick={() => {
            // eslint-disable-next-line no-restricted-globals
            const option = confirm(
              `Are you sure you want to delete the expense ${expense.name}? This action cannot be reversed`,
            );
            option && deleteExpense(expense.grantId, expense.id);
          }}
          className="text-indigo-600 hover:text-indigo-900"
        >
          x
        </button>
      </ButtonSpan>
    </ExpenseRowContainer>
  );
};

const AddExpenseForm: React.FC<{
  setOpen: Dispatch<SetStateAction<boolean>>;
  onSubmit: any;
  formRef: any;
}> = ({ setOpen, onSubmit, formRef }) => {
  return (
    <AnimationContainer>
      <section className="grid grid-cols-1">
        <div className="bg-white my-4 p-6 rounded-xl mx-2 shadow-lg">
          <div className="">
            <div className="flex justify-between mb-3">
              <h3 className="text-gray-700">Add a new expense</h3>
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
              <Form onSubmit={onSubmit} ref={formRef}>
                <Input name="name" label="Name" placeholder="Salaries" />
                <Input
                  name="lineItemCode"
                  label="Line Item Code (optional)"
                  placeholder="1"
                />
                <Input name="budget" label="Budget" placeholder="3000" />
                <Input
                  name="amountSpent"
                  label="Amount Spent (optional)"
                  placeholder="1499.99"
                />
                <Input name="date" label="Date" placeholder="11/2021" />
                <Button type="submit">Add expense</Button>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </AnimationContainer>
  );
};

export default GrantView;
