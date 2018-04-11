USE `printmgr`;
CREATE  OR REPLACE VIEW `vw_order_info` AS

SELECT 
	ord.order_id,
    ord.order_number,
    ord.order_status,
    ord.order_date,
    ord.order_due_date,
    ord.order_type,
    ord.contact,
    cus.customer_name,
	COUNT(ordd.order_detail_id) as `ItemCount`
    FROM orders ord
         INNER JOIN customer cus ON (cus.customer_id = ord.customer_id)
         JOIN order_detail ordd ON (ordd.order_id = ord.order_id)
	GROUP BY ord.order_id
    ORDER BY ord.order_date;
	
	