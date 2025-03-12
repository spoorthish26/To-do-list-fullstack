from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

# CORS (Allows frontend to connect to backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Task Model
class Task(BaseModel):
    id: int
    title: str
    description: str

tasks: List[Task] = []
task_id_counter = 1  # Keeps track of task IDs

# Add a Task
@app.post("/tasks/")
def create_task(task: Task):
    global task_id_counter
    task.id = task_id_counter
    task_id_counter += 1
    tasks.append(task)
    return task

# Get All Tasks
@app.get("/tasks/")
def get_tasks():
    return tasks

# Delete a Task
@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    global tasks
    tasks = [task for task in tasks if task.id != task_id]
    return {"message": "Task deleted"}
@app.get("/")
def read_root():
    return {
        "message": "Welcome to the FastAPI To-Do List API!",
        "docs": "Visit http://127.0.0.1:8000/docs to test the API."
    }