import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SideBar from '../../components/SideBar';
import TableFooter from '../../components/TableFooter';
import { useAuth } from '../../hooks/authentication';
import useTable from '../../hooks/table';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';
import { Container } from './styles';

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

const UserBoard: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <div className="flex">
      <SideBar signOut={signOut} />
      <div className="content-container">
        <div className="content-list">
          <h1 className="content-title">Users</h1>
          <UsersTable />
        </div>
      </div>
    </div>
  );
};

const UsersTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  // const [userPermissionAssociations, setUserPermissionAssociations] = useState<
  //   UserPermissionAssociation[]
  // >([]);
  const [page, setPage] = useState(1);
  const { signOut, canAccess } = useAuth();
  const { addToast } = useToast();

  const sortUsers = useCallback((users: User[]) => {
    const usersArr: User[] = users.filter(
      (user: User) => user.email !== process.env.REACT_APP_SEED_USER_EMAIL,
    );

    const usersAfterSorting = [...usersArr].sort((a, b) => {
      if (a.firstName > b.firstName) return 1;
      else if (a.firstName < b.firstName) return -1;
      else return 0;
    });

    return usersAfterSorting;
  }, []);

  const { slice, range } = useTable(users, page, 8);

  useEffect(() => {
    api
      .get<User[]>('users')
      .then(response => setUsers(sortUsers(response.data)))
      .catch(error => {
        if (error.response.status === 401) {
          addToast({
            type: 'error',
            title: 'Session expired',
            description: 'Please log in again.',
          });

          signOut();
        }

        return error;
      });
  }, [addToast, signOut, sortUsers]);

  // useEffect(() => {
  //   api
  //     .get<UserPermissionAssociation[]>(`users/${user.id}/user-permissions`)
  //     .then(response => setUserPermissionAssociations(response.data))
  //     .catch(error => error);
  // }, [user.id]);

  return (
    <Container>
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name / Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Account creation date
                  </th>
                  <th scope="col" className="relative px-12 py-3">
                    <span className="sr-only">Access control</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {slice.map(user => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(user.createdAt).getUTCMonth() + 1}/
                        {new Date(user.createdAt).getUTCDate()}/
                        {new Date(user.createdAt).getUTCFullYear()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {canAccess('editPermissions') && (
                        <Link
                          href="#"
                          className="text-indigo-600 hover:text-indigo-900"
                          to={`/users/${user.id}`}
                        >
                          View permissions
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <TableFooter
            range={range}
            slice={slice}
            setPage={setPage}
            page={page}
          />
        </div>
      </div>
    </Container>
  );
};

export default UserBoard;
