use bdsm;
drop view allsavingsaccounttransactions;
drop view allloanaccounttransactions;
drop view allcreditcardaccounttransactions;
drop view allcurrentaccounttransactions;



create view allSavingsAccountTransactions as 
select txnId,timeOfTransaction, toAccount, amount, savingsaccount.accountNo, savingsaccount.customerId, 'DEBIT'
from transaction, savingsaccount
where transaction.fromAccserialNo = savingsaccount.serialNo AND transaction.fromAcccustomerId = savingsaccount.customerId UNION 
select txnId,timeOfTransaction, toAccount, amount, savingsaccount.accountNo, savingsaccount.customerId, 'CREDIT'
from transaction, savingsaccount
WHERE transaction.toAccount = savingsaccount.accountNo;

create view allLoanAccountTransactions as 
select txnId,timeOfTransaction, toAccount, amount, loanaccount.accountNo, loanaccount.customerId, 'DEBIT'
from transaction, loanaccount
where transaction.fromAccserialNo = loanaccount.serialNo AND transaction.fromAcccustomerId = loanaccount.customerId UNION 
select txnId,timeOfTransaction, toAccount, amount, loanaccount.accountNo, loanaccount.customerId, 'CREDIT'
from transaction, loanaccount
WHERE transaction.toAccount = loanaccount.accountNo;

create view allcreditcardaccounttransactions as 
select txnId,timeOfTransaction, toAccount, amount, creditcardaccount.accountNo, creditcardaccount.customerId, 'DEBIT'
from transaction, creditcardaccount
where transaction.fromAccserialNo = creditcardaccount.serialNo AND transaction.fromAcccustomerId = creditcardaccount.customerId UNION 
select txnId,timeOfTransaction, toAccount, amount, creditcardaccount.accountNo, creditcardaccount.customerId, 'CREDIT'
from transaction, creditcardaccount
WHERE transaction.toAccount = creditcardaccount.accountNo;

create view allcurrentaccounttransactions as 
select txnId,timeOfTransaction, toAccount, amount, currentaccount.accountNo, currentaccount.customerId, 'DEBIT'
from transaction, currentaccount
where transaction.fromAccserialNo = currentaccount.serialNo AND transaction.fromAcccustomerId = currentaccount.customerId UNION 
select txnId,timeOfTransaction, toAccount, amount, currentaccount.accountNo, currentaccount.customerId , 'CREDIT'
from transaction, currentaccount
WHERE transaction.toAccount = currentaccount.accountNo;

CREATE USER 'branchManager'@'localhost' IDENTIFIED BY 'password';
grant select on customerInfo to 'branchManager'@'localhost';