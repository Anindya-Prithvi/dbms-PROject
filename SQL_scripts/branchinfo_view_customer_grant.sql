create view branchinfo as
select branch.IFSC_code, branch.address_locality, manager.empID, managerName
from branch, managedby, manager
where branch.IFSC_code = managedby.branch_id and manager.empID = managedby.manager_id;

-- grant select on branchinfo to 'bankadmin';
