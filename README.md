# Technologia
Technologia is our project under Group B. The purpose of our project is to establish a one-stop online store for makers, students and hobbyists who are looking for electronic components like sensors, robotics components, IoT boards, etc. Members can also add parts that they no longer use and can contact other members via the chat page.

Our project is currently a prototype of front-end project developed using HTML, CSS, JavaScript and jQuery. Our project runs on the browser and no npm or other build system tools are required.












## Architecture Diagram


![alt text](<Screenshot 2026-08-04 122048.png>)

## What we have added

- Home page that has the categories of products and their features along with listings
- Marketplace page having the controls for searching, sorting and filtering
- Product pages having the details about the products along with similar items
- Sell page where users can create their listings
- Forms for login and registration of demo accounts
- Profile page having user details and their listings and projects
- Pages for chat and discussion with other members
- Wishlist stored in browser

## Product page

Product page has the ID of the product that has been extracted from the URL. For example:

```text
product.html?id=s1
```

It finds the product in the common catalog or in the list of sellers and provides its picture, price, condition, rating, seller, and other information. Besides, it shows several similar items from the same category.

We decided not to include a cart in this version of the page. If a user likes something, he or she can use the **Chat with seller** button and organize all the details directly with the seller. The link contains the ID of the selected product:

```text
chat.html?product=s1
```

The save button keeps the product in a local wishlist, so it will still be there when the page is opened again in the same browser.

## Pages in the project

| File | What it is used for |
| --- | --- |
| `Home.html` | Main landing page |
| `marketplace.html` | Browsing and filtering marketplace listings |
| `product.html` | Viewing one product and contacting its seller |
| `sell.html` | Creating a product listing |
| `chat.html` | User conversations |
| `discussion.html` | Community questions, threads and replies |
| `profile.html` | User details, listings and projects |
| `login.html` | Signing in |
| `register.html` | Creating a demo account |

## File structure

The files are kept in the root of the project rather than separate `css` and `js` folders.

```text
Group_B_Project/
|-- Home.html
|-- home.css
|-- home.js
|-- marketplace.html
|-- marketplace.css
|-- product.html
|-- product.css
|-- product.js
|-- sell.html
|-- sell.css
|-- sell.js
|-- chat.html
|-- chat.css
|-- discussion.html
|-- discussion.css
|-- discussion.js
|-- profile.html
|-- profile.css
|-- profile.js
|-- login.html
|-- login.css
|-- login.js
|-- register.html
|-- register.css
|-- register.js
|-- base.css
|-- base.js
|-- checkout.js
|-- jquery.min.js
`-- README.md
```

`base.css` contains styles that are shared by the pages, including navigation, buttons, cards and responsive layouts. `base.js` contains shared product data and helper functions used across the site. The other CSS and JavaScript files are for their matching pages.

`checkout.js` is still in the repository from an earlier version, but the latest product page now directs users to chat instead of checkout.

## How to run it

Clone the repository:

```bash
git clone https://github.com/samirbishowkarma/Group_B_Project.git
cd Group_B_Project
```

Open the folder in VS Code and open `Home.html`. We usually use the **Live Server** extension since it helps with testing links between different pages. There are no packages to install.

Everything needed to display the demo is included in the repository, so the pages and product images work locally without an internet connection.
## Source of images

The homepage and product images were generated specifically for this student project and are stored in `assets/images`. Keeping the WebP files in the repository means the site does not rely on temporary third-party image links. The shared JavaScript selects an image for each product category, while photos uploaded through the selling form still take priority for that listing.

## The storage of the data

There is no back-end database in this version. Demo accounts, the sessions of the logins and saved products all use browser `localStorage`. It means that the data is local and can be cleared when you clear the browser data.

The login function was used only for demonstration of the website interface. Do not put any real passwords or personal data in there.

## Possible improvements

- Back-end and database
- User authentication
- Chat and notifications
- Upload of images on the server
- Any agreed upon payment system
- Mobile testing
