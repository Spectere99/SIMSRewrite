 ALTER TABLE `printmgr`.`customer` 
CHANGE COLUMN `customer_id` `customer_id` INT(10) NOT NULL AUTO_INCREMENT ;

ALTER TABLE `printmgr`.`customer_address` 
CHANGE COLUMN `customer_address_id` `customer_address_id` INT(10) NOT NULL AUTO_INCREMENT ;

ALTER TABLE `printmgr`.`customer_person` 
CHANGE COLUMN `customer_person_id` `customer_person_id` INT(10) NOT NULL AUTO_INCREMENT ;

ALTER TABLE `printmgr`.`customer_notes` 
CHANGE COLUMN `customer_notes_id` `customer_notes_id` INT(10) NOT NULL AUTO_INCREMENT ;

ALTER TABLE `printmgr`.`order_art_file` 
CHANGE COLUMN `order_art_id` `order_art_id` BIGINT(20) NOT NULL AUTO_INCREMENT ;

ALTER TABLE `printmgr`.`order_art_placement` 
CHANGE COLUMN `order_art_placement_id` `order_art_placement_id` INT(10) NOT NULL AUTO_INCREMENT ;

ALTER TABLE `printmgr`.`order_fees` 
CHANGE COLUMN `order_fee_id` `order_fee_id` INT(10) NOT NULL AUTO_INCREMENT ;

ALTER TABLE `printmgr`.`order_detail` 
CHANGE COLUMN `order_detail_id` `order_detail_id` INT(10) NOT NULL AUTO_INCREMENT ;

ALTER TABLE `printmgr`.`order_art_placement` 
CHANGE COLUMN `order_art_placement_id` `order_art_placement_id` INT(10) NOT NULL AUTO_INCREMENT ;

ALTER TABLE `printmgr`.`order_notes` 
CHANGE COLUMN `order_notes_id` `order_notes_id` INT(10) NOT NULL AUTO_INCREMENT ;

ALTER TABLE `printmgr`.`order_payments` 
CHANGE COLUMN `order_payment_id` `order_payment_id` INT(10) NOT NULL AUTO_INCREMENT ;

ALTER TABLE `printmgr`.`orders` 
CHANGE COLUMN `order_id` `order_id` INT(10) NOT NULL AUTO_INCREMENT ;

ALTER TABLE `printmgr`.`order_status_history` 
CHANGE COLUMN `order_status_history_id` `order_status_history_id` INT(10) NOT NULL AUTO_INCREMENT ;

ALTER TABLE `printmgr`.`correspondence` 
CHANGE COLUMN `correspondence_id` `correspondence_id` INT(10) NOT NULL AUTO_INCREMENT ;

ALTER TABLE `printmgr`.`users` 
CHANGE COLUMN `user_id` `user_id` INT(10) NOT NULL AUTO_INCREMENT ;

ALTER TABLE `printmgr`.`lookup_items` 
CHANGE COLUMN `id` `id` INT(10) NOT NULL AUTO_INCREMENT ;
