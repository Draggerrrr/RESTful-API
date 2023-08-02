const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();
const port = 3000;

app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');

const articleSchema = new mongoose.Schema({
    title : String,
    content : String
});

const Article = mongoose.model("Article", articleSchema);


// Code Logic start

// An app route using chaining method for ALL articles.

app.route("/articles")

//Get all artciles
.get(
    function(request, response){
        Article.find()
            .then(function(error, foundArticles){
    
                if(!error){
                    response.send(foundArticles);
                }
                else{
                    response.send(error);
                }
            });
    }
)

//Post a specific article 
.post(function(request, response){

    // Adding document to database.
    const newArticle = new Article({
     title : request.body.title,
     content : request.body.content
    });
 
    //Save method
    newArticle.save()
    .then(()=>{
     response.send("Saved article successfully");
    })
    .catch((err)=>{
      response.send(err);
    })
 
 })

 //Delete all articles
 
 .delete(function(request, response){

    Article.deleteMany()
    .then(()=>{
        response.send("Deleted all articles successfully");
    })
    .catch((err)=>{
        response.send(err);
    })
});

// App route for specific articles.

app.route("/articles/:articleTitle")

    // Get a specific article
.get(function(request, response){

    Article.findOne({title : request.params.articleTitle})
        .then((foundArticle)=>{
            response.send(foundArticle);
        })
        .catch((error)=>{
            response.send(error);
        })
})

    // Put a specific article 
.put( function(request, response){

    Article.replaceOne({title : request.params.articleTitle},                             // Condition
                      { title : request.body.title , content : request.body.content},           // Update
                      {overwrite : true}                                                       //
        )
        .then(()=>{
            response.send("Updated Successfully");
        })
        .catch((error)=>{
            response.send(error);
        })
})

    //Patch a specific article
.patch( function(request, response){

    Article.updateOne({title : request.params.articleTitle},
                      { $set : request.body},
            )
            .then(()=>{
                response.send("Updated Successfully");
            })
            .catch((error)=>{
                response.send(error);
            })
})

    // Delete a specific article
.delete( function(request, response){
    Article.deleteOne({title : request.params.articleTitle})
        .then(()=>{
            response.send("Successfully Deleted");
        })
        .catch((error)=>{
            response.send(error);
        })
});

app.listen(port, ()=>{
    console.log("Server started successfully")
})