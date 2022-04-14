# Banking Database and Systems Management
This repository contains all the frontend, backend code and sql schematics. The frontend is made with the
help of Angular (yes, typescript is nice). The backend is written in NodeJS, connected to the database without using
any fancy bloat applications. The database is in mysql.

# Where to find stuff
- Code for frontend  
  In the frontend folder, of course. Find all the components in `src/app/`.
- Code for backend  
  In the backend folder. All code resides in `index.js` (as of now).
- MySQL schematics and population  
  In the population_control folder. Run `populator.py` using python3.8+ and find the population script in `population_control/data/tryjection`. You can also find the password dumps so that you can access the dummy users.

# How to run stuff
- Populate the sql databse  
  I will assume some familiarity. Execute `tryjection.sql`. It should create and populate a database. Also create two users (except root and give them appropriate permissions(use DBA for ease)).
- Run the backend  
  create a `.env` file in the backend directory. Add the following:
  ```text
  DB_USER_1=user1
  DB_PASSWORD_1=pass1
  DB_USER_2=user2
  DB_PASSWORD_2=pass2
  secret=put-any-string-here
  ```
  Remember to replace `user1, user2, pass1, pass2` appropriately.  
  For developing the backend use `npm i -g nodemon` and once it is done, fire up a shell and run `npm serve`. This should get the backend live and have some form of crash protection. If you don't want it, just use `npm start`.
- Run the frontend (dev mode)  
  Create another `.env` file in `frontend/src`. Add the following:
  ```
  backend='localhost:3000'
  ```
  Remember to change your port if you have modified anything.  
  That's it, fire up a shell and run `ng serve`. Enjoy the webpage! And make pull requests.

