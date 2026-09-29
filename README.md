# Airbnb Clone

A full-stack Airbnb-inspired web application built using Node.js, Express.js, MongoDB, EJS, HTML, CSS, and JavaScript. The application allows users to create and manage property listings, explore listings created by other users, and write reviews.

## Live Demo

https://wanderlust-3d8v.onrender.com/

## Features

* **User Authentication:** Secure user registration and login using Passport.js.
* **Create Listings:** Authenticated users can create and publish their own property listings.
* **View Listings:** All users can browse and view listings created by other users.
* **Edit and Delete Listings:** Only the owner of a listing can edit or delete it.
* **Reviews:** Users can add reviews to listings.
* **Review Authorization:** Only the user who created a review can delete it.
* **Mapbox Integration:** Display the location of individual listings on an interactive map.
* **MVC Architecture:** Organized application structure using the Model-View-Controller pattern.
* **Responsive UI:** HTML, CSS, Bootstrap, and JavaScript for the user interface.

## Tech Stack

* **Frontend:** HTML, CSS, JavaScript, EJS, Bootstrap
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **Authentication:** Passport.js, Passport Local
* **Maps:** Mapbox
* **Architecture:** MVC
* **Deployment:** Render

## Authorization

The application uses ownership-based authorization to protect listings and reviews.

* All users can view published listings.
* Only authenticated users can create listings.
* Only the owner of a listing can edit or delete it.
* Only the author of a review can delete that review.

## Installation

1. Clone the repository:

   ```bash
   git clone YOUR_GITHUB_REPOSITORY_URL
   ```

2. Navigate to the project directory:

   ```bash
   cd your-project-folder
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file and configure your environment variables:

   ```env
   ATLASDB_URL=your_mongodb_connection_string
   SECRET=your_session_secret
   MAP_TOKEN=your_mapbox_token
   ```

5. Start the application:

   ```bash
   node app.js
   ```

6. Open `http://localhost:8080` in your browser.

## Project Architecture

The project follows the MVC (Model-View-Controller) architecture to separate database operations, application logic, and user interface.

* **Models:** Define and manage MongoDB data using Mongoose.
* **Views:** Render dynamic pages using EJS.
* **Controllers:** Handle application logic and process requests.
* **Routes:** Define application endpoints and connect them to controllers.
* **Middleware:** Handle authentication, authorization, validation, and error handling.

## Future Improvements

* Online payment integration
* User profile management
* Booking management
* Email notifications

## Author

Pankaj Naik
