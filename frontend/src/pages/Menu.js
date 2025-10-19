import React, { useState } from 'react';

const Menu = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Burgers', 'Pizza', 'Noodles', 'Sushi', 'Salads', 'Desserts', 'Beverages'];

    const menuItems = [
        {
            id: 1,
            name: 'Classic Cheeseburger',
            category: 'Burgers',
            price: 299,
            description: 'Juicy beef patty with cheddar cheese, lettuce, tomato, and special sauce',
            image: '🍔',
            rating: 4.5,
            isVeg: false
        },
        {
            id: 2,
            name: 'Margherita Pizza',
            category: 'Pizza',
            price: 399,
            description: 'Classic Italian pizza with fresh mozzarella, basil, and tomato sauce',
            image: '🍕',
            rating: 4.7,
            isVeg: true
        },
        {
            id: 3,
            name: 'Hakka Noodles',
            category: 'Noodles',
            price: 249,
            description: 'Stir-fried noodles with vegetables and Indo-Chinese spices',
            image: '🍜',
            rating: 4.3,
            isVeg: true
        },
        {
            id: 4,
            name: 'California Roll',
            category: 'Sushi',
            price: 499,
            description: 'Fresh sushi roll with crab, avocado, and cucumber',
            image: '🍱',
            rating: 4.6,
            isVeg: false
        },
        {
            id: 5,
            name: 'Caesar Salad',
            category: 'Salads',
            price: 279,
            description: 'Crispy romaine lettuce with parmesan, croutons, and Caesar dressing',
            image: '🥗',
            rating: 4.4,
            isVeg: true
        },
        {
            id: 6,
            name: 'Chocolate Lava Cake',
            category: 'Desserts',
            price: 199,
            description: 'Warm chocolate cake with a gooey molten center',
            image: '🍰',
            rating: 4.8,
            isVeg: true
        },
        {
            id: 7,
            name: 'Veggie Burger',
            category: 'Burgers',
            price: 249,
            description: 'Plant-based patty with fresh vegetables and tangy sauce',
            image: '🍔',
            rating: 4.2,
            isVeg: true
        },
        {
            id: 8,
            name: 'Pepperoni Pizza',
            category: 'Pizza',
            price: 449,
            description: 'Loaded with spicy pepperoni and melted mozzarella',
            image: '🍕',
            rating: 4.6,
            isVeg: false
        },
        {
            id: 9,
            name: 'Mango Smoothie',
            category: 'Beverages',
            price: 149,
            description: 'Fresh mango blended with yogurt and honey',
            image: '🥤',
            rating: 4.5,
            isVeg: true
        },
        {
            id: 10,
            name: 'Tiramisu',
            category: 'Desserts',
            price: 229,
            description: 'Italian coffee-flavored dessert with mascarpone',
            image: '🍰',
            rating: 4.7,
            isVeg: true
        },
        {
            id: 11,
            name: 'Pad Thai',
            category: 'Noodles',
            price: 329,
            description: 'Thai stir-fried rice noodles with peanuts and tamarind',
            image: '🍜',
            rating: 4.5,
            isVeg: false
        },
        {
            id: 12,
            name: 'Greek Salad',
            category: 'Salads',
            price: 299,
            description: 'Fresh vegetables with feta cheese and olive oil',
            image: '🥗',
            rating: 4.4,
            isVeg: true
        }
    ];

    const filteredItems = selectedCategory === 'All'
        ? menuItems
        : menuItems.filter(item => item.category === selectedCategory);

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-black mb-4">Our Menu 🍽️</h1>
                    <p className="text-xl opacity-90">Discover our delicious selection of dishes</p>
                </div>
            </div>

            {/* Category Filter */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${selectedCategory === category
                                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Menu Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
                        >
                            {/* Item Image */}
                            <div className="bg-gradient-to-br from-orange-100 to-red-100 h-48 flex items-center justify-center text-8xl">
                                {item.image}
                            </div>

                            {/* Item Details */}
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.isVeg
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                        {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                                    </span>
                                </div>

                                <p className="text-gray-600 text-sm mb-4">{item.description}</p>

                                <div className="flex items-center mb-4">
                                    <span className="text-yellow-500 mr-1">⭐</span>
                                    <span className="font-semibold text-gray-700">{item.rating}</span>
                                    <span className="text-gray-500 text-sm ml-1">/5</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-2xl font-bold text-orange-600">₹{item.price}</span>
                                    <button className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredItems.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-2xl text-gray-500">No items found in this category</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Menu;
