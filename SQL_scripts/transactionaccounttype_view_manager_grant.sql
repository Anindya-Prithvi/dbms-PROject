use bdsm;
drop view allsavingsaccounttransactions;
drop view allloanaccounttransactions;
drop view allcreditcardaccounttransactions;
drop view allcurrentaccounttransactions;



create view allSavingsAccountTransactions as 
select txnId, toAccount, amount, savingsaccount.accountNo, savingsaccount.customerId
from transaction, savingsaccount
where transaction.fromAccserialNo = savingsaccount.serialNo AND transaction.fromAcccustomerId = savingsaccount.customerId UNION 
select txnId, toAccount, amount, savingsaccount.accountNo, savingsaccount.customerId
from transaction, savingsaccount
WHERE transaction.toAccount = savingsaccount.accountNo;

create view allLoanAccountTransactions as 
select txnId, toAccount, amount, loanaccount.accountNo, loanaccount.customerId
from transaction, loanaccount
where transaction.fromAccserialNo = loanaccount.serialNo AND transaction.fromAcccustomerId = loanaccount.customerId UNION 
select txnId, toAccount, amount, loanaccount.accountNo, loanaccount.customerId
from transaction, loanaccount
WHERE transaction.toAccount = loanaccount.accountNo;

create view allcreditcardaccounttransactions as 
select txnId, toAccount, amount, creditcardaccount.accountNo, creditcardaccount.customerId
from transaction, creditcardaccount
where transaction.fromAccserialNo = creditcardaccount.serialNo AND transaction.fromAcccustomerId = creditcardaccount.customerId UNION 
select txnId, toAccount, amount, creditcardaccount.accountNo, creditcardaccount.customerId
from transaction, creditcardaccount
WHERE transaction.toAccount = creditcardaccount.accountNo;

create view allcurrentaccounttransactions as 
select txnId, toAccount, amount, currentaccount.accountNo, currentaccount.customerId
from transaction, currentaccount
where transaction.fromAccserialNo = currentaccount.serialNo AND transaction.fromAcccustomerId = currentaccount.customerId UNION 
select txnId, toAccount, amount, currentaccount.accountNo, currentaccount.customerId
from transaction, currentaccount
WHERE transaction.toAccount = currentaccount.accountNo;

CREATE USER 'branchManager'@'localhost' IDENTIFIED BY 'password';
grant select on customerInfo to 'branchManager'@'localhost';