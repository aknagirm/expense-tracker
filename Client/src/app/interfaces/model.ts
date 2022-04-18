export type messageType = 'error' | 'success' | 'info' | 'warning';
export type creditDebitIndType = 'C' | 'D';

export interface MonthRange {
  monthRange: number;
}

export interface AlertObjectModel {
  alertMessage: string;
  alertType: messageType;
}

export interface SectionDetailsModel {
  label?: String;
  value?: String;
  cdInd?: String;
}

export interface TransDetails {
  creationDate?: Date;
  transDate: Date;
  creditDebitInd: String;
  sectionValue: String;
  transAmount: String;
  note: String;
}

export interface UserDetails {
  creationDate?: Date;
  firstName?: String;
  lastName?: String;
  emailId?: String;
  passWord?: String;
  transactions?: TransDetails[];
}
