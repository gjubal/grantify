import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import SideBar from '../../components/SideBar';
import { useAuth } from '../../hooks/authentication';

import api from '../../services/api';
import { Grant } from '../../types/Grant';
import { useToast } from '../../hooks/toast';
import UserPermissionAssociation from '../../types/UserPermissionAssociation';
import Permission from '../../types/Permission';
import convertFromTimestampToString from '../../utils/convertFromTimestampToString';
import { formatDistanceToNow } from 'date-fns';
import isWithinDateRange from '../../utils/isWithinDateRange';
import { Link } from 'react-router-dom';
import { FiLink } from 'react-icons/fi';

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
  const [userPermissionAssociations, setUserPermissionAssociations] = useState<
    UserPermissionAssociation[]
  >([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const history = useHistory();

  const { addToast } = useToast();
  const { user, token, signOut } = useAuth();

  const canAccess = useCallback(
    (permissionDisplayName: string): boolean => {
      const permissionMatches = permissions.filter(p =>
        userPermissionAssociations
          .map(upa => upa.permissionTypeId)
          .includes(p.id),
      );

      const displayNamePermissionMatches = permissionMatches.map(
        pm => pm.displayName,
      );

      return displayNamePermissionMatches.includes(permissionDisplayName);
    },
    [permissions, userPermissionAssociations],
  );

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

  useEffect(() => {
    api
      .get<UserPermissionAssociation[]>(`users/${user.id}/user-permissions`)
      .then(response => setUserPermissionAssociations(response.data))
      .catch(error => error);
    api
      .get<Permission[]>('permissions')
      .then(response => setPermissions(response.data))
      .catch(error => error);
  }, [history, signOut, token, user.id]);

  return (
    <div className="overflow-y-auto">
      <div>
        <h1 className="text-gray-500 text-lg py-4">
          Upcoming application deadlines
        </h1>
      </div>
      <section className="flex flex-col">
        <DeadlineTable
          data={grants.filter(grant =>
            isWithinDateRange(new Date(grant.closeDate), 7),
          )}
        />
      </section>
      <div>
        <h1 className="text-gray-500 text-lg py-4">
          Grants changed in the last 7 days
        </h1>
        <section className="grid grid-cols-3 gap-4">
          <DataBox
            title="Approved"
            data={grants.filter(
              grant =>
                grant.updatedAt &&
                grant.status === 'Approved' &&
                isWithinDateRange(new Date(grant.updatedAt), 7),
            )}
            canAccess={canAccess}
          />
          <DataBox
            title="Declined"
            data={grants.filter(
              grant =>
                grant.updatedAt &&
                grant.status === 'Declined' &&
                isWithinDateRange(new Date(grant.updatedAt), 7),
            )}
            canAccess={canAccess}
          />
          <DataBox
            title="Pending"
            data={grants.filter(
              grant =>
                grant.updatedAt &&
                grant.status === 'Pending' &&
                isWithinDateRange(new Date(grant.updatedAt), 7),
            )}
            canAccess={canAccess}
          />
          <DataBox
            title="Missed Deadline"
            data={grants.filter(
              grant =>
                grant.updatedAt &&
                grant.status === 'Missed Deadline' &&
                isWithinDateRange(new Date(grant.updatedAt), 7),
            )}
            canAccess={canAccess}
          />
          <DataBox
            title="Incomplete"
            data={grants.filter(
              grant =>
                grant.updatedAt &&
                grant.status === 'Incomplete' &&
                isWithinDateRange(new Date(grant.updatedAt), 7),
            )}
            canAccess={canAccess}
          />
          <DataBox
            title="Inactive"
            data={grants.filter(
              grant =>
                grant.updatedAt &&
                grant.status === 'Inactive' &&
                isWithinDateRange(new Date(grant.updatedAt), 7),
            )}
            canAccess={canAccess}
          />
        </section>
      </div>
    </div>
  );
};

const DeadlineTable: React.FC<{ data: Grant[] }> = ({ data }) => {
  return (
    <>
      {data.length !== 0 && (
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
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                      {convertFromTimestampToString(grant.closeDate)} -{' '}
                      {formatDistanceToNow(new Date(grant.closeDate))} from
                      today
                    </div>
                  </td>
                  <td className="flex flex-row justify-center py-4 whitespace-nowrap">
                    {grant.applicationUrl && (
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
      )}
    </>
  );
};

const DataBox: React.FC<{
  title: string;
  data: Grant[];
  canAccess?(displayName: string): boolean;
}> = ({ title, data, canAccess }) => {
  return (
    <>
      {data.length !== 0 && (
        <div className="bg-white my-4 p-6 rounded-xl mx-2 shadow-md">
          <div className="text-gray-500 mb-3">
            <h4>{title}</h4>
          </div>
          <div>
            {data.map(
              grant =>
                grant.updatedAt && (
                  <h3 key={grant.id}>
                    {canAccess && canAccess('viewGrant') ? (
                      <Link to={`grants/view/${grant.id}`}>
                        {grant.grantName}
                      </Link>
                    ) : (
                      <>{grant.grantName}</>
                    )}
                  </h3>
                ),
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
