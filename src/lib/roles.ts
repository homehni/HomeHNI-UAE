export type Role =
  | 'owner'
  | 'agent'
  | 'builder'
  | 'agency'
  | 'service_provider'
  | 'buyer'
  | 'admin';

export const ROLES: Role[] = [
  'owner',
  'agent',
  'builder',
  'agency',
  'service_provider',
  'buyer',
  'admin'
];

export function isValidRole(r: string): r is Role {
  return ROLES.includes(r as Role);
}