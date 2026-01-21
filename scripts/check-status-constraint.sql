-- Check the print_history status constraint
SELECT conname, pg_get_constraintdef(oid) as constraint_def
FROM pg_constraint 
WHERE conname = 'print_history_status_check';