use bdsm;
drop trigger before_savings_insert;
drop trigger before_creditcard_insert;
drop trigger before_loan_insert;

DELIMITER $$
CREATE TRIGGER before_savings_insert BEFORE INSERT
ON savingsaccount
FOR EACH ROW
IF new.minBalance < 100
THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Min Balance is too less';
END IF; $$


DELIMITER $$
CREATE TRIGGER before_loan_insert BEFORE INSERT
ON loanaccount
FOR EACH ROW
IF new.principal > 10694711610
THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Loan Ammount cannot be this high';
END IF; $$
DELIMITER ; 

DELIMITER $$
CREATE TRIGGER before_creditcard_insert BEFORE INSERT
ON creditcardaccount
FOR EACH ROW
IF new.creditLimit > 99982284480
THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Credit Limit Cannot be this high';
END IF; $$
DELIMITER ; 
DELIMITER ; 
