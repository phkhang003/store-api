export interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface MessageResponse {
  message: string;
}

export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  role: string;
} 