import React, { useEffect, useState } from 'react';
import SideBar from '../../components/SideBar';
import { useAuth } from '../../hooks/authentication';

import api from '../../services/api';
import { Grant } from '../../types/Grant';
import { useToast } from '../../hooks/toast';
import isWithinDateRange from '../../utils/isWithinDateRange';
import { FiLink } from 'react-icons/fi';
import { Container, Fragment } from './styles';
import convertFromTimestampToString from '../../utils/convertFromTimestampToString';

const Home: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <div className="flex">
      <SideBar signOut={signOut} />
      <ContentContainer title="Dashboard" />
    </div>
  );
};

const ContentContainer: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="content-container">
      <div className="content-list">
        <h1 className="content-title">{title}</h1>
        <Dashboard />
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [grants, setGrants] = useState<Grant[]>([]);

  const { addToast } = useToast();
  const { signOut, canAccess } = useAuth();

  useEffect(() => {
    api
      .get<Grant[]>('grants')
      .then(response => setGrants(response.data))
      .catch(error => {
        if (error.response.error === 401) {
          addToast({
            type: 'error',
            title: 'Session expired',
            description: 'Please log in again.',
          });

          signOut();
        }

        return error;
      });
  }, [addToast, signOut]);

  return (
    <Fragment>
      <div className="overflow-y-auto">
        <div className="flex flex-row justify-center">
          <h1 className="text-gray-500 text-lg py-4">
            Upcoming application deadlines
          </h1>
        </div>
        <section className="flex flex-col">
          <DeadlineTable
            data={grants.filter(
              grant =>
                isWithinDateRange(new Date(grant.closeDate), 7) &&
                grant.status === 'Incomplete',
            )}
            canAccess={canAccess}
          />
        </section>
      </div>
    </Fragment>
  );
};

const DeadlineTable: React.FC<{
  data: Grant[];
  canAccess(permissionDisplayName: string): boolean;
}> = ({ data, canAccess }) => {
  return (
    <>
      {data.length !== 0 && (
        <Container>
          <div className="shadow overflow-y-auto border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Close date (Deadline)
                  </th>
                  <th
                    scope="col"
                    className="pl-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Application Url
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map(grant => (
                  <tr key={grant.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {grant.grantName}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {convertFromTimestampToString(grant.closeDate)}
                      </div>
                    </td>
                    <td className="flex flex-row justify-center py-4 whitespace-nowrap">
                      {grant.applicationUrl && canAccess('viewGrant') && (
                        <a
                          href={grant.applicationUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-indigo-500"
                        >
                          <FiLink size={20}>{grant.applicationUrl}</FiLink>
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      )}
    </>
  );
};

export default Home;
