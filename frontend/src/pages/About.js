import React from 'react';

const About = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-black mb-4">About Eato 🍽️</h1>
                    <p className="text-xl opacity-90">Your trusted food delivery partner since 2020</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                {/* Our Story */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">Our Story</h2>
                    <div className="max-w-4xl mx-auto">
                        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                            Eato was born out of a simple idea: everyone deserves access to delicious, quality food at the click of a button.
                            Founded in 2020, we started as a small team of food enthusiasts who believed that technology could bridge the gap
                            between great restaurants and hungry customers.
                        </p>
                        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                            Today, we've grown into India's favorite food delivery platform, partnering with over 200 restaurants and serving
                            more than 50,000 happy customers. Our commitment to quality, speed, and customer satisfaction has made us a trusted
                            name in food delivery across major cities.
                        </p>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            We're not just about delivering food – we're about delivering happiness, one meal at a time. From your favorite
                            comfort food to exploring new cuisines, Eato is here to make every meal memorable.
                        </p>
                    </div>
                </div>

                {/* Our Values */}
                <div className="mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Our Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="text-6xl mb-4">🎯</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">Quality First</h3>
                            <p className="text-gray-600">
                                We partner only with the best restaurants and ensure every order meets our high standards.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="text-6xl mb-4">⚡</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">Lightning Fast</h3>
                            <p className="text-gray-600">
                                Your time is precious. We guarantee fast delivery so your food arrives hot and fresh.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="text-6xl mb-4">❤️</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">Customer Love</h3>
                            <p className="text-gray-600">
                                Our customers are at the heart of everything we do. Your satisfaction is our success.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Our Team */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Meet Our Team</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { name: 'Raj Sharma', role: 'Founder & CEO', emoji: '👨‍💼' },
                            { name: 'Priya Patel', role: 'Head of Operations', emoji: '👩‍💼' },
                            { name: 'Amit Kumar', role: 'Tech Lead', emoji: '👨‍💻' },
                            { name: 'Sneha Singh', role: 'Customer Success', emoji: '👩‍💻' }
                        ].map((member, index) => (
                            <div key={index} className="text-center">
                                <div className="text-7xl mb-4">{member.emoji}</div>
                                <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                                <p className="text-gray-600">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Statistics */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-12 text-white">
                    <h2 className="text-4xl font-bold mb-8 text-center">Eato in Numbers</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <h3 className="text-5xl font-black mb-2">50K+</h3>
                            <p className="text-xl opacity-90">Happy Customers</p>
                        </div>
                        <div>
                            <h3 className="text-5xl font-black mb-2">200+</h3>
                            <p className="text-xl opacity-90">Restaurant Partners</p>
                        </div>
                        <div>
                            <h3 className="text-5xl font-black mb-2">10+</h3>
                            <p className="text-xl opacity-90">Cities Covered</p>
                        </div>
                        <div>
                            <h3 className="text-5xl font-black mb-2">99%</h3>
                            <p className="text-xl opacity-90">Satisfaction Rate</p>
                        </div>
                    </div>
                </div>

                {/* Mission Statement */}
                <div className="mt-12 text-center">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-4xl mx-auto">
                        <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Mission</h2>
                        <p className="text-xl text-gray-700 leading-relaxed">
                            "To revolutionize food delivery in India by making quality meals accessible to everyone,
                            supporting local restaurants, and creating employment opportunities while maintaining
                            our commitment to sustainability and excellence."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
