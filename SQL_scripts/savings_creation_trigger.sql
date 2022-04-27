
drop trigger if exists after_accounttype_insert;

delimiter //
CREATE TRIGGER after_accounttype_insert AFTER INSERT
ON accounttype
FOR EACH ROW
insert into savingsaccount
values (FLOOR(RAND()*(100000000000000000)), 2000, 2000, 3.2, new.serialNo, new.customer_id);
//
delimiter ;
