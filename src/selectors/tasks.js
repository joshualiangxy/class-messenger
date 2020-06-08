const getSortedTasks = (tasks, { text, sortBy, grouped }) => {
  const lowercaseText = text.toLowerCase();

  const processedTasks = tasks
    .filter(
      task =>
        task.title.toLowerCase().includes(lowercaseText) ||
        task.description.toLowerCase().includes(lowercaseText) ||
        task.module.toLowerCase().includes(lowercaseText)
    )
    .sort((taskOne, taskTwo) => {
      switch (sortBy) {
        case 'deadline':
          if (taskOne.deadline && taskTwo.deadline)
            return taskOne.deadline - taskTwo.deadline;
          else if (taskOne.deadline) return -1;
          else if (taskTwo.deadline) return 1;
          else return taskOne.title.localeCompare(taskTwo.title);
        case 'name':
          return taskOne.title.localeCompare(taskTwo.title);
      }
    });

  const sortedList = {};

  if (grouped) {
    processedTasks.forEach(task => {
      if (task.groupName) {
        const gid = task.gid;

        if (!sortedList[gid])
          sortedList[gid] = { groupName: task.groupName, tasks: [] };
        sortedList[gid].tasks.push(task);
      } else if (task.module) {
        const module = task.module;

        if (!sortedList[module])
          sortedList[module] = { groupName: task.module, tasks: [] };
        sortedList[module].tasks.push(task);
      } else {
        if (!sortedList.others)
          sortedList.others = { groupName: 'others', tasks: [] };
        sortedList.others.tasks.push(task);
      }
    });
  } else sortedList.others = { groupName: 'others', tasks: processedTasks };

  return sortedList;
};

export default getSortedTasks;
