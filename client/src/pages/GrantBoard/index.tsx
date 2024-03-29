import React, { Fragment, useCallback, useState, useEffect } from 'react';
import SideBar from '../../components/SideBar';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/authentication';

import { BsTrash } from 'react-icons/bs';
import api from '../../services/api';
import { Grant } from '../../types/Grant';
import { useToast } from '../../hooks/toast';
import TableFooter from '../../components/TableFooter';
import useTable from '../../hooks/table';
import formatCurrency from '../../utils/formatCurrency';
import { FiInfo } from 'react-icons/fi';
import MenuIcon from '../../components/MenuIcon';
import StatusCard from '../../components/StatusCard';
import { Container } from './styles';

<div
  id="hiddendiv"
  className="bg-green-100 text-red-700 bg-red-200 bg-cyan-200 text-cyan-900 bg-yellow-100 text-yellow-800 bg-blue-100 text-blue-700 bg-gray-300 text-gray-800"
></div>;

const GrantBoard: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <div className="flex">
      <SideBar signOut={signOut} />
      <ContentContainer title="Grants" />
    </div>
  );
};

const ContentContainer: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="content-container">
      <div className="content-list">
        <h1 className="content-title">{title}</h1>
        <GrantTable />
      </div>
    </div>
  );
};

const GrantTable: React.FC = () => {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [page, setPage] = useState(1);
  const { slice, range } = useTable(grants, page, 8);

  const { addToast } = useToast();
  const { signOut, canAccess } = useAuth();

  const sortGrants = useCallback((grants: Grant[]) => {
    const grantsSorted = [...grants].sort((a, b) => {
      if (a.grantName > b.grantName) return 1;
      else if (a.grantName < b.grantName) return -1;
      else return 0;
    });

    return grantsSorted;
  }, []);

  const deleteGrant = useCallback(
    (id: string) => {
      api.get<Grant>(`grants/${id}`).then(async response => {
        setGrants(grants.filter(grant => grant.id !== response.data.id));
        await api.delete(`grants/${response.data.id}`);

        addToast({
          type: 'success',
          title: 'Grant removed!',
          description: 'The changes have been saved successfully.',
        });
      });
    },
    [addToast, grants],
  );

  useEffect(() => {
    api
      .get<Grant[]>('grants')
      .then(response => setGrants(sortGrants(response.data)))
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
  }, [addToast, signOut, sortGrants]);

  return (
    <Container>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg bg-white">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name - Grantor
                    </th>
                    <th
                      scope="col"
                      className="flex flex-row items-center px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Open date
                      <MenuIcon
                        icon={<FiInfo size={14} />}
                        text="When the grant application opens"
                      />
                      - Close date
                      <MenuIcon
                        icon={<FiInfo size={14} />}
                        text="When the grant application closes (deadline)"
                      />
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="flex flex-row items-center px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Requested
                      <MenuIcon
                        icon={<FiInfo size={14} />}
                        text="How much was applied for"
                      />
                      - Approved
                      <MenuIcon
                        icon={<FiInfo size={14} />}
                        text="How much is currently available"
                      />
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">View</span>
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">X</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {slice.map(grant => (
                    <Fragment key={grant.id}>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {grant.grantName}
                              </div>
                              {grant.sponsoringAgency && (
                                <div className="text-sm text-gray-500">
                                  {grant.sponsoringAgency}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(grant.openDate).getUTCMonth() + 1}/
                            {new Date(grant.openDate).getUTCDate()}/
                            {new Date(grant.openDate).getUTCFullYear()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(grant.closeDate).getUTCMonth() + 1}/
                            {new Date(grant.closeDate).getUTCDate()}/
                            {new Date(grant.closeDate).getUTCFullYear()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusCard text={grant.status} />
                        </td>
                        {grant.amountApproved ? (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              ${formatCurrency(grant.amountRequested)}
                            </div>
                            <div className="text-sm text-green-800">
                              ${formatCurrency(grant.amountApproved)}
                            </div>
                          </td>
                        ) : (
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            ${formatCurrency(grant.amountRequested)}
                          </td>
                        )}
                        {canAccess('viewGrant') && (
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              to={`/grants/view/${grant.id}`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              View
                            </Link>
                          </td>
                        )}
                        {canAccess('editGrant') && (
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              to={`/grants/edit/${grant.id}`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                            </Link>
                          </td>
                        )}
                        {canAccess('deleteGrant') && (
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div>
                              <button
                                type="button"
                                onClick={() => {
                                  // eslint-disable-next-line no-restricted-globals
                                  const option = confirm(
                                    `Are you sure you want to delete the grant ${grant.grantName}? This action cannot be reversed`,
                                  );
                                  option && deleteGrant(grant.id);
                                }}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <BsTrash />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    </Fragment>
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
      </div>
    </Container>
  );
};

export default GrantBoard;
