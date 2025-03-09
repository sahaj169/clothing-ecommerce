export const metadata = {
  title: "Shipping Policy | StyleHub",
  description:
    "StyleHub's shipping policy, including delivery times, shipping methods, and international shipping information.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-white py-16 px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shipping Policy
        </h1>
        <p className="mt-4 text-gray-500">Last updated: March 9, 2024</p>

        <div className="mt-8 space-y-8 text-gray-600">
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              1. Shipping Methods and Timeframes
            </h2>
            <p className="mt-4">
              StyleHub offers several shipping options to meet your needs.
              Please note that all delivery timeframes are estimates and begin
              from the date of shipment, not the order date.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      Shipping Method
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Estimated Delivery
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Cost
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      Standard Shipping
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      3-5 business days
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      $5.99 (Free on orders over $50)
                    </td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      Express Shipping
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      2 business days
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      $12.99
                    </td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      Next Day Delivery
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      1 business day
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      $19.99
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              * Business days are Monday through Friday, excluding holidays.
              Orders placed after 1 PM EST may not be processed until the
              following business day.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              2. Order Processing
            </h2>
            <p className="mt-4">
              Most orders are processed and shipped within 1-2 business days
              after payment confirmation. During peak seasons or promotional
              periods, order processing may take up to 3 business days.
            </p>
            <p className="mt-4">
              You will receive a shipping confirmation email with tracking
              information once your order has been shipped. You can also track
              your order by logging into your account and viewing your order
              history.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              3. International Shipping
            </h2>
            <p className="mt-4">
              StyleHub ships to select international destinations. International
              shipping rates and delivery times vary by location. Please note
              that international orders may be subject to import duties, taxes,
              and customs clearance fees, which are the responsibility of the
              recipient.
            </p>
            <p className="mt-4">
              Estimated delivery times for international orders:
            </p>
            <ul className="mt-4 list-disc pl-5 space-y-2">
              <li>Canada: 5-10 business days</li>
              <li>Europe: 7-14 business days</li>
              <li>Australia and New Zealand: 10-20 business days</li>
              <li>Asia: 10-20 business days</li>
              <li>Rest of World: 14-30 business days</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              4. Shipping Restrictions
            </h2>
            <p className="mt-4">
              Some products may have shipping restrictions to certain locations
              due to local regulations or logistical constraints. If a product
              cannot be shipped to your location, you will be notified during
              the checkout process.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              5. Shipping Address
            </h2>
            <p className="mt-4">
              It is the customer's responsibility to provide accurate shipping
              information. StyleHub is not responsible for orders shipped to
              incorrect addresses provided by the customer. If you need to
              change your shipping address after placing an order, please
              contact our customer service team immediately. We cannot guarantee
              that address changes will be possible once an order has been
              processed.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              6. Delivery Issues
            </h2>
            <p className="mt-4">
              If your package is reported as delivered by the carrier but you
              have not received it, please check with neighbors, building
              management, or your local post office, as packages may sometimes
              be left with them. If you still cannot locate your package, please
              contact our customer service team within 7 days of the reported
              delivery date.
            </p>
            <p className="mt-4">
              For packages damaged during shipping, please refuse delivery if
              possible and contact us immediately. If you've already accepted
              the package, please contact us within 48 hours with photos of the
              damaged package and products.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              7. Changes to Shipping Policy
            </h2>
            <p className="mt-4">
              StyleHub reserves the right to modify this shipping policy at any
              time. Changes will be effective immediately upon posting to our
              website. It is your responsibility to review this shipping policy
              periodically.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              8. Contact Us
            </h2>
            <p className="mt-4">
              If you have any questions about our shipping policy, please
              contact us at:
            </p>
            <p className="mt-2">
              Email: shipping@stylehub.com
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
