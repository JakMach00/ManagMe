import { Story } from "../models/story";
import { db } from "./firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";

export class StoriesApi {
  private readonly STORAGE_KEY = "stories";

  async get(uuid: string): Promise<Story | undefined> {
    try {
      const storyRef = doc(db, this.STORAGE_KEY, uuid);
      const storyDoc = await getDoc(storyRef);

      if (storyDoc.exists()) {
        const storyData = storyDoc.data() as Story;
        return new Story(
          storyData.uuid,
          storyData.name,
          storyData.description,
          storyData.priority,
          storyData.status,
          storyData.createDate,
          storyData.projectUuid,
          storyData.ownerUuid
        );
      } else {
        console.error("Story not found:", uuid);
        return undefined;
      }
    } catch (error) {
      console.error("Error fetching Story:", error);
      return undefined;
    }
  }

  async getAll(): Promise<Story[]> {
    try {
      const storiesRef = collection(db, this.STORAGE_KEY);
      const storiesSnapshot = await getDocs(storiesRef);
      const storiesList = storiesSnapshot.docs.map((doc) => {
        const storyData = doc.data();
        return new Story(
          storyData.uuid,
          storyData.name,
          storyData.description,
          storyData.priority,
          storyData.status,
          storyData.createDate,
          storyData.projectUuid,
          storyData.ownerUuid
        );
      });
      return storiesList;
    } catch (error) {
      console.error("Error fetching stories:", error);
      return [];
    }
  }

  async create(data: Story) {
    try {
      await setDoc(doc(db, this.STORAGE_KEY, data.uuid), {
        uuid: data.uuid,
        name: data.name,
        description: data.description,
        priority: data.priority,
        status: data.status,
        createDate: data.createDate,
        projectUuid: data.projectUuid,
        ownerUuid: data.ownerUuid,
      });
      console.info("Story created successfully");
    } catch (error) {
      console.error("Error creating story: ", error);
    }
  }

  async update(data: Story) {
    try {
      const storyRef = doc(db, this.STORAGE_KEY, data.uuid);
      await setDoc(
        storyRef,
        {
          uuid: data.uuid,
          name: data.name,
          description: data.description,
          priority: data.priority,
          status: data.status,
          createDate: data.createDate,
          projectUuid: data.projectUuid,
          ownerUuid: data.ownerUuid,
        },
        { merge: true }
      );
      console.info("Story updated successfully");
    } catch (error) {
      console.error("Error updating story:", error);
    }
  }

  async delete(uuid: string): Promise<void> {
    try {
      const storyRef = doc(db, this.STORAGE_KEY, uuid);
      await deleteDoc(storyRef);
      console.info("Story deleted successfully");
    } catch (error) {
      console.error("Error deleting story:", error);
    }
  }

  async getAllByProjectsUuid(uuid: string | undefined): Promise<Story[]> {
    const stories = await this.getAll();
    return stories.filter((story) => story.projectUuid == uuid);
  }
}
