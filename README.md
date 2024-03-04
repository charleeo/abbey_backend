## Description
This assignment was developed with Node JS, Nest JS, JavaScript, Typescript, PostgreSQL, NPM.
It is a RESTfull web service that is built with JSON responses.

## Focus:
The focus is around building RESTful APIs for a Mortgage management corporation. 
No test cases was created due to time limit

## Requirements: 
- PostgreSQL Database
- NodeJS Runtime environemt
- NPM (Node Package Manager)

## How To Run
To run this project after the above requirments: 
 - Create a database with a write privilege on your PostgreSQL database and note down your credentials.
 Create a <.env> file at the project root and make a copy of the <.example.env> file into the .env you just created. Replace the database credentials section with your new credentials.
 Don't change the port, we are using it at the frontend.
 - When you are done setting up, run the following commands on your terminal:
 [npm install], [npm run migration:run], [npm run start] and [npm run config] in this order. You can run the last command in a new terminal when the application already running
 After those steps, your project should be reading to accept requests



