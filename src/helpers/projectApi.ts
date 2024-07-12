import { Project } from "../models/project";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

export class ProjectsApi {
  private readonly STORAGE_KEY = "projects";

  async get(uuid: string): Promise<Project | undefined> {
    try {
      const projectRef = doc(db, this.STORAGE_KEY, uuid);
      const projectDoc = await getDoc(projectRef);

      if (projectDoc.exists()) {
        const projectData = projectDoc.data() as Project;
        return new Project(
          projectData.uuid,
          projectData.name,
          projectData.description,
          projectData.isActive
        );
      } else {
        console.error("Project not found:", uuid);
        return undefined;
      }
    } catch (error) {
      console.error("Error fetching project:", error);
      return undefined;
    }
  }

  async getAll(): Promise<Project[]> {
    try {
      const projectsRef = collection(db, this.STORAGE_KEY);
      const projectsSnapshot = await getDocs(projectsRef);
      const projectList = projectsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return new Project(
          data.uuid,
          data.name,
          data.description,
          data.isActive
        );
      });
      return projectList;
    } catch (error) {
      console.error("Error fetching projects:", error);
      return [];
    }
  }

  async create(data: Project) {
    try {
      await setDoc(doc(db, this.STORAGE_KEY, data.uuid), {
        uuid: data.uuid,
        name: data.name,
        description: data.description,
        isActive: data.isActive,
      });
      console.info("Project created successfully");
    } catch (error) {
      console.error("Error creating project: ", error);
    }
  }

  async update(data: Project) {
    try {
      const projectRef = doc(db, this.STORAGE_KEY, data.uuid);
      await setDoc(
        projectRef,
        {
          uuid: data.uuid,
          name: data.name,
          description: data.description,
          isActive: data.isActive,
        },
        { merge: true }
      );
      console.info("Project updated successfully");
    } catch (error) {
      console.error("Error updating project:", error);
    }
  }

  async delete(uuid: string): Promise<void> {
    try {
      const projectRef = doc(db, this.STORAGE_KEY, uuid);
      await deleteDoc(projectRef);
      console.info("Project deleted successfully");
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  }

  async getActiveProject(): Promise<Project | undefined> {
    const projects: Project[] = await this.getAll();
    return projects.find((x) => x.isActive == true);
  }
}
