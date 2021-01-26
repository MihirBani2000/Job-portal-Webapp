# MERN Stack Boilerplate

## Installations

### Node

* For Linux:
```
curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
sudo apt-get install -y nodejs
```

* For Mac:
```
brew install node
```

### MongoDB

Install the community edition [here](https://docs.mongodb.com/manual/installation/#mongodb-community-edition-installation-tutorials).


### React

```
npm install -g create-react-app
```

## Running the boilerplate

* Run Mongo daemon:
(I have used MongoAtlas)
Change the `mongoURI` value in the file accordingly  
```
./backend/config/default.json
```


* Run Express Backend:
```
cd backend/
npm install
npm start
```

* Run React Frontend:
```
cd frontend/
npm install
npm start
```

Navigate to [http://localhost:3000/](http://localhost:3000/) in your browser.



Small bug:
After login, the website shows an error, but simply Reload the page, and it works properly then(logged in)