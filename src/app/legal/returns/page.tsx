export const metadata = {
  title: "Returns & Exchanges | StyleHub",
  description:
    "StyleHub's returns and exchanges policy, including eligibility, process, and refund information.",
};

export default function ReturnsPage() {
  return (
    <div className="bg-white py-16 px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Returns & Exchanges
        </h1>
        <p className="mt-4 text-gray-500">Last updated: March 9, 2024</p>

        <div className="mt-8 space-y-8 text-gray-600">
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              1. Return Policy Overview
            </h2>
            <p className="mt-4">
              At StyleHub, we want you to be completely satisfied with your
              purchase. If you're not entirely happy with your order, we're here
              to help. You may return eligible items within 30 days of delivery
              for a full refund or exchange.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              2. Return Eligibility
            </h2>
            <p className="mt-4">
              To be eligible for a return, your item must be:
            </p>
            <ul className="mt-4 list-disc pl-5 space-y-2">
              <li>Unworn, unwashed, and unaltered</li>
              <li>In the original packaging with all tags attached</li>
              <li>Free from any signs of wear, damage, or use</li>
              <li>Returned within 30 days of the delivery date</li>
            </ul>
            <p className="mt-4">The following items cannot be returned:</p>
            <ul className="mt-4 list-disc pl-5 space-y-2">
              <li>Intimates and swimwear (for hygiene reasons)</li>
              <li>Personalized or customized items</li>
              <li>Gift cards</li>
              <li>Items marked as "Final Sale" or "Non-Returnable"</li>
              <li>Items that have been worn, washed, or damaged</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              3. Return Process
            </h2>
            <p className="mt-4">
              To initiate a return, please follow these steps:
            </p>
            <ol className="mt-4 list-decimal pl-5 space-y-2">
              <li>Log in to your StyleHub account and go to "Order History"</li>
              <li>
                Select the order containing the item(s) you wish to return
              </li>
              <li>Click on "Return Items" and follow the instructions</li>
              <li>Print the prepaid return shipping label (if eligible)</li>
              <li>
                Pack the item(s) securely in the original packaging if possible
              </li>
              <li>
                Attach the return shipping label to the outside of the package
              </li>
              <li>Drop off the package at the designated shipping carrier</li>
            </ol>
            <p className="mt-4">
              If you received a damaged or defective item, please contact our
              customer service team immediately with photos of the damage before
              initiating a return.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              4. Return Shipping
            </h2>
            <p className="mt-4">
              For standard returns, a flat return shipping fee of $5.99 will be
              deducted from your refund. This fee is waived for:
            </p>
            <ul className="mt-4 list-disc pl-5 space-y-2">
              <li>Exchanges (first exchange only)</li>
              <li>Defective or damaged items</li>
              <li>Incorrect items shipped</li>
              <li>StyleHub+ members</li>
            </ul>
            <p className="mt-4">
              International returns are the responsibility of the customer and
              are not eligible for free return shipping. Please contact our
              customer service team for international return instructions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              5. Exchanges
            </h2>
            <p className="mt-4">
              If you'd like to exchange an item for a different size or color,
              please select "Exchange" instead of "Return" when initiating your
              return. Exchanges are subject to availability. If the requested
              exchange item is unavailable, we will issue a refund for the
              original purchase.
            </p>
            <p className="mt-4">
              Please note that we can only exchange items for the same product
              in a different size or color. If you wish to purchase a different
              product, please return the original item for a refund and place a
              new order.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">6. Refunds</h2>
            <p className="mt-4">
              Once we receive your return, our team will inspect the item(s) to
              ensure they meet our return policy requirements. If approved, your
              refund will be processed within 3-5 business days. Refunds will be
              issued to the original payment method used for the purchase.
            </p>
            <p className="mt-4">
              Please note that it may take an additional 5-10 business days for
              the refund to appear in your account, depending on your financial
              institution.
            </p>
            <p className="mt-4">
              Shipping charges and any promotional discounts applied to the
              original order are non-refundable, unless the return is due to our
              error or a defective product.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              7. Late or Missing Returns
            </h2>
            <p className="mt-4">
              If you attempt to return an item after the 30-day return window,
              we may, at our discretion, offer a partial refund or store credit.
              Returns received more than 45 days after delivery may not be
              accepted.
            </p>
            <p className="mt-4">
              If you believe you've returned an item but haven't received a
              refund confirmation within 14 days, please contact our customer
              service team with your return tracking number.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              8. Damaged or Defective Items
            </h2>
            <p className="mt-4">
              If you receive a damaged or defective item, please contact us
              within 48 hours of delivery. We'll need photos of the damage and
              the item's packaging to process your claim. Once verified, we'll
              arrange for a return shipping label and issue a full refund or
              replacement at no additional cost to you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              9. Contact Us
            </h2>
            <p className="mt-4">
              If you have any questions about our returns and exchanges policy,
              please contact us at:
            </p>
            <p className="mt-2">
              Email: returns@stylehub.com
              <br />
              Phone: +1 (555) 123-4567
              <br />
              Hours: Monday-Friday, 9am-6pm EST
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
