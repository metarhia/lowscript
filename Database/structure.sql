CREATE TABLE "Account" (
  "accountId" bigint generated always as identity,
  "login" varchar(64) NOT NULL,
  "password" varchar NOT NULL
);

ALTER TABLE "Account" ADD CONSTRAINT "pkAccount" PRIMARY KEY ("accountId");
CREATE UNIQUE INDEX "akAccountLogin" ON "Account" ("login");
CREATE TABLE "Carrier" (
  "carrierId" bigint generated always as identity,
  "name" varchar NOT NULL
);

ALTER TABLE "Carrier" ADD CONSTRAINT "pkCarrier" PRIMARY KEY ("carrierId");
CREATE UNIQUE INDEX "akCarrierName" ON "Carrier" ("name");
CREATE TABLE "Product" (
  "productId" bigint generated always as identity,
  "name" varchar NOT NULL,
  "description" varchar NOT NULL,
  "amount" integer NOT NULL
);

ALTER TABLE "Product" ADD CONSTRAINT "pkProduct" PRIMARY KEY ("productId");
CREATE UNIQUE INDEX "akProductName" ON "Product" ("name");
CREATE TABLE "Order" (
  "orderId" bigint generated always as identity,
  "productId" bigint NOT NULL,
  "buyerId" bigint NOT NULL,
  "carrierId" bigint NOT NULL,
  "amount" integer NOT NULL,
  "total" integer NOT NULL,
  "created" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "Order" ADD CONSTRAINT "pkOrder" PRIMARY KEY ("orderId");
ALTER TABLE "Order" ADD CONSTRAINT "fkOrderProduct" FOREIGN KEY ("productId") REFERENCES "Product" ("productId");
ALTER TABLE "Order" ADD CONSTRAINT "fkOrderBuyer" FOREIGN KEY ("buyerId") REFERENCES "Account" ("accountId");
ALTER TABLE "Order" ADD CONSTRAINT "fkOrderCarrier" FOREIGN KEY ("carrierId") REFERENCES "Carrier" ("carrierId");
CREATE TABLE "Package" (
  "packageId" bigint generated always as identity,
  "orderId" bigint NOT NULL,
  "weight" integer NOT NULL,
  "created" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "Package" ADD CONSTRAINT "pkPackage" PRIMARY KEY ("packageId");
ALTER TABLE "Package" ADD CONSTRAINT "fkPackageOrder" FOREIGN KEY ("orderId") REFERENCES "Order" ("orderId");
CREATE TABLE "Payment" (
  "paymentId" bigint generated always as identity,
  "orderId" bigint NOT NULL,
  "amount" integer NOT NULL,
  "transaction" varchar NOT NULL,
  "date" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "Payment" ADD CONSTRAINT "pkPayment" PRIMARY KEY ("paymentId");
ALTER TABLE "Payment" ADD CONSTRAINT "fkPaymentOrder" FOREIGN KEY ("orderId") REFERENCES "Order" ("orderId");
CREATE TABLE "Refund" (
  "refundId" bigint generated always as identity,
  "orderId" bigint NOT NULL,
  "amount" integer NOT NULL,
  "transaction" varchar NOT NULL,
  "date" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "Refund" ADD CONSTRAINT "pkRefund" PRIMARY KEY ("refundId");
ALTER TABLE "Refund" ADD CONSTRAINT "fkRefundOrder" FOREIGN KEY ("orderId") REFERENCES "Order" ("orderId");
CREATE TABLE "Reservation" (
  "reservationId" bigint generated always as identity,
  "productId" bigint NOT NULL,
  "amount" integer NOT NULL,
  "created" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "Reservation" ADD CONSTRAINT "pkReservation" PRIMARY KEY ("reservationId");
ALTER TABLE "Reservation" ADD CONSTRAINT "fkReservationProduct" FOREIGN KEY ("productId") REFERENCES "Product" ("productId");
CREATE TABLE "Return" (
  "returnId" bigint generated always as identity,
  "productId" bigint NOT NULL,
  "amount" integer NOT NULL,
  "created" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "Return" ADD CONSTRAINT "pkReturn" PRIMARY KEY ("returnId");
ALTER TABLE "Return" ADD CONSTRAINT "fkReturnProduct" FOREIGN KEY ("productId") REFERENCES "Product" ("productId");
CREATE TABLE "Session" (
  "sessionId" bigint generated always as identity,
  "accountId" bigint NOT NULL,
  "token" varchar NOT NULL,
  "ip" inet NOT NULL,
  "data" jsonb NOT NULL
);

ALTER TABLE "Session" ADD CONSTRAINT "pkSession" PRIMARY KEY ("sessionId");
ALTER TABLE "Session" ADD CONSTRAINT "fkSessionAccount" FOREIGN KEY ("accountId") REFERENCES "Account" ("accountId");
CREATE UNIQUE INDEX "akSessionToken" ON "Session" ("token");
CREATE TABLE "Shipment" (
  "shipmentId" bigint generated always as identity,
  "packageId" bigint NOT NULL,
  "carrierId" bigint NOT NULL,
  "waybill" varchar NOT NULL,
  "date" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "Shipment" ADD CONSTRAINT "pkShipment" PRIMARY KEY ("shipmentId");
ALTER TABLE "Shipment" ADD CONSTRAINT "fkShipmentPackage" FOREIGN KEY ("packageId") REFERENCES "Package" ("packageId");
ALTER TABLE "Shipment" ADD CONSTRAINT "fkShipmentCarrier" FOREIGN KEY ("carrierId") REFERENCES "Carrier" ("carrierId");
