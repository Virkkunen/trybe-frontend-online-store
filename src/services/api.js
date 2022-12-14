export async function getCategories() {
  // https://api.mercadolibre.com/sites/MLB/categories
  const fetchCategories = await fetch('https://api.mercadolibre.com/sites/MLB/categories');
  const categories = await fetchCategories.json();
  return categories;
}

export async function getProductsFromCategoryAndQuery(categoryId = '', query = '') {
  if (!categoryId && !query) return;

  if (categoryId.toLowerCase().includes('mlb')) {
    const fetchProducts = await fetch(`https://api.mercadolibre.com/sites/MLB/search?category=${categoryId}`);
    const productsResponse = await fetchProducts.json();
    const products = productsResponse.results;
    return products;
  }

  const fetchQuery = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
  const queryResponse = await fetchQuery.json();
  return queryResponse;

  // const fetchProducts = await fetch(`https://api.mercadolibre.com/sites/MLB/search?category=${categoryId}&q=${query}`);
  // const productsResponse = await fetchProducts.json();
  // const products = productsResponse.results;
  // return products;
}

export async function getProductById(productId) {
  const fetchItem = await fetch(`https://api.mercadolibre.com/items/${productId}`);
  const itemResponse = fetchItem.json();
  return itemResponse;
}
