export interface DebitedTransactionDto {
  accountId: string;
  valueDeposit: string;
}

export interface TransferTransactionDto {
  toWhoWillSend: string;
  valueTransfer?: string;
  userId: string;
}

export interface TransactionsDto {
  accountId: string;
  userId: string;
  orderBy: 'asc' | 'desc';
}
