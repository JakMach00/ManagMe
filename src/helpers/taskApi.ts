import { Task } from "../models/task";
import { db } from "./firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";

export class TaskApi {
  private readonly STORAGE_KEY = "tasks";

  async get(uuid: string): Promise<Task | undefined> {
    try {
      const taskRef = doc(db, this.STORAGE_KEY, uuid);
      const taskDoc = await getDoc(taskRef);

      if (taskDoc.exists()) {
        const taskData = taskDoc.data() as Task;
        console.log(`Start date: ${taskData.createDate}`)
        return new Task(
          taskData.uuid,
          taskData.name,
          taskData.description,
          taskData.priority,
          taskData.storyUuid,
          taskData.hoursToFinish,
          taskData.status,
          taskData.createDate,
          taskData.startDate,
          taskData.finishDate,
          taskData.assignedUserUuid
        );
      } else {
        console.error("Task not found:", uuid);
        return undefined;
      }
    } catch (error) {
      console.error("Error fetching Task:", error);
      return undefined;
    }
  }

  async getAll(): Promise<Task[]> {
    try {
      const tasksRef = collection(db, this.STORAGE_KEY);
      const tasksSnapshot = await getDocs(tasksRef);
      const tasksList = tasksSnapshot.docs.map((doc) => {
        const taskData = doc.data() as Task;
        return new Task(
          taskData.uuid,
          taskData.name,
          taskData.description,
          taskData.priority,
          taskData.storyUuid,
          taskData.hoursToFinish,
          taskData.status,
          taskData.createDate,
          taskData.startDate,
          taskData.finishDate,
          taskData.assignedUserUuid
        );
      });
      return tasksList;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return [];
    }
  }

  async create(data: Task) {
    try {
      await setDoc(doc(db, this.STORAGE_KEY, data.uuid), {
        uuid: data.uuid,
        name: data.name,
        description: data.description,
        hoursToFinish: data.hoursToFinish,
        priority: data.priority,
        storyUuid: data.storyUuid,
        status: data.status,
        createDate: data.createDate,
        startDate: data.startDate,
        finishDate: data.finishDate,
        assignedUserUuid: data.assignedUserUuid,
      });
      console.info("Task created successfully");
    } catch (error) {
      console.error("Error creating story: ", error);
    }
  }

  async update(data: Task) {
    try {
      const taskRef = doc(db, this.STORAGE_KEY, data.uuid);
      await setDoc(
        taskRef,
        {
          uuid: data.uuid,
          name: data.name,
          description: data.description,
          hoursToFinish: data.hoursToFinish,
          priority: data.priority,
          storyUuid: data.storyUuid,
          status: data.status,
          createDate: data.createDate,
          startDate: data.startDate,
          finishDate: data.finishDate,
          assignedUserUuid: data.assignedUserUuid,
        },
        { merge: true }
      );
      console.info("Task updated successfully");
    } catch (error) {
      console.error("Error updating Task:", error);
    }
  }

  async delete(uuid: string) {
    try {
      const taskRef = doc(db, this.STORAGE_KEY, uuid);
      await deleteDoc(taskRef);
      console.info("Task deleted successfully");
    } catch (error) {
      console.error("Task deleting story:", error);
    }
  }

  async getAllByStoryUuid(uuid: string | null): Promise<Task[]> {
    const tasks = await this.getAll();
    return tasks.filter((task) => task.storyUuid == uuid);
  }
}
