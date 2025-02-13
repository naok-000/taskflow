// シードデータを挿入するためのファイル
// MongoDBに接続し、シードデータを挿入する
const mongoose = require("mongoose");
const Task = require("../models/tasks");
const Project = require("../models/projects");

// MongoDBに接続
mongoose
    .connect("mongodb://127.0.0.1:27017/taskflow")
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log("MongoDB connection error");
        console.log(err);
    });

const projectsData = [
    {
        title: "Project 1",
        description: "Description 1",
    },
    {
        title: "Project 2",
        description: "Description 2",
    },
    {
        title: "Project 3",
        description: "Description 3",
    },
];

const tasksListData = [
    [
        {
            title: "Project1 - Task 1",
            description: "Description 1",
        },
        {
            title: "Project1 - Task 2",
            description: "Description 2",
        },
        {
            title: "Project1 - Task 3",
            description: "Description 3",
        },
    ],
    [
        {
            title: "Project2 - Task 1",
            description: "Description 1",
        },
        {
            title: "Project2 - Task 2",
            description: "Description 2",
        },
        {
            title: "Project2 - Task 3",
            description: "Description 3",
        },
    ],
    [
        {
            title: "Project3 - Task 1",
            description: "Description 1",
        },
        {
            title: "Project3 - Task 2",
            description: "Description 2",
        },
        {
            title: "Project3 - Task 3",
            description: "Description 3",
        },
    ],
];

const seedDB = async () => {
    await Project.deleteMany({});
    await Task.deleteMany({});
    let index = 0;
    for (const projectData of projectsData) {
        const tasksData = tasksListData[index];
        const project = new Project(projectData);
        await project.save();
        for (const taskData of tasksData) {
            const task = new Task(taskData);
            task.project = project;
            await task.save();
        }
        index++;
    }
};

seedDB().then(() => {
    mongoose.connection.close();
    console.log("Seed data inserted");
});
