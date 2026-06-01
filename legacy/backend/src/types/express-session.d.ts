import 'express-session';

declare module 'express-session' {
  interface SessionData {
    views?: number;
    userId?: string;
    isLoggedIn?: boolean;
    orderId?: string;
  }
}
