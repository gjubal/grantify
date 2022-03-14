export type Grant = {
  id: string;
  grantName: string;
  openDate: string;
  closeDate: string;
  status: string;
  amountRequested: number;
  amountApproved?: number;
  writerName?: string;
  applicationUrl?: string;
  sponsoringAgency?: string;
  dateWhenFundsWereReceived?: string;
  expirationDate?: string;
  updatedAt?: string;
};
