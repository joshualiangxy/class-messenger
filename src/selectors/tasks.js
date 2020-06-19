const getSortedTasks = (
  tasks,
  { text = '', sortBy = 'deadline', grouped = false } = {}
) => {
  const lowercaseText = text.toLowerCase();

  const processedTasks = tasks
    .filter(
      task =>
        task.title.toLowerCase().includes(lowercaseText) ||
        task.description.toLowerCase().includes(lowercaseText) ||
        task.module.toLowerCase().includes(lowercaseText)
    )
    .sort((taskOne, taskTwo) => {
      const taskOneCompleted =
        typeof taskOne.completed === 'object'
          ? Object.values(taskOne.completed).reduce(
              (userOneCompletedState, userTwoCompletedState) =>
                userOneCompletedState && userTwoCompletedState,
              true
            )
          : taskOne.completed;
      const taskTwoCompleted =
        typeof taskTwo.completed === 'object'
          ? Object.values(taskTwo.completed).reduce(
              (userOneCompletedState, userTwoCompletedState) =>
                userOneCompletedState && userTwoCompletedState,
              true
            )
          : taskTwo.completed;

      if (taskOneCompleted && !taskTwoCompleted) return 1;
      else if (!taskOneCompleted && taskTwoCompleted) return -1;
      else {
        switch (sortBy) {
          case 'deadline':
            if (taskOne.deadline && taskTwo.deadline)
              return taskOne.deadline - taskTwo.deadline;
            else if (taskOne.deadline) return -1;
            else if (taskTwo.deadline) return 1;
            else return 0;
          case 'deadlineReversed':
            if (taskOne.deadline && taskTwo.deadline)
              return taskTwo.deadline - taskOne.deadline;
            else if (taskOne.deadline) return 1;
            else if (taskTwo.deadline) return -1;
            else return 0;
          case 'name':
            return taskOne.title.localeCompare(taskTwo.title);
          case 'nameReversed':
            return taskTwo.title.localeCompare(taskOne.title);
        }
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
