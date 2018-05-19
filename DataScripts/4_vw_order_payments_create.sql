USE `printmgr`;
CREATE 
     OR REPLACE ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `vw_order_payments` AS
    SELECT 
        `ord`.`order_id` AS `order_id`,
        `pmt`.`payment_date` AS `payment_date`,
        `pmt`.`payment_type_code` AS `payment_type_code`,
        `pmt`.`payment_amount` AS `payment_amount`,
        `ord`.`order_number` AS `order_number`,
        `ord`.`order_status` AS `order_status`,
        `ord`.`order_date` AS `order_date`,
        `ord`.`order_type` AS `order_type`,
        `ord`.`order_due_date` AS `order_due_date`,
        `ord`.`total` AS `total`,
        `ord`.`balance_due` AS `balance_due`,
        `ord`.`contact` AS `contact`,
        CONCAT(`usr`.`first_name`,
                ' ',
                `usr`.`last_name`) AS `taken_user`,
		CONCAT(`pmtusr`.`first_name`,
                ' ',
                `pmtusr`.`last_name`) AS `payment_user`,
        `cus`.`customer_name` AS `customer_name`
    FROM
        (((`printmgr`.`order_payments` `pmt`
        JOIN `printmgr`.`orders` `ord` ON ((`pmt`.`order_id` = `ord`.`order_id`)))
        JOIN `printmgr`.`customer` `cus` ON ((`cus`.`customer_id` = `ord`.`customer_id`)))
        JOIN `printmgr`.`users` `usr` ON ((`usr`.`user_id` = `ord`.`taken_user_id`))
        JOIN `printmgr`.`users` `pmtusr` ON ((`pmtusr`.`user_id` = `pmt`.`entered_user_id`)))
    ORDER BY `ord`.`order_number`
