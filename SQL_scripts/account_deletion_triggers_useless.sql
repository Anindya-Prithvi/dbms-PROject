CREATE TRIGGER after_savings_delete AFTER DELETE
ON savingsaccount
FOR EACH ROW
DELETE FROM accounttype WHERE old.serialNo = accountype.serialNo AND old.customerId = accounttype.customer_id;

CREATE TRIGGER after_current_delete AFTER DELETE
ON currentaccount
FOR EACH ROW
DELETE FROM accounttype WHERE old.serialNo = accountype.serialNo AND old.customerId = accounttype.customer_id;

CREATE TRIGGER after_credit_delete AFTER DELETE
ON creditcardaccount
FOR EACH ROW
DELETE FROM accounttype WHERE old.serialNo = accountype.serialNo AND old.customerId = accounttype.customer_id;

CREATE TRIGGER after_loan_delete AFTER DELETE
ON loanaccount
FOR EACH ROW
DELETE FROM accounttype WHERE old.serialNo = accountype.serialNo AND old.customerId = accounttype.customer_id;