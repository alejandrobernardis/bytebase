// Auth

// For now, a single user's auth provider should either belong to  GITLAB_SELF_HOST or BYTEBASE
export type AuthProviderType = "GITLAB_SELF_HOST" | "BYTEBASE";

export type LoginInfo = {
  authProvider: AuthProviderType;
  payload: VCSLoginInfo | BytebaseLoginInfo;
};

export type SignupInfo = {
  email: string;
  password: string;
  name: string;
};

export type ActivateInfo = {
  email: string;
  password: string;
  name: string;
  token: string;
};

export type BytebaseLoginInfo = {
  email: string;
  password: string;
};

export type AuthProvider = {
  type: AuthProviderType;
  instanceUrl: string;
  applicationId: string;
  secret: string;
};

export const EmptyAuthProvider: AuthProvider = {
  type: "BYTEBASE",
  instanceUrl: "",
  applicationId: "",
  secret: "",
};

export type VCSLoginInfo = {
  applicationId: string;
  secret: string;
  instanceUrl: string;
  accessToken: string;
};
