# Order product

* Form `Order`
* Reservation
  - Notify "The product is out of stock"
* Form `Payment`
* Payment
  + Notify "Payment was successful"
  - > Return payment
* Pick up from the warehouse
  - > Return to the warehouse
* Shipping by carrier
  + Notify "The product was successfully sent"
  - Notify "The product was not sent"
* Finalization
  + Product feedback
  + Service feedback

# Reservation

* `getStockBalance(Order): Balance`
* `checkStockBalance(Order, Balance): Availability`
* `makeReservation(Order, Balance, Availability): Reservation`

# Pick up from the warehouse

* `pickProduct(Reservation): Package`
* `removeReservation(Reservation)`

# Return to the warehouse

* `returnProduct(Package): Return`

# Payment

* `makePayment(Order): Payment`

# Return payment

* `returnPayment(Payment): Refund`

# Shipping by carrier

* `selectCarrier(Order, Package): Carrier`
* `makeShopment(Package, Carrier): Shipment`
