USE `printmgr`;
CREATE  OR REPLACE VIEW `vw_order_quantities` AS
SELECT a.order_id, a.order_number, a.order_type, d.description as 'order_type_desc', a.order_date, a.order_due_date, a.total,
b.customer_name,
SUM(c.item_quantity) as 'TOTAL_QTY'
FROM printmgr.orders a
INNER JOIN printmgr.customer b
  ON a.customer_id = b.customer_id
INNER JOIN printmgr.order_detail c
  ON a.order_id = c.order_id
INNER JOIN printmgr.lookup_items d
  ON a.order_type = d.char_mod
WHERE order_status = 'ord'
group by a.order_number, a.order_type, a.order_date, a.order_due_date, a.total
order by b.customer_name asc;