import { useNamedContext } from './react-easier/index.js';

export default function ProductList({ categoryToDisplay }) {

  const g = useNamedContext('global');

  const p = g.products.filter(({ category }) =>
    !categoryToDisplay || categoryToDisplay.toLowerCase() === category);

  const less = id => g['quantity' + id] > 0 && (g['quantity' + id]--);
  const more = id => g['quantity' + id] < 999 && (g['quantity' + id]++);

  return <div className="products">
    <h2>{categoryToDisplay || 'All products'}</h2>
    <p>{p.length} products</p>
    {p.map(({ id, category, name, description, price, image }) =>
      <div className="product" key={id}>
        <img src={image} />
        <h3>{name}</h3>
        {!categoryToDisplay && <p><i>Category: {category}</i></p>}
        <p>{description[0].toUpperCase() + description.slice(1) + '.'}</p>
        <p className="price"><b>Price: {g.curr(price)}</b></p>
        <p>
          <button className="less" onClick={() => less(id)}>-</button>
          <input type="number" {...g.bind('quantity' + id)} />
          <button className="more" onClick={() => more(id)}>+</button>
        </p>
      </div>
    )}
  </div>
}