ECOMMERCE BACKEND

A fully functional eCommerce backend built using Node.js, Express, and MongoDB. This project provides user authentication, product management, cart operations, order processing, and more.

|| Features ||
✅ User authentication (JWT-based)
✅ Seller panel for product management
✅ CRUD operations for products & categories
✅ Shopping cart functionality
✅ Order placement
✅ Secure password hashing with bcrypt
✅ Token-based authentication & authorization

|| Tech Stack ||
Backend: Node.js, Express.js
Database: MongoDB & Mongoose
Authentication: JWT & bcrypt
Other Tools: Dotenv

|| METHODES ||

POST buyer/ - signup buyer signup
POST buyer/signin - buyer signin
POST product/buy - buyer can buy product with product id and quantity as input
POST product/cart - buyer can add to cart item with product id and quantity
POST seller/signup - seller signup
POST seller/signin - seller signin
POST seller/additem - seller can add item
PUT seller/edititem - seller can edit added items
PUT sellet/deleteitem - seller can delete items they added
PUT cart/delete - buyer can deleet cart items
PUT cart/edit - buyer can edit quantity in cart
GET buyer/orders - buyer can see their orders
GET seller/allitem - seller can see items the added
GET cart/total - buyer can see the total cart amount
GET cart/all - buyer can see all the cart items

|| Further Improvements||

1. ADD A PAYMENT GETWAY SYSTEM
2. TRACK ORDER UPDATES
3. PRODUCT RATINGS
