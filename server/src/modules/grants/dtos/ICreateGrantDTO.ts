export default interface ICreateGrantDTO {
  grantName: string;
  openDate: Date;
  closeDate: Date;
  status: string;
  amountRequested: number;
  amountApproved: number;
  writerName: string;
  applicationUrl: string;
  sponsoringAgency: string;
  dateWhenFundsWereReceived: Date;
  expirationDate: Date;
  notes: string;
}
