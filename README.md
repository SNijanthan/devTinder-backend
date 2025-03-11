# DevTinder — Backend

## Tech Stack

- Runtime: `Node.js`
- Framework: `Express.js`
- Database: `MongoDB`

## Dependencies

### Core Libraries:

- express → Web framework for Node.js
- mongoose → ODM for MongoDB
- jsonwebtoken (jwt) → Handles authentication
- validator → For data validation on both DB level and API level
- bcrypt → Hashes passwords
- cors → To handle cross-origin requests
- dotenv → To manage environment variables
- cookie-parser → Parses cookies

### Development Dependencies:

- nodemon → Auto-restarting for development

## API Structures:

### Auth Router

- `POST /signup` → Registers a new user
- `POST /login` → User login
- `POST /logout` → Logs out a user

### Profile Router

- `GET /profile/view` → For viewing profile
- `PATCH /profile/edit` → For editing profile
- `PATCH /profile/forgot-password` → For changing password

### connections Router

- `POST /request/send/:status/:userId` → Sends an interest request to a user or Ignores a user

- `POST /request/review/:status/:requestId` → Accept or reject a received request

- `POST /request/review/accepted/:requestId` → Accepts a received request
- `POST /request/review/rejected/:requestId` → Rejects a received request

### User Router

- `GET /user/connections` → Retrieves all accepted connections
- `GET /user/requests/received` → Retrieves received connection requests
- `GET /user/feed` → Retrieves all the users
