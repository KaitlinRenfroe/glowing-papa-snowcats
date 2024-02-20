require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 5500;
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser');

//set view engine to ejs 
let path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }))

// use res. render to load up an ejs view file
let myTypeServer = "The Reformer";


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const result = await client.db("snowcats-database").collection("snowcats-collection").find().toArray();

   // console.log("cxnDB result: ", result);

    return result;

    await client.db("admin").command({ ping: 1 });

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
//run().catch(console.dir);

app.get('/read', async (req,res) => {

  let myResultServer = await run();

  console.log("MyResultServer:", myResultServer[0].userName);

  res.render('index', {
    myTypeClient: myTypeServer, 
    myResultClient: myResultServer
  });
});

run().catch(console.dir);

app.get('/', function(req, res) {

  res.render('index', {
   
    myTypeClient: myTypeServer 

  });
  
});

app.get('/send', function (req, res) {
  res.send('Hello World from Express')
})

app.listen(port, () => {
  console.log(`Papa app listening on port ${port}`)
})