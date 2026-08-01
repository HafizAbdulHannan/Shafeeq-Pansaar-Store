const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

const products = [
            // Staples
            { name: "Gandum (Wheat) 10kg", price: 1100, category: "Staples", image: "https://placehold.co/400x300/059669/ffffff?text=Gandum+(Wheat)" },
            { name: "Chawal Basmati 1kg", price: 300, category: "Staples", image: "https://placehold.co/400x300/059669/ffffff?text=Basmati+Rice" },
            { name: "Daal Chana 1kg", price: 300, category: "Staples", image: "https://placehold.co/400x300/059669/ffffff?text=Daal+Chana" },
            { name: "Daal Masoor 1kg", price: 280, category: "Staples", image: "https://placehold.co/400x300/059669/ffffff?text=Daal+Masoor" },
            { name: "Daal Moong 1kg", price: 290, category: "Staples", image: "https://placehold.co/400x300/059669/ffffff?text=Daal+Moong" },
            { name: "Daal Mash 1kg", price: 450, category: "Staples", image: "https://placehold.co/400x300/059669/ffffff?text=Daal+Mash" },
            { name: "Safed Chana (White) 1kg", price: 350, category: "Staples", image: "https://placehold.co/400x300/059669/ffffff?text=White+Chana" },
            { name: "Kala Chana (Black) 1kg", price: 250, category: "Staples", image: "https://placehold.co/400x300/059669/ffffff?text=Black+Chana" },
            { name: "Besan (Gram Flour) 1kg", price: 200, category: "Staples", image: "https://placehold.co/400x300/059669/ffffff?text=Besan" },
            { name: "Cheeni (Sugar) 1kg", price: 150, category: "Staples", image: "https://placehold.co/400x300/059669/ffffff?text=Sugar" },
            
            // Cooking
            { name: "Dalda Cooking Oil 1L", price: 550, category: "Cooking", image: "https://placehold.co/400x300/f59e0b/ffffff?text=Cooking+Oil" },
            { name: "Desi Ghee 1kg", price: 2500, category: "Cooking", image: "https://placehold.co/400x300/f59e0b/ffffff?text=Desi+Ghee" },
            { name: "Sarso ka Tel (Mustard Oil) 1L", price: 450, category: "Cooking", image: "https://placehold.co/400x300/f59e0b/ffffff?text=Mustard+Oil" },
            { name: "Zaitoon ka Tel (Olive Oil) 500ml", price: 1500, category: "Cooking", image: "https://placehold.co/400x300/f59e0b/ffffff?text=Olive+Oil" },
            
            // Beverages
            { name: "Lipton Tea 1kg", price: 1300, category: "Beverages", image: "https://placehold.co/400x300/d97706/ffffff?text=Lipton+Tea" },
            { name: "Tapal Danedar 1kg", price: 1250, category: "Beverages", image: "https://placehold.co/400x300/d97706/ffffff?text=Tapal+Tea" },
            { name: "Rooh Afza 800ml", price: 350, category: "Beverages", image: "https://placehold.co/400x300/dc2626/ffffff?text=Rooh+Afza" },
            { name: "Jam-e-Shirin 800ml", price: 340, category: "Beverages", image: "https://placehold.co/400x300/dc2626/ffffff?text=Jam-e-Shirin" },

            // Spices
            { name: "Zera (Cumin) 1kg", price: 800, category: "Spices", image: "https://placehold.co/400x300/4b5563/ffffff?text=Zera" },
            { name: "Haldi (Turmeric) 1kg", price: 300, category: "Spices", image: "https://placehold.co/400x300/eab308/ffffff?text=Haldi" },
            { name: "Lal Mirch Powder 1kg", price: 700, category: "Spices", image: "https://placehold.co/400x300/ef4444/ffffff?text=Lal+Mirch" },
            { name: "Dhania Powder 1kg", price: 400, category: "Spices", image: "https://placehold.co/400x300/4b5563/ffffff?text=Dhania" },
            { name: "Kaali Mirch (Black Pepper) 1kg", price: 1500, category: "Spices", image: "https://placehold.co/400x300/1f2937/ffffff?text=Black+Pepper" },
            { name: "Long (Clove) 250g", price: 600, category: "Spices", image: "https://placehold.co/400x300/4b5563/ffffff?text=Cloves" },
            { name: "Darchini (Cinnamon) 250g", price: 300, category: "Spices", image: "https://placehold.co/400x300/8b5cf6/ffffff?text=Cinnamon" },
            { name: "Sabz Elaichi (Green Cardamom) 100g", price: 800, category: "Spices", image: "https://placehold.co/400x300/10b981/ffffff?text=Green+Cardamom" },
            { name: "Badi Elaichi (Black Cardamom) 250g", price: 400, category: "Spices", image: "https://placehold.co/400x300/1f2937/ffffff?text=Black+Cardamom" },
            { name: "Ajwain 250g", price: 200, category: "Spices", image: "https://placehold.co/400x300/4b5563/ffffff?text=Ajwain" },
            { name: "Saunf (Fennel) 500g", price: 300, category: "Spices", image: "https://placehold.co/400x300/10b981/ffffff?text=Fennel" },

            // Dry Fruits
            { name: "Badam (Almonds) 1kg", price: 2500, category: "Dry Fruits", image: "https://placehold.co/400x300/8b5cf6/ffffff?text=Almonds" },
            { name: "Akhrot (Walnuts) 1kg", price: 1800, category: "Dry Fruits", image: "https://placehold.co/400x300/8b5cf6/ffffff?text=Walnuts" },
            { name: "Kaju (Cashews) 1kg", price: 3000, category: "Dry Fruits", image: "https://placehold.co/400x300/8b5cf6/ffffff?text=Cashews" },
            { name: "Pista (Pistachios) 1kg", price: 3500, category: "Dry Fruits", image: "https://placehold.co/400x300/10b981/ffffff?text=Pistachios" },
            { name: "Kishmish (Raisins) 1kg", price: 800, category: "Dry Fruits", image: "https://placehold.co/400x300/eab308/ffffff?text=Raisins" },
            { name: "Khajoor (Dates) 1kg", price: 600, category: "Dry Fruits", image: "https://placehold.co/400x300/4b5563/ffffff?text=Dates" },
            { name: "Anjeer (Figs) 500g", price: 1200, category: "Dry Fruits", image: "https://placehold.co/400x300/8b5cf6/ffffff?text=Figs" },
            { name: "Phool Makhana 250g", price: 400, category: "Dry Fruits", image: "https://placehold.co/400x300/f8fafc/000000?text=Phool+Makhana" },

            // Herbs & Health
            { name: "Khalis Honey 1kg", price: 1200, category: "Health", image: "https://placehold.co/400x300/f59e0b/ffffff?text=Pure+Honey" },
            { name: "Ispaghol (Psyllium Husk) 250g", price: 450, category: "Herbs", image: "https://placehold.co/400x300/f8fafc/000000?text=Ispaghol" },
            { name: "Mulethi (Licorice) 250g", price: 200, category: "Herbs", image: "https://placehold.co/400x300/4b5563/ffffff?text=Mulethi" },
            { name: "Ashwagandha (Asgandh) 100g", price: 300, category: "Herbs", image: "https://placehold.co/400x300/4b5563/ffffff?text=Ashwagandha" },
            { name: "Sana Makki 100g", price: 150, category: "Herbs", image: "https://placehold.co/400x300/10b981/ffffff?text=Sana+Makki" },
            { name: "Tukhm-e-Balangu 250g", price: 300, category: "Herbs", image: "https://placehold.co/400x300/1f2937/ffffff?text=Balangu" },
            { name: "Banafsha 50g", price: 250, category: "Herbs", image: "https://placehold.co/400x300/8b5cf6/ffffff?text=Banafsha" },

            // Household
            { name: "Phitkari (Alum) 500g", price: 100, category: "Household", image: "https://placehold.co/400x300/e5e7eb/000000?text=Phitkari" },
            { name: "Multani Mitti 500g", price: 80, category: "Household", image: "https://placehold.co/400x300/d97706/ffffff?text=Multani+Mitti" },
            { name: "Arq-e-Gulab (Rose Water) 800ml", price: 250, category: "Household", image: "https://placehold.co/400x300/ec4899/ffffff?text=Rose+Water" },
            { name: "Surf (Detergent) 1kg", price: 350, category: "Household", image: "https://placehold.co/400x300/3b82f6/ffffff?text=Surf" }
];

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
    console.log('MongoDB Connected.');
    await Product.deleteMany({});
    console.log('Existing products cleared.');
    await Product.insertMany(products);
    console.log('48 Products inserted successfully!');
    mongoose.connection.close();
})
.catch(err => {
    console.error('Error:', err);
    mongoose.connection.close();
});
