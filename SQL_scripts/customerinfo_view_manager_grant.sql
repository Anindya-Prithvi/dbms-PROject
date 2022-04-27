create view customerInfo as
select customerName, pancard, address_flatno,
address_locality, address_state, address_country, creditScore,
phone_countryCode, phone_number
from customers;
-- grant select on customerInfo to bankadmin;
