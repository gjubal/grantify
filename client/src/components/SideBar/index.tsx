import { useCallback, useEffect, useState } from 'react';
import {
  BsPlus,
  BsPower,
  BsClipboardData,
  BsGear,
  BsPeopleFill,
  BsSearch,
} from 'react-icons/bs';
import { FaFire } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/authentication';
import api from '../../services/api';
import Permission from '../../types/Permission';
import UserPermissionAssociation from '../../types/UserPermissionAssociation';

const SideBar: React.FC<{ signOut(): void }> = ({ signOut }) => {
  const [userPermissionAssociations, setUserPermissionAssociations] = useState<
    UserPermissionAssociation[]
  >([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const { user } = useAuth();

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
      .get<UserPermissionAssociation[]>(`users/${user.id}/user-permissions`)
      .then(response => setUserPermissionAssociations(response.data))
      .catch(error => error);
    api
      .get<Permission[]>('permissions')
      .then(response => setPermissions(response.data))
      .catch(error => error);
  }, [user.id]);
  return (
    <div
      className="top-0 left-0 h-screen flex flex-col w-16
                  bg-white dark:bg-gray-900 shadow-xl border"
    >
      <div className="flex-auto">
        <Link to="/home">
          <SideBarIcon icon={<FaFire size="28" />} />
        </Link>
        <Divider />
      </div>
      <div className="flex-auto">
        {canAccess('addGrant') && (
          <Link to="/grants/add">
            <SideBarIcon icon={<BsPlus size="32" />} text="Add a new grant" />
          </Link>
        )}
        <Link to="/grants/search">
          <SideBarIcon
            icon={<BsSearch size="20" />}
            text="Search for a grant"
          />
        </Link>
        <Link to="/grants">
          <SideBarIcon
            icon={<BsClipboardData size="20" />}
            text="View all grants"
          />
        </Link>
        <Link to="/users">
          <SideBarIcon
            icon={<BsPeopleFill size="20" />}
            text="View all users"
          />
        </Link>
      </div>
      <div className="flex-end">
        <Link to="/profile">
          <SideBarIcon icon={<BsGear size="20" />} text="Profile" />
        </Link>
        <button type="submit" onClick={signOut}>
          <SideBarIcon icon={<BsPower size="20" />} text="Log out" />
        </button>
      </div>
    </div>
  );
};

const SideBarIcon: React.FC<{ icon: JSX.Element; text?: string }> = ({
  icon,
  text,
}) => (
  <div className="sidebar-icon group">
    {icon}
    {text && (
      <span className="sidebar-tooltip group-hover:scale-100">{text}</span>
    )}
  </div>
);

const Divider = () => <hr className="sidebar-hr" />;

export default SideBar;
