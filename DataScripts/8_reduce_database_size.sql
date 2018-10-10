DELETE FROM printmgr.order_detail 
WHERE order_id in (SELECT order_id from printmgr.orders WHERE 
order_date <= '2013-01-01');

DELETE FROM printmgr.order_fees
WHERE order_id in (SELECT order_id from printmgr.orders WHERE 
order_date <= '2013-01-01');

DELETE FROM printmgr.order_art_placement 
WHERE order_id in (SELECT order_id from printmgr.orders WHERE 
order_date <= '2013-01-01');

DELETE FROM printmgr.order_notes
WHERE order_id in (SELECT order_id from printmgr.orders WHERE 
order_date <= '2013-01-01');

DELETE FROM printmgr.order_payments
WHERE order_id in (SELECT order_id from printmgr.orders WHERE 
order_date <= '2013-01-01');

DELETE FROM printmgr.order_status_history 
WHERE order_id in (SELECT order_id from printmgr.orders WHERE 
order_date <= '2013-01-01');

DELETE FROM printmgr.order_task
WHERE order_id in (SELECT order_id from printmgr.orders WHERE 
order_date <= '2013-01-01');