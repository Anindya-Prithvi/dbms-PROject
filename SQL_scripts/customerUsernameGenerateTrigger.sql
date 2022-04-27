use bdsm;
drop trigger before_customer_insert;
delimiter //
CREATE TRIGGER before_customer_insert BEFORE INSERT
ON customers
FOR EACH ROW
IF ISNULL(new.username)
THEN 

set new.username = CONCAT(new.customerName ,new.pancard);


END IF; //
delimiter ;

