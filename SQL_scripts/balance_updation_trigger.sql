USE bdsm;
DROP TRIGGER after_transaction_insert;

DELIMITER $$ 
create TRIGGER after_transaction_insert AFTER INSERT
on bdsm.transaction
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




-- IF 
-- ((NEW.TOA > (SEL balance from bdsm.savingsaccount as sa where (NEW.fromAccserialNo =  sa.serialNo AND NEW.fromAcccustomerId = sa.customerId)))
-- OR
-- (NEW.amount > (SELECT balance from bdsm.currentaccount as ca where (NEW.fromAccserialNo =  ca.serialNo AND NEW.fromAcccustomerId = ca.customerId)))
-- OR
-- (NEW.amount > (SELECT creditLimit - creditSpent from bdsm.creditcardaccount as cca where (NEW.fromAccserialNo =  cca.serialNo AND NEW.fromAcccustomerId = cca.customerId)))
-- OR
-- (NEW.amount > (SELECT principal from bdsm.loanaccount as la where (NEW.fromAccserialNo =  la.serialNo AND NEW.fromAcccustomerId = la.customerId))))

-- THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient Balance.';
-- END IF; $$
-- DELIMITER ; 
