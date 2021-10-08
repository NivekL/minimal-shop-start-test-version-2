import { useEffect } from 'react';
import { withContext, useNamedContext } from './react-easier/index.js';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink
} from "react-router-dom";
import ProductList from './ProductList.jsx';
import Cart from './Cart.jsx';

// Create a context and wrap App in it
export default withContext(
  'global',
  {
    categories: [],
    products: []
  },
  App
);

function App() {

  const g = useNamedContext('global');

  // correct currency format
  g.curr = x => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(x);

  useEffect(() => {
    (async () => {
      g.categories = await (await fetch('/api/categories')).json();
      g.products = await (await fetch('/api/products')).json();
      // Read cart/quantities from localStorage
      let quantities = {};
      try {
        quantities = JSON.parse(localStorage.cart);
      }
      catch (e) { }
      // Set quantities
      for (let { id } of g.products) {
        g['quantity' + id] = quantities['quantity' + id] || 0;
      }
    })();
  }, []);

  return <Router>
    {!g.products.length ? '' : <div>
      <nav>
        <ul>
          {['', ...g.categories].map(category =>
            <li key={category}>
              <NavLink exact={true} to={'/' + category.split(' ').join('-')}>
                {category || 'All products'}
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
      <Switch>
        {[...g.categories, ''].map(category =>
          <Route key={category} path={'/' + category.split(' ').join('-')}>
            <ProductList categoryToDisplay={category} />
          </Route>
        )}
      </Switch>
      <Cart />
    </div>}
  </Router>
}