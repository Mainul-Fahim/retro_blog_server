const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yu2o5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('connection error', err);
  const blogsCollection = client.db("retroBlog").collection("blogs");
  const adminCollection = client.db("retroBlog").collection("admins");
  console.log('Database Connected Successfully');
  // perform actions on the collection object

  app.post('/addBlog', (req, res) => {
    const newBlog = req.body;
    console.log('new Service', newBlog);
    blogsCollection.insertOne(newBlog)
        .then(result => {
            console.log('insertedCount', result);
            res.send(result)
        })
})

app.get('/blogs', (req, res) => {
  blogsCollection.find()
      .toArray((err, items) => {
          res.send(items)
      })
})

// app.post('/addAdmin', (req, res) => {
//   const newAdmin = req.body;
//   console.log('new Service', newAdmin);
//   adminCollection.insertOne(newAdmin)
//       .then(result => {
//           console.log('insertedCount', result);
//           res.send(result)
//       })
// })

// app.post('/isAdmin', (req, res) => {
//   const email = req.body.email;
//   console.log('new Service', email);
//   adminCollection.find({email:email})
//   .toArray((err,items)=>{
//       res.send(items.length>0)
//     })
// })

app.get('/blogContent/:id',(req,res) => {
  console.log('id',req.params.id);
  blogsCollection.find({_id: ObjectId(req.params.id)})
  .toArray((err,items)=>{
      res.send(items[0])
  })
})

// app.delete('/delete/:id',(req,res) => {
//   const id=ObjectId(req.params.id);
//   serviceCollection.findOneAndDelete({_id: id})
//   .then(result => {
//     console.log(result);
//     res.send(result.deletedCount>0)
//   })
// })
  //client.close();
});




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})