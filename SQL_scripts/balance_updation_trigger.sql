DROP TRIGGER IF EXISTS after_transaction_insert;

DELIMITER $$ 
create TRIGGER after_transaction_insert AFTER INSERT
on transaction
FOR EACH ROW
BEGIN
UPDATE savingsaccount
SET balance = balance + new.amount 
WHERE new.toAccount = savingsaccount.accountNo;

UPDATE currentaccount
SET balance = balance + new.amount
WHERE new.toAccount = currentaccount.accountNo;

UPDATE loanaccount
SET amountDue = amountDue + new.amount
WHERE new.toAccount = loanaccount.accountNo;

UPDATE creditcardaccount
SET amountDue = amountDue + new.amount
WHERE new.toAccount = creditcardaccount.accountNo;

UPDATE savingsaccount
SET balance = balance - new.amount 
WHERE NEW.fromAccserialNo =  savingsaccount.serialNo AND NEW.fromAcccustomerId = savingsaccount.customerId;

UPDATE currentaccount
SET balance = balance - new.amount 
WHERE NEW.fromAccserialNo =  currentaccount.serialNo AND NEW.fromAcccustomerId = currentaccount.customerId;

UPDATE loanaccount
SET amountDue = amountDue - new.amount
WHERE NEW.fromAccserialNo =  loanaccount.serialNo AND NEW.fromAcccustomerId = loanaccount.customerId;

UPDATE creditcardaccount
SET amountDue = amountDue - new.amount
WHERE NEW.fromAccserialNo =  creditcardaccount.serialNo AND NEW.fromAcccustomerId = creditcardaccount.customerId;

END $$

DELIMITER ;
