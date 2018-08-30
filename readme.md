# Homework-Management
A homework manager that helps you remember and do you homework 

## Features
The features that are in the project are
- [x] Password Hashing
- [x] Due Work
- [ ] Connect to Google Classroom
- [ ] OAuth with Google & Facebook

## Contributing

  [Click here to Contribute](CONTRIBUTING.md)

## How to run it
- Install Node.js (and npm)
- Clone the project
- Run `npm install`
- Open `.env.example` and fill it out (you need a postgresql database for `DATAURI`, pick a random number for `SALTROUNDS` & select `true or false` in `DATASUPPORTSSL`)
- Run `npm start` and go to http://localhost:5000

**Please always use the Development branch**

**For the Database, you will need to make one (one day I will make a script that will do this, but for now, you need to create the database yourself).** Or you could make a PR that has one?
