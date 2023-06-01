export interface AuthToken {
  /**
   * Access token
   */
  access_token: string;

  /**
   * Access token expiration
   */
  at_expiry: number;

  /**
   * Refresh token
   */
  refresh_token: string;
}
