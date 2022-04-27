CREATE INDEX sortByPancard
 ON transaction(fromAcccustomerId, toAccount);
 
 create INDEX AccountsByType 
 on accounttype(typeAccount);