import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import * as api from '../services/api';
import * as cart from '../services/shoppingCart';
import CategoryList from '../components/CategoryList';
import Loading from '../components/Loading';

class ProductList extends Component {
  state = {
    productsLoaded: false,
    searchInputText: '',
    requestedInfo: [],
    loading: false,
    // cartProducts: [],
    cartSize: 0,
  };

  componentDidMount() {
    this.setLocalStorage();
    this.getQuantity();
  }

  setLocalStorage = () => {
    if (localStorage.getItem('cartItems')) return;
    localStorage.setItem('cartItems', '');
    localStorage.setItem('cartSize', '');
  };

  handleChange = ({ target }) => {
    const { name, value } = target;

    this.setState({
      [name]: value,
    });
  };

  getQuantity = () => {
    if (localStorage.getItem('cartSize')) {
      const quantity = JSON.parse(localStorage.getItem('cartSize'));
      if (quantity === null) this.setState({ cartSize: 0 });
      else this.setState({ cartSize: quantity });
    }
  };

  validateFetchProducts = () => {
    const { requestedInfo } = this.state;
    const validation = requestedInfo.length > 1;
    if (validation) {
      this.setState({
        productsLoaded: true,
        hasProducts: true,
      }); return;
    }

    this.setState({
      productsLoaded: true,
      hasProducts: false,
    });
  };

  fetchCategoryProducts = async ({ target: { id } }) => {
    this.setState({ loading: true });
    const fetchedProds = await api.getProductsFromCategoryAndQuery(id);
    if (fetchedProds.length < 1) {
      this.setState({
        productsLoaded: true,
        hasProducts: false,
      });
      return;
    }
    this.setState({
      requestedInfo: fetchedProds,
      productsLoaded: true,
      hasProducts: true,
      loading: false,
    });
  };

  handleClickButton = async () => {
    this.setState({ loading: true });
    const { searchInputText } = this.state;
    if (!searchInputText) {
      this.setState({ productsLoaded: true });
      return;
    }
    const response = await api.getProductsFromCategoryAndQuery('', searchInputText);
    this.setState({
      requestedInfo: response.results,
      loading: false,
    }, this.validateFetchProducts);
  };

  handleClickCartButton = ({ target }) => {
    const { id } = target;
    // const item = api.getProductById(id);

    const { requestedInfo } = this.state;
    const productFound = requestedInfo.find((productObj) => productObj.id === id);
    cart.addToCart(productFound);
    this.getQuantity();
    // this.setState(({ cartProducts }) => (
    //   { cartProducts: [...cartProducts, productFound] }), () => {
    //   const { cartProducts } = this.state;
    //   localStorage
    //     .setItem('cartProducts', JSON.stringify(cartProducts));
    // });
  };

  render() {
    const { productsLoaded,
      searchInputText,
      requestedInfo,
      hasProducts,
      loading, cartSize,
    } = this.state;

    return (
      <div className="home-sections">
        <CategoryList
          fetchCategoryProducts={ this.fetchCategoryProducts }
        />

        <div className="search-section">
          <div className="search-controls">
            <input
              type="text"
              name="searchInputText"
              id="searchInputText"
              data-testid="query-input"
              placeholder="Nome do produto"
              value={ searchInputText }
              onChange={ this.handleChange }
              className="text-input"
            />
            <button
              type="button"
              id="query-button"
              data-testid="query-button"
              value="pesquisar"
              onClick={ this.handleClickButton }
            >
              Pesquisar
            </button>
          </div>

          { !productsLoaded
          && (
            <div className="products-list-no-search">
              <p
                data-testid="home-initial-message"
              >
                Digite algum termo de pesquisa ou escolha uma categoria.
              </p>

            </div>
          )}
          <Link to="/shopping-cart" data-testid="shopping-cart-button">
            <button type="button">
              {
                cartSize === 0 ? <span>Carrinho</span>
                  : (
                    <span
                      data-testid="shopping-cart-size"
                    >
                      {`Carrinho (${cartSize})`}
                    </span>
                  )
              }
            </button>
          </Link>

          <div className="products-list">
            { loading && <Loading />}
            {
              productsLoaded && (
                hasProducts && (requestedInfo.map((product) => (<ItemCard
                  product={ product }
                  key={ product.id }
                  id={ product.id }
                  handleClickCartButton={ this.handleClickCartButton }
                />))))
            }
            { (productsLoaded && !hasProducts)
          && <span>Nenhum produto foi encontrado</span> }
          </div>

        </div>
      </div>
    );
  }
}

export default ProductList;
