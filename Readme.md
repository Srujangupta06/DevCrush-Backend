First connect to DB, then listen incoming requests for Server

Use capital letter for mongoose model

ex: User, Admin


MongoDB dynamically generates two fields for each inserted document

_id: Unique Id of document
__v: version of document


Client: Sends data in the form of json which is not understand by Server

Server: Use a middleware to parse the json

How we use MiddleWare?


app.use(middleware name)


If two documents have same field and using findOne method mongoose return one document based on below conditions:

If Sorted then it give first Document 

Else,

it searches for first document (of two documents) which is inserted first in its internal Storage..


# Data Validation & Sanitization

validate -> function only run for newly inserted documents not when we want to update





# validator package


# Password Encryption

npm i  bcrypt

brcypt.hash(plaintext,salt Rounds)
bcrypt.compare(incomingtext,hashedText)

# Authentication

