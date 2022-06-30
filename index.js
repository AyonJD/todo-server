const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y4mhh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db("todoApp");
        const taskCollection = db.collection("task");

        // API to Run Server 
        app.get("/", async (req, res) => {
            res.send("Server is Running");
        });

        // API to Get All Tasks
        app.get("/tasks", async (req, res) => {
            const tasks = await taskCollection.find({}).toArray();
            res.send(tasks);
        }
        );

        //API to delete a task with id
        app.delete("/tasks/:id", async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            await taskCollection.deleteOne({ _id: ObjectId(id) });
            res.send("Task Deleted");
        }
        );

        //API to update a task with id
        app.put("/tasks/:id", async (req, res) => {
            const id = req.params.id;
            const task = req.body;
            const result = await taskCollection.updateOne({ _id: ObjectId(id) }, { $set: task });
            res.send(result);
        }
        );
    }
    finally {
        // client.close()
    }
}

run().catch(console.dir);
app.listen(port, () => console.log(`Listening on port ${port}`));