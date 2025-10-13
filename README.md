# MEAN-Backend

A Node.js backend for a MEAN stack application, using Express, MongoDB (via Mongoose), and supporting authentication and CRUD operations for posts.

## Features

- RESTful API for posts (`/api/posts`)
- User authentication (`/api/auth`)
- Image upload support (Multer)
- MongoDB integration (Mongoose)
- CORS enabled

## Project Structure

```
.
├── app.js
├── server.js
├── models/
│   ├── post.js
│   └── user.js
├── routes/
│   ├── posts.js
│   └── auth.js
├── images/
├── package.json
└── package-lock.json
```

## Setup

1. **Install dependencies:**
   npm i

2. **Start MongoDB:**  
   Make sure MongoDB is running locally on port 27017.

3. **Run the server:**
   npm start

   Or, for development with auto-reload:
   npm run dev
   /
   nodemon dev


4. **API Endpoints:**
   - `POST /api/auth` - User authentication
   - `GET /api/posts` - Fetch posts (supports pagination)
   - `POST /api/posts` - Create a post (with image upload)
   - `PUT /api/posts/:id` - Update a post
   - `DELETE /api/posts/:id` - Delete a post

## Configuration

- MongoDB connection string is set to `mongodb://localhost:27017/mean_demo` in `app.js`.
- Images are stored in the `/images` folder.

## Notes

- Ensure the `/images` directory exists and is writable.
- CORS is enabled for all origins.
- For authentication, see `models/user.js` and `routes/auth.js`.

## License

MIT