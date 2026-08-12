# Technologia
Technologia is our project under Group B. The purpose of our project is to establish a one-stop online store for makers, students and hobbyists who are looking for electronic components like sensors, robotics components, IoT boards, etc. Members can also add parts that they no longer use and can contact other members via the chat page.

Our project is currently a prototype of front-end project developed using HTML, CSS, JavaScript and jQuery. Our project runs on the browser and no npm or other build system tools are required.












## Architecture Diagram


![Technologia architecture diagram](<assets/images/Screenshot 2026-08-04 122048.png>)

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
html/product.html?id=s1
```

It finds the product in the common catalog or in the list of sellers and provides its picture, price, condition, rating, seller, and other information. Besides, it shows several similar items from the same category.

We decided not to include a cart in this version of the page. If a user likes something, he or she can use the **Chat with seller** button and organize all the details directly with the seller. The link contains the ID of the selected product:

```text
html/chat.html?product=s1
```

The save button keeps the product in a local wishlist, so it will still be there when the page is opened again in the same browser.

## Pages in the project

| File | What it is used for |
| --- | --- |
| `html/Home.html` | Main landing page |
| `html/marketplace.html` | Browsing and filtering marketplace listings |
| `html/product.html` | Viewing one product and contacting its seller |
| `html/sell.html` | Creating a product listing |
| `html/chat.html` | User conversations |
| `html/discussion.html` | Community questions, threads and replies |
| `html/profile.html` | User details, listings and projects |
| `html/login.html` | Signing in |
| `html/register.html` | Creating a demo account |

## File structure

The front-end files are grouped by type. Pages stay together in `html`, styles in `css`, scripts in `js`, and project images in `assets/images`.

```text
Group_B_Project/
|-- html/
|   |-- Home.html
|   |-- marketplace.html
|   |-- product.html
|   |-- sell.html
|   |-- chat.html
|   |-- discussion.html
|   |-- profile.html
|   |-- login.html
|   `-- register.html
|-- css/
|   |-- base.css
|   `-- page-specific stylesheets
|-- js/
|   |-- jquery.min.js
|   |-- base.js
|   |-- checkout.js
|   `-- page-specific scripts
|-- assets/
|   `-- images/
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

Open the folder in VS Code and start `html/Home.html` with the **Live Server** extension. Serving the whole project folder keeps the paths to `css`, `js`, and `assets/images` working correctly. There are no packages to install.

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
