drop view if exists allsavingsaccounttransactions;
drop view if exists allloanaccounttransactions;
drop view if exists allcreditcardaccounttransactions;
drop view if exists allcurrentaccounttransactions;

create view allsavingsaccounttransactions as 
select txnId,timeOfTransaction, toAccount, amount, savingsaccount.accountNo, savingsaccount.customerId, 'DEBIT' as creditOrDebit
from transaction, savingsaccount
where transaction.fromAccserialNo = savingsaccount.serialNo AND transaction.fromAcccustomerId = savingsaccount.customerId UNION 
select txnId,timeOfTransaction, toAccount, amount, savingsaccount.accountNo, savingsaccount.customerId, 'CREDIT' as creditOrDebit
from transaction, savingsaccount
WHERE transaction.toAccount = savingsaccount.accountNo;

create view allloanaccounttransactions as 
select txnId,timeOfTransaction, toAccount, amount, loanaccount.accountNo, loanaccount.customerId, 'DEBIT' as creditOrDebit
from transaction, loanaccount
where transaction.fromAccserialNo = loanaccount.serialNo AND transaction.fromAcccustomerId = loanaccount.customerId UNION 
select txnId,timeOfTransaction, toAccount, amount, loanaccount.accountNo, loanaccount.customerId, 'CREDIT' as creditOrDebit
from transaction, loanaccount
WHERE transaction.toAccount = loanaccount.accountNo;

create view allcreditcardaccounttransactions as 
select txnId,timeOfTransaction, toAccount, amount, creditcardaccount.accountNo, creditcardaccount.customerId, 'DEBIT' as creditOrDebit
from transaction, creditcardaccount
where transaction.fromAccserialNo = creditcardaccount.serialNo AND transaction.fromAcccustomerId = creditcardaccount.customerId UNION 
select txnId,timeOfTransaction, toAccount, amount, creditcardaccount.accountNo, creditcardaccount.customerId, 'CREDIT' as creditOrDebit
from transaction, creditcardaccount
WHERE transaction.toAccount = creditcardaccount.accountNo;

create view allcurrentaccounttransactions as 
select txnId,timeOfTransaction, toAccount, amount, currentaccount.accountNo, currentaccount.customerId, 'DEBIT' as creditOrDebit
from transaction, currentaccount
where transaction.fromAccserialNo = currentaccount.serialNo AND transaction.fromAcccustomerId = currentaccount.customerId UNION 
select txnId,timeOfTransaction, toAccount, amount, currentaccount.accountNo, currentaccount.customerId , 'CREDIT' as creditOrDebit
from transaction, currentaccount
WHERE transaction.toAccount = currentaccount.accountNo;

-- grant select on customerInfo to 'dummyUser2';

-- select * from allSavingsAccountTransactions;

-- select * from allSavingsAccountTransactions;
