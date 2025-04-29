First connect to DB, then listen incoming requests for Server

Use capital letter for mongoose model

ex: User, Admin

MongoDB dynamically generates two fields for each inserted document

\_id: Unique Id of document
\_\_v: version of document

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

npm i bcrypt

brcypt.hash(plaintext,salt Rounds)
bcrypt.compare(incomingtext,hashedText)

# Authentication

# Deployment

- allowed Ip address of EC2 public Ip on mongodb
- Installed pm2 package
- npm install pm2 -g
- Custom name for pm2 process
- pm2 start npm --name "devcrush-backend" -- start
- pm2 logs
- pm2 flush <name of process>
- pm2 list
- pm2 stop (process name)
- pm2 delete (process name)

# Nginx Config

server_name example.com; # Change to your domain or public IP

    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

- save(Ctrl+O) and Exit (Ctrl+X)

-sudo systemctl restart nginx

- Modify the Base url in frontend project to --> /api

# .env for security of Keys

- added a dotenv package

- created a .env file containg all secret-information
