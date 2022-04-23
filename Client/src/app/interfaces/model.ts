export type messageType = 'error' | 'success' | 'info' | 'warning';
export type creditDebitIndType = 'C' | 'D';

export interface DateRangeModel {
  dateRange: Number;
}

export interface MonthRange {
  monthRange: number;
}

export interface AlertObjectModel {
  alertMessage: string;
  alertType: messageType;
}

export interface SectionDetailsModel {
  label?: string;
  value?: string;
  cdInd?: string;
}

export interface SectionDetailsRespModel extends SectionDetailsModel {
  isExpanded?: boolean;
}

export interface TransDetails {
  _id?: any;
  creationDate?: Date;
  transDate: Date;
  creditDebitInd: string;
  sectionValue: string;
  transAmount: string;
  note: string;
}

export interface TransDetailsWithBlnc extends TransDetails {
  currBalance?: number;
  trxClicked?: boolean;
}

export interface UserDetails {
  creationDate?: Date;
  firstName?: string;
  lastName?: string;
  emailId?: string;
  passWord?: string;
  transactions?: TransDetails[];
}
