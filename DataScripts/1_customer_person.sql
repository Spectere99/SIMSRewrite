ALTER TABLE `printmgr`.`customer_person` 
ADD COLUMN `status_code` VARCHAR(5) NOT NULL DEFAULT 'act' AFTER `phone_2_ext`;
