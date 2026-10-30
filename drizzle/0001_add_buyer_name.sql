ALTER TABLE "orders"
ADD COLUMN IF NOT EXISTS "buyer_name" varchar(255);
