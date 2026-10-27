const loadData = () => {
    const savedData = localStorage.getItem('tasks');
    if (savedData === null) {
        return null;
    }
    try {  
        const tasks = JSON.parse(savedData);

        // Check whether the saved data is an array
        if (Array.isArray(tasks)) {
            console.log("Loaded tasks from localStorage:", tasks);
            return tasks;
        }

        return null;
    } catch (error) {
        console.error("Failed to load saved tasks:", error);
        return null;
    }
}

const saveTasks = (tasks) => {
  try {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } catch (error) {
    console.error("Failed to save tasks:", error);
  }
};

export { loadData, saveTasks };