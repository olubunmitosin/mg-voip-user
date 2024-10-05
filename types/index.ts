import { SVGProps } from "react";
import * as SIP from "sip.js";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type CardProps = {
  icon: string,
  title: string,
  value: string
}

export type CallCenterProps = {
  credentials: any,
  username: string,
  password: string
}

export type NavItemProps = {
  icon: string,
  title: string,
  path: string,
  isActive: boolean
}

export type CredentialProps = {
  icon: string,
  title: string,
  path: string,
  isActive: boolean
}

export type sessionListProps = {
  id: number,
  session_id: string,
  from: string,
  to: string,
  direction: string,
  duration: string,
  status: string,
  created_at: string,
  updated_at: string,
}

export interface UserProps {
  first_name: string,
  last_name: string,
  email: string,
  changed_default_password: boolean,
  active: boolean,
  login_count: string,
  middle_name?: string,
  name: string,
  phone: string,
  [key: string]: any,
}

export type AuthStateProps = {
  access_token?: string,
  refresh_token?: string,
  token_type?: string,
  expires_at?: string,
  user: UserProps | null,
  layoutSize: string,
  addToken: (token: string, refresh_token: string, token_type: string, expires_at: string) => void,
  addUser: (user: UserProps) => void,
  removeToken: () => void,
  toggleItem: (size: string) => void
}

export interface ApiResponseInterface {
  status: boolean;
  data: any;
}

export interface GenerateStateProps {
  data: {},
  insertItem: (key: string, value: any) => void,
  removeItem: (key: string) => void
}
