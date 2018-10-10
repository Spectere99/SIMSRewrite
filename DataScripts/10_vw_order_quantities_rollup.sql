CREATE VIEW `vw_order_quantities_rollup` AS
SELECT  
order_id AS id, order_due_date,
SUM(case when order_type = 'gmton' then TOTAL_QTY else 0 end) as 'garments_only',
SUM(case when order_type = 'scrn' then TOTAL_QTY else 0 end) as 'screen_prints',
SUM(case when order_type = 'rescr' then TOTAL_QTY else 0 end) as 'screen_prints_reorder',
SUM(case when order_type = 'emb' then TOTAL_QTY else 0 end) as 'embroidery',
SUM(case when order_type = 'reemb' then TOTAL_QTY else 0 end) as 'embroidery_reorder',
SUM(case when order_type = 'lasr' then TOTAL_QTY else 0 end) as 'laser_engraving',
SUM(case when order_type = 'adsp' then TOTAL_QTY else 0 end) as 'ad_specialty',
SUM(TOTAL_QTY) as 'TOTAL_QTY'
FROM printmgr.vw_order_quantities
group by order_due_date
order by order_id asc;
