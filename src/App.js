import React from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';
import CheckoutPage from './pages/CheckoutPage';
import ProductList from './pages/ProductList';
import ProductPage from './pages/ProductPage';
import ShoppingCart from './pages/ShoppingCart';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={ ProductList } />
        <Route path="/shopping-cart" component={ ShoppingCart } />
        <Route path="/product/:id" component={ ProductPage } />
        <Route path="/checkout" component={ CheckoutPage } />
      </Switch>
    </div>
  );
}

export default App;
