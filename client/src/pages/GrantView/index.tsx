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
  FormContainer,
  FormDivider,
  NotesContainer,
} from './styles';
import { Expense } from '../../types/Expense';
import { useToast } from '../../hooks/toast';
import { FormHandles } from '@unform/core';
import getValidationErrors from '../../utils/getValidationErrors';
import formatCurrency from '../../utils/formatCurrency';
import StatusCard from '../../components/StatusCard';
import MenuIcon from '../../components/MenuIcon';
import { FiInfo } from 'react-icons/fi';
import MenuInfoMap from '../../types/MenuInfoMap';
import ListInput from '../../components/ListInput';
import ListSelect from '../../components/ListSelect';

const GrantView: React.FC = () => {
  const [grant, setGrant] = useState<Grant>();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [open, setOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const { signOut } = useAuth();
  const { addToast } = useToast();
  const addExpenseFormRef = useRef<FormHandles>(null);
  const searchExpensesFormRef = useRef<FormHandles>(null);

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
        addExpenseFormRef.current?.setErrors({});

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

          addExpenseFormRef.current?.setErrors(errors);
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
              {!['Pending', 'Incomplete'].includes(grant.status) && (
                <ExpensesBreakdown
                  expenses={expenses}
                  setExpenses={setExpenses}
                  setOpen={setOpen}
                  deleteExpense={deleteExpense}
                  searchExpensesFormRef={searchExpensesFormRef}
                />
              )}
              {open && (
                <AddExpenseForm
                  setOpen={setOpen}
                  onSubmit={onSubmit}
                  addExpenseFormRef={addExpenseFormRef}
                />
              )}
              <NotesSection text={grant.notes} />
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
        {grant.amountApproved &&
          !['Pending', 'Incomplete', 'Missed Deadline', 'Declined'].includes(
            grant.status,
          ) && (
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
        {grant.dateWhenFundsWereReceived &&
          !['Pending', 'Incomplete', 'Missed Deadline', 'Declined'].includes(
            grant.status,
          ) && (
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
            title={'Sponsoring Agency'}
            data={grant.sponsoringAgency}
            link={grant.applicationUrl}
          />
        )}
        <DataBox title={'Status'} data={grant.status} />
      </section>
    </>
  );
};

const DataBox: React.FC<{
  title: string;
  data: string;
  link?: string;
}> = ({ title, data, link }) => {
  return (
    <div className="bg-white my-4 p-6 rounded-xl mx-2 shadow-md">
      <div className="flex flex-row items-center text-gray-500 mb-3">
        <h4>{title}</h4>
        {MenuInfoMap.get(title) && (
          <MenuIcon icon={<FiInfo size={14} />} text={MenuInfoMap.get(title)} />
        )}
      </div>
      <div>
        {!!Date.parse(data) && isNaN(Number(data)) && (
          <h3>
            {new Date(data).getUTCMonth() + 1}/{new Date(data).getUTCDate()}/
            {new Date(data).getUTCFullYear()}
          </h3>
        )}

        <span className="text-lg antialiased font-bold">
          {!isNaN(Number(data)) && <h3>${formatCurrency(Number(data))}</h3>}
        </span>

        {(title === 'Sponsoring Agency' || title === 'Writer') && (
          <h3>{data}</h3>
        )}

        {title === 'Application Url' && !link && <h3>{data}</h3>}

        {title === 'Application Url' && link && (
          <h3>
            <a href={link}>{data}</a>
          </h3>
        )}

        {title === 'Status' && <StatusCard text={data} />}

        {title === 'Notes' && <p>{data}</p>}
      </div>
    </div>
  );
};

const ExpensesBreakdown: React.FC<{
  expenses: Expense[];
  setExpenses: Dispatch<SetStateAction<Expense[]>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  deleteExpense: any;
  searchExpensesFormRef: any;
}> = ({ expenses, setExpenses, setOpen, deleteExpense }) => {
  const [expenseName, setExpenseName] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const { id } = useParams<{ id: string }>();

  const replaceWithOriginalExpenses = useCallback(async () => {
    const originalExpenses = await api
      .get<Expense[]>(`grants/view/${id}`)
      .then(response => response.data)
      .catch(error => error);

    setExpenses(originalExpenses);
  }, [id, setExpenses]);

  const searchExpenses = useCallback(async () => {
    const filteredExpenses = expenses.filter(
      expense =>
        expense.name.toLowerCase().trim().includes(expenseName.toLowerCase()) &&
        expense.date.trim() ===
          `${month.length === 1 ? `0${month}` : month}/${year}`,
    );

    setExpenses(filteredExpenses);
  }, [expenseName, expenses, month, setExpenses, year]);

  return (
    <>
      <h1 className="content-title">Expenses</h1>
      <FormContainer>
        <Form
          onSubmit={searchExpenses}
          className="flex flex-row items-center p-6 mx-2"
        >
          <ListInput
            name="expenseName"
            label="Expense name"
            value={expenseName}
            onChange={e => setExpenseName(e.currentTarget.value)}
          />
          <div className="mx-2" />
          <ListSelect
            name="month"
            label="Month"
            value={month}
            onChange={e => setMonth(e.currentTarget.value)}
            options={[
              { value: '', label: '' },
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: '4', label: '4' },
              { value: '5', label: '5' },
              { value: '6', label: '6' },
              { value: '7', label: '7' },
              { value: '8', label: '8' },
              { value: '9', label: '9' },
              { value: '10', label: '10' },
              { value: '11', label: '11' },
              { value: '12', label: '12' },
            ]}
          />
          <div className="mx-2" />
          <ListInput
            name="year"
            label="Year"
            value={year}
            onChange={e => setYear(e.currentTarget.value)}
          />
          <div className="mx-2" />
          <div className="w-24 relative">
            <Button type="submit">Search</Button>
          </div>
          <div className="mx-2" />
          <div className="w-24 relative">
            <Button type="button" onClick={replaceWithOriginalExpenses}>
              Reset
            </Button>
          </div>
        </Form>
      </FormContainer>
      <ExpenseContainer>
        <div className="bg-white my-4 p-6 rounded-xl mx-2 shadow-md">
          <FormDivider />
          <div className="flex justify-between mb-3">
            <div className="text-gray-500 text-md flex items-center">
              <Entry width="10">
                <h3>Expense</h3>
              </Entry>
            </div>
            <div className="flex flex-col">
              <h3 className="text-gray-500 text-md">Line</h3>
              <h3 className="text-gray-500 text-md">Item</h3>
            </div>
            <h3 className="text-gray-500 text-md flex items-center">Budget</h3>
            <div className="flex flex-col">
              <h3 className="text-gray-500 text-md">Amount</h3>
              <h3 className="text-gray-500 text-md">Spent</h3>
            </div>
            <div className="flex flex-col">
              <h3 className="text-gray-500 text-md">Remaining</h3>
              <h3 className="text-gray-500 text-md">Balance</h3>
            </div>
            <h3 className="text-gray-500 text-md flex items-center">Date</h3>
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
                ? formatCurrency(
                    Number(
                      expenses
                        .map(expense => Number(expense.amountSpent))
                        .reduce((acc, cv) => (acc += cv))
                        .toFixed(2),
                    ),
                  )
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
    <>
      <ExpenseRowContainer>
        <Entry width="10">{expense.name}</Entry>
        <Entry width="1" ml="1.3">
          {expense.lineItemCode}
        </Entry>
        <Entry width="4" ml="1">
          ${formatCurrency(expense.budget)}
        </Entry>
        <Entry width="4" ml="0">
          ${formatCurrency(expense.amountSpent)}
        </Entry>
        <Entry width="4" ml="0.5">
          $
          {formatCurrency(
            Number((expense.budget - expense.amountSpent).toFixed(2)),
          )}
        </Entry>
        <Entry width="4" ml="1.1">
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
    </>
  );
};

const AddExpenseForm: React.FC<{
  setOpen: Dispatch<SetStateAction<boolean>>;
  onSubmit: any;
  addExpenseFormRef: any;
}> = ({ setOpen, onSubmit, addExpenseFormRef }) => {
  return (
    <AnimationContainer>
      <section className="grid grid-cols-1">
        <div className="bg-white my-4 p-6 rounded-xl mx-2 shadow-md">
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
              <Form onSubmit={onSubmit} ref={addExpenseFormRef}>
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

const NotesSection: React.FC<{ text?: string }> = ({ text }) => {
  return (
    <>
      {text && (
        <div className="flex flex-col justify-center items-center my-4 py-4">
          <h4 className="content-title">Notes</h4>

          <NotesContainer>
            <div className="bg-white my-4 p-6 rounded-xl mx-2 shadow-md">
              <div className="text-gray-500 mb-3"></div>
              <div>
                <p>{text}</p>
              </div>
            </div>
          </NotesContainer>
        </div>
      )}
    </>
  );
};

export default GrantView;
