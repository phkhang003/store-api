export interface IPermission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
}

export interface IRole {
  name: string;
  permissions: IPermission[];
}

export const createPermission = (
  resource: string,
  action: 'create' | 'read' | 'update' | 'delete'
): IPermission => ({
  resource,
  action
}); 