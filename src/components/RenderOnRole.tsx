import React from 'react';
// @ts-expect-error TS(7016): Could not find a declaration file for module '../s... Remove this comment to see the full error message
import UserService from '../services/UserService';

type Props = {
  roles: string[];
  children: React.ReactNode;
};

function RenderOnRole({ roles, children }: Props) {
  return UserService.hasRole(roles) ? children : null;
}

export default RenderOnRole;
