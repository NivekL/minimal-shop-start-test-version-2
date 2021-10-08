import { useNamedContext } from './react-easier/index.js';

export default function Cart() {

  const g = useNamedContext('global');

  // Save cart to localStorage
  localStorage.cart = JSON.stringify({ ...g, products: undefined, categories: undefined });

  const empty = () => {
    for (let key in g) {
      key.indexOf('quantity') === 0 && (g[key] = 0);
    }
  }

  const p = g.products
    .filter(({ id }) => g['quantity' + id])
    .map(({ id, name, price }) => ({
      id,
      name,
      price,
      quantity: g['quantity' + id],
      rowSum: g.curr(price * g['quantity' + id])
    }));

  const sum = g.curr(p.reduce((sum, { rowSum }) => sum + +rowSum.replace(/[^0-9.]/g, ''), 0));

  return <div className="cart">
    {!p.length && <p>The cart is empty</p>}
    {p.map(({ id, name, quantity, rowSum }) =>
      <div className="productInCart" key={id}>
        <span className="name">{name}</span>
        <span className="quantity">{quantity}</span>
        <span className="rowSum">{rowSum}</span>
      </div>
    )}
    {/*sum*/}
    {!p.length ? '' : <div className="productInCart">
      <span className="sum name"><b>SUM</b></span>
      <span className="quantity"></span>
      <span className="rowSum"><b>{sum}</b></span>
      <button onClick={empty}>Empty cart</button>
    </div>}
  </div>
}