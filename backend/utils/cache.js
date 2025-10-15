const NodeCache = require('node-cache');

// Initialize cache with default options
const cache = new NodeCache({
    stdTTL: 3600, // 1 hour default time-to-live
    checkperiod: 600, // Check for expired keys every 10 minutes
    useClones: false, // Disable cloning for performance
});

const CACHE_KEYS = {
    ALL_PRODUCTS: 'all_products',
    ALL_USERS: 'all_users',
    USER_CART: (email) => `user_cart_${email}`,
    USER_ORDERS: (email) => `user_orders_${email}`,
    PRODUCT_DETAILS: (productId) => `product_details_${productId}`,
};

const CACHE_TTL = {
    PRODUCTS: 6*60*60, // 6 hours
    CARTS: 15*60, // 15 minutes
    ORDERS: 1*60*60, // 1 hour
    USERS: 1*60*60, // 1 hour
};

const clearProductsCache = () => {
    cache.del(CACHE_KEYS.ALL_PRODUCTS);
    console.log('Cleared all products cache');
};

const clearUsersCache = () => {
    cache.del(CACHE_KEYS.ALL_USERS);
    console.log('Cleared all users cache');
};

const clearUserCartCache = (email) => {
    const key = CACHE_KEYS.USER_CART(email);
    cache.del(key);
    console.log(`Cleared cart cache for user: ${email}`);
};

const clearUserOrdersCache = (email) => {
    const key = CACHE_KEYS.USER_ORDERS(email);
    cache.del(key);
    console.log(`Cleared orders cache for user: ${email}`);
};

const clearProductDetailsCache = (productId) => {
    const key = CACHE_KEYS.PRODUCT_DETAILS(productId);
    cache.del(key);
    console.log(`Cleared product details cache for product ID: ${productId}`);
};

const clearAllCache = () => {
    cache.flushAll();
    console.log('Cleared all cache');
};

module.exports = {
    cache,
    CACHE_KEYS,
    CACHE_TTL,
    clearProductsCache,
    clearUsersCache,
    clearUserCartCache,
    clearUserOrdersCache,
    clearProductDetailsCache,
    clearAllCache
};