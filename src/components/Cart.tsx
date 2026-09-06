import { CART_ITEMS } from "@/constants";

export const Cart = () => (
  <div className="ayur-bgcover ayur-cartpage-wrapper">
    <div className="container">
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12">
          <div className="ayur-cart-table table-responsive">
            <table className="table ">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Product Image</th>
                  <th>Product Name</th>
                  <th>Unit Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {CART_ITEMS.map((item) => (
                  <tr>
                    <td>{item.id}</td>
                    <td>
                      <img src={item.img} alt="image" />
                    </td>
                    <td>
                      <h2>{item.name}</h2>
                    </td>
                    <td>Rs.{item.price}</td>
                    <td>
                      <input type="number" value="1" min="1" />
                    </td>
                    <td>Rs.{item.price}</td>
                    <td>
                      <a href="javascript:void(0)" className="ayur-tab-delete">
                        <img src="/images/delete.png" alt="delete" />
                      </a>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={7} className="ayur-updatecart-btn">
                    <button className="ayur-btn">Update Cart</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="ayur-carttotal-wrapper">
            <div className="ayur-cart-total">
              <h2>Cart Totals</h2>
              <table className="table table-bordere">
                <tbody>
                  <tr className="ayur-ordertotal">
                    <th>Total</th>
                    <td>
                      <span className="amount">$150</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="ayur-checkout-btn">
                <a href="checkout.html" className="ayur-btn">
                  Order
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
