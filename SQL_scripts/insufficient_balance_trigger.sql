DROP TRIGGER IF EXISTS before_transaction_insert;

DELIMITER $$
create TRIGGER before_transaction_insert BEFORE INSERT
on transaction
FOR EACH ROW
IF 
((NEW.amount > (SELECT balance from savingsaccount as sa where (NEW.fromAccserialNo =  sa.serialNo AND NEW.fromAcccustomerId = sa.customerId)))
OR
(NEW.amount > (SELECT balance from currentaccount as ca where (NEW.fromAccserialNo =  ca.serialNo AND NEW.fromAcccustomerId = ca.customerId)))
OR
(NEW.amount > (SELECT creditLimit - creditSpent from creditcardaccount as cca where (NEW.fromAccserialNo =  cca.serialNo AND NEW.fromAcccustomerId = cca.customerId)))
OR
(NEW.amount > (SELECT principal from loanaccount as la where (NEW.fromAccserialNo =  la.serialNo AND NEW.fromAcccustomerId = la.customerId))))

THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient Balance.';
END IF; $$
DELIMITER ; 
