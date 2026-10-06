export interface LoginResponse {
  access_token: string;
}

//Arguments for login API
export type LoginArgs = {
  email: string;
  password: string;
};
