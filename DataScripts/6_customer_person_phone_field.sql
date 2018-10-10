ALTER TABLE `printmgr`.`customer_person` 
CHANGE COLUMN `phone_1` `phone_1` VARCHAR(15) NULL DEFAULT NULL ,
CHANGE COLUMN `phone_2` `phone_2` VARCHAR(15) NULL DEFAULT NULL ;

ALTER TABLE `printmgr`.`orders` 
CHANGE COLUMN `contact_phone1` `contact_phone1` VARCHAR(15) NULL DEFAULT NULL ,
CHANGE COLUMN `contact_phone2` `contact_phone2` VARCHAR(15) NULL DEFAULT NULL ;
