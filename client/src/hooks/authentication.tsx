import React, { createContext, useCallback, useContext, useState } from 'react';

import api from '../services/api';
import Permission from '../types/Permission';
import UserPermissionAssociation from '../types/UserPermissionAssociation';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthState {
  token: string;
  user: User;
  permissions: Permission[];
  userPermissionAssociations: UserPermissionAssociation[];
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  token: string;
  permissions: Permission[];
  userPermissionAssociations: UserPermissionAssociation[];
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): void;
  canAccess(permissionDisplayName: string): boolean;
}

const AuthenticationContext = createContext<AuthContextData>(
  {} as AuthContextData,
);

const AuthenticationProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@Grantify:token');
    const user = localStorage.getItem('@Grantify:user');

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;

      return {
        token,
        user: JSON.parse(user),
        permissions: [],
        userPermissionAssociations: [],
      };
    }
    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem('@Grantify:token', token);
    localStorage.setItem('@Grantify:user', JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${token}`;

    const permissions = await api
      .get<Permission[]>('permissions')
      .then(response => response.data)
      .catch(error => error);

    const userPermissionAssociations = await api
      .get<UserPermissionAssociation[]>(`users/${user.id}/user-permissions`)
      .then(response => response.data)
      .catch(error => error);

    setData({ token, user, permissions, userPermissionAssociations });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@Grantify:token');
    localStorage.removeItem('@Grantify:user');

    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    (user: User) => {
      localStorage.setItem('@Grantify:user', JSON.stringify(user));

      setData({
        token: data.token,
        user,
        permissions: data.permissions,
        userPermissionAssociations: data.userPermissionAssociations,
      });
    },
    [data.token, data.permissions, data.userPermissionAssociations],
  );

  const canAccess = useCallback(
    (permissionDisplayName: string): boolean => {
      const permissionMatches = data.permissions.filter(p =>
        data.userPermissionAssociations
          .map(upa => upa.permissionTypeId)
          .includes(p.id),
      );

      const displayNamePermissionMatches = permissionMatches.map(
        pm => pm.displayName,
      );

      return displayNamePermissionMatches.includes(permissionDisplayName);
    },
    [data.permissions, data.userPermissionAssociations],
  );

  return (
    <AuthenticationContext.Provider
      value={{
        user: data.user,
        token: data.token,
        permissions: data.permissions,
        userPermissionAssociations: data.userPermissionAssociations,
        signIn,
        signOut,
        updateUser,
        canAccess,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthenticationContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export { AuthenticationProvider, useAuth };
