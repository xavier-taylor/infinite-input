select
  name,
  setting,
  unit,
  short_desc
from pg_settings
where name in (
  'force_parallel_mode',
  'min_parallel_relation_size',
  'parallel_setup_cost',
  'parallel_tuble_cost',
  'max_parallel_workers_per_gather',
	'max_parallel_workers',
'max_worker_processes')
  limit 10 ;
  
  
  --SET max_parallel_workers_per_gather = 10;
  --SET max_parallel_workers = 10;
 -- SET max_worker_processes = 10; dunno how to set as need to restart server...
  