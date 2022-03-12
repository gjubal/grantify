import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { v4 } from 'uuid';
import Button from '../../components/Button';
import SideBar from '../../components/SideBar';
import { useAuth } from '../../hooks/authentication';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';
import { Container } from './styles';

type Permission = {
  id: number;
  displayName: string;
};

type UserPermissionAssn = {
  id: string;
  userId: string;
  permissionTypeId: number;
};

const PermissionBoard: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <div className="flex">
      <SideBar signOut={signOut} />
      <div className="content-container">
        <div className="content-list">
          <h1 className="content-title">Permissions</h1>
          <PermissionsTable />
        </div>
      </div>
    </div>
  );
};

const PermissionsTable: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [currentPermissions, setCurrentPermissions] = useState<
    UserPermissionAssn[]
  >([]);

  const { id } = useParams<{ id: string }>();
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const handleToggle = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const permissionSwitchClicked = permissions.find(
        p => p.displayName === e.currentTarget.name,
      );

      if (permissionSwitchClicked) {
        if (e.currentTarget.checked) {
          const permToAdd: UserPermissionAssn = {
            id: v4(),
            permissionTypeId: permissionSwitchClicked.id,
            userId: id,
          };

          setCurrentPermissions([...currentPermissions, permToAdd]);
        } else {
          const permToRemove = currentPermissions.find(
            cp => cp.permissionTypeId === permissionSwitchClicked.id,
          );

          if (permToRemove) {
            setCurrentPermissions(
              currentPermissions.filter(cp => cp.id !== permToRemove.id),
            );
          }
        }
      }
    },
    [permissions, id, currentPermissions],
  );

  const handleSubmit = useCallback(async () => {
    try {
      const { data: currentAssociationsInDb } = await api.get<
        UserPermissionAssn[]
      >(`users/${id}/user-permissions`);

      // if permissions are active on interface but not in db, save new additions
      if (currentPermissions) {
        const associationsInStateButNotInDb = currentPermissions.filter(
          cp =>
            !currentAssociationsInDb.find(
              p => p.permissionTypeId === cp.permissionTypeId,
            ),
        );

        const permsInStateButNotInDb = permissions.filter(p =>
          associationsInStateButNotInDb.find(
            assn => p.id === assn.permissionTypeId,
          ),
        );

        if (associationsInStateButNotInDb) {
          permsInStateButNotInDb.forEach(async perm => {
            await api.post<UserPermissionAssn>(`users/${id}/user-permissions`, {
              displayName: perm.displayName,
            });
          });
        }
      }

      // if permissions are active in db but not on interface, remove from db
      if (currentAssociationsInDb) {
        const associationsInDbButNotInState = currentAssociationsInDb.filter(
          ca => !currentPermissions.find(cp => ca.id === cp.id),
        );

        if (associationsInDbButNotInState) {
          associationsInDbButNotInState.forEach(async assn => {
            await api.delete(`users/${id}/user-permissions/${assn.id}`);
          });
        }
      }

      addToast({
        type: 'success',
        title: 'Changes saved successfully!',
        description: 'Permissions have been updated.',
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Unable to update permissions',
        description: err,
      });
    }
  }, [addToast, currentPermissions, id, permissions]);

  useEffect(() => {
    api.get('permissions').then(response => setPermissions(response.data));

    if (id) {
      api
        .get(`users/${id}/user-permissions`)
        .then(response => setCurrentPermissions(response.data));
    }
  }, [id]);

  return (
    <Container>
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <div className="min-w-full divide-y divide-gray-200">
          <div className="bg-gray-50">
            <div className="flex flex-row justify-between">
              <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </div>
              <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </div>
            </div>
          </div>
          <div className="bg-white divide-y divide-gray-200">
            <Form ref={formRef} onSubmit={handleSubmit}>
              {permissions.map(permission => (
                <React.Fragment key={permission.id}>
                  <div className="flex flex-row items- justify-between">
                    <div className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {permission.displayName
                          .replace(/([A-Z])/g, match => ` ${match}`)
                          .replace(/^./, match => match.toUpperCase())
                          .trim()}
                      </div>
                    </div>
                    <div className="px-6 py-4 whitespace-nowrap">
                      <ToggleSwitch
                        name={permission.displayName}
                        permissionId={permission.id}
                        currentPermissions={currentPermissions}
                        onChange={e => handleToggle(e)}
                      />
                    </div>
                  </div>
                </React.Fragment>
              ))}
              <div className="px-6 py-4 mb-2 flex justify-center">
                <Button type="submit">Save changes</Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </Container>
  );
};

const ToggleSwitch: React.FC<{
  name: string;
  permissionId: number;
  currentPermissions: UserPermissionAssn[];
  onChange(e: React.ChangeEvent<HTMLInputElement>): void;
}> = ({ name, permissionId, currentPermissions, onChange }) => {
  return (
    <div className="flex items-center justify-center w-full">
      <label htmlFor={name} className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            id={name}
            name={name}
            type="checkbox"
            className="sr-only"
            checked={
              !!currentPermissions.find(
                cp => cp.permissionTypeId === permissionId,
              )
            }
            onChange={onChange}
          />
          <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
          <div className="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition"></div>
        </div>
      </label>
    </div>
  );
};

export default PermissionBoard;
