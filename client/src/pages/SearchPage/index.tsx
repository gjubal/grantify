import React, {
  Fragment,
  MouseEventHandler,
  useCallback,
  useEffect,
  useState,
} from 'react';
import SideBar from '../../components/SideBar';
import { Link } from 'react-router-dom';
import Search from '../../components/Search';
import { useAuth } from '../../hooks/authentication';

import { BsTrash } from 'react-icons/bs';
import { FaSearch } from 'react-icons/fa';
import api from '../../services/api';
import { Grant } from '../../types/Grant';
import { useToast } from '../../hooks/toast';
import formatCurrency from '../../utils/formatCurrency';
import MenuIcon from '../../components/MenuIcon';
import { FiInfo } from 'react-icons/fi';
import StatusCard from '../../components/StatusCard';
import { Container } from './styles';

const SearchPage: React.FC = () => {
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
        <SearchTable />
      </div>
    </div>
  );
};

function SortButton({
  sortKey,
  onClick,
}: {
  sortKey: any;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) {
  if (sortKey === 'desc') {
    return (
      <button onClick={onClick} className="text-xs px-2">
        ▲
      </button>
    );
  }
  return (
    <button onClick={onClick} className="text-xs px-2">
      ▼
    </button>
  );
}

const SearchTable: React.FC = () => {
  const [grants, setGrants] = useState<Grant[]>([]);

  const [searchKey, setSearchKey] = useState('');
  const [sortKey, setSortKey] = useState('');

  const { addToast } = useToast();
  const { canAccess, signOut } = useAuth();

  const sortGrants = useCallback((grants: Grant[]) => {
    const grantsSorted = [...grants].sort((a, b) => {
      if (a.grantName > b.grantName) return 1;
      else if (a.grantName < b.grantName) return -1;
      else return 0;
    });

    return grantsSorted;
  }, []);

  function dateSort() {
    if (sortKey !== 'desc') {
      grants.sort((a, b) => (a.closeDate > b.closeDate ? 1 : -1));
      setSortKey('desc');
    } else if (sortKey === 'desc') {
      grants.sort((a, b) => (a.closeDate > b.closeDate ? -1 : 1));
      setSortKey('asc');
    }
  }

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
            <div className="shadow border-b border-gray-200 sm:rounded-lg bg-white">
              <Search
                icon={FaSearch}
                placeholder="Search for a grant by name..."
                onChange={event => {
                  setSearchKey(event.target.value);
                }}
              />
              <table className="min-w-full divide-y divide-gray-200 overflow-y-auto">
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
                      <SortButton
                        onClick={() => dateSort()}
                        {...{
                          sortKey,
                        }}
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
                  {grants
                    .filter(obj => {
                      if (searchKey === '') {
                        return obj;
                      } else if (
                        obj.grantName
                          .toLowerCase()
                          .includes(searchKey.toLowerCase())
                      ) {
                        return obj;
                      }
                      return null;
                    })
                    .filter(obj => {
                      if (sortKey === '') {
                        return obj;
                      } else if (sortKey === 'asc') {
                        const currentDate = new Date();
                        const objDate = new Date(obj.closeDate);
                        if (objDate > currentDate) {
                          return obj;
                        }
                      } else if (sortKey === 'desc') {
                        const currentDate = new Date();
                        const objDate = new Date(obj.closeDate);
                        if (objDate > currentDate) {
                          return obj;
                        }
                      }
                      return null;
                    })
                    .map(grant => (
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
          </div>
        </div>
      </div>
    </Container>
  );
};

export default SearchPage;
