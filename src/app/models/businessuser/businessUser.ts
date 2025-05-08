export interface BusinessUser {
    id: string;
    companyName: string;
    email: string;
    password: string;
    passwordHash: Uint8Array; 
    passwordSalt: Uint8Array;
    companyAddress: string;
  }
  