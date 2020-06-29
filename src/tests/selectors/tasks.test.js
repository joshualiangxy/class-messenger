import getSortedTasks from '../../selectors/tasks';
import filtersGrouped, {
  filtersName,
  filtersNameReversed,
  filtersDeadline,
  filtersDeadlineReversed
} from '../fixtures/filters';
import tasks from '../fixtures/tasks';

describe('text filter', () => {
  it('should filter modules by text value', () => {
    const filters = { ...filtersGrouped, text: 'CS20' };

    expect(getSortedTasks(tasks, filters)).toEqual({
      CS2040S: {
        groupName: 'CS2040S',
        tasks: [tasks[3]]
      },
      CS2030: {
        groupName: 'CS2030',
        tasks: [tasks[0], tasks[1]]
      },
      others: { groupName: 'others', tasks: [] }
    });
  });

  it('should filter modules by text value regardless of case', () => {
    const filters = { ...filtersGrouped, text: 'cs20' };

    expect(getSortedTasks(tasks, filters)).toEqual({
      CS2040S: {
        groupName: 'CS2040S',
        tasks: [tasks[3]]
      },
      CS2030: {
        groupName: 'CS2030',
        tasks: [tasks[0], tasks[1]]
      },
      others: { groupName: 'others', tasks: [] }
    });
  });
});

describe('sort', () => {
  it('should sort tasks by deadline', () => {
    const filters = filtersDeadline;

    expect(getSortedTasks(tasks, filters)).toEqual({
      others: { groupName: 'others', tasks }
    });
  });

  it('should sort tasks by deadline reversed', () => {
    const filters = filtersDeadlineReversed;

    expect(getSortedTasks(tasks, filters)).toEqual({
      others: {
        groupName: 'others',
        tasks: [tasks[1], tasks[0], tasks[2], tasks[3]]
      }
    });
  });

  it('should sort tasks by name', () => {
    const filters = filtersName;

    expect(getSortedTasks(tasks, filters)).toEqual({
      others: {
        groupName: 'others',
        tasks: [tasks[1], tasks[0], tasks[3], tasks[2]]
      }
    });
  });

  it('should sort tasks by name reversed', () => {
    const filters = filtersNameReversed;

    expect(getSortedTasks(tasks, filters)).toEqual({
      others: {
        groupName: 'others',
        tasks: [tasks[0], tasks[1], tasks[2], tasks[3]]
      }
    });
  });
});

describe('grouped state', () => {
  it('should put all tasks in others group if false', () => {
    expect(getSortedTasks(tasks, filtersDeadline)).toEqual({
      others: {
        groupName: 'others',
        tasks
      }
    });
  });

  it('should put all tasks to respective groups if true', () => {
    expect(getSortedTasks(tasks, filtersGrouped)).toEqual({
      CS2030: {
        groupName: 'CS2030',
        tasks: [tasks[0], tasks[1]]
      },
      CS2040S: {
        groupName: 'CS2040S',
        tasks: [tasks[3]]
      },
      others: {
        groupName: 'others',
        tasks: [tasks[2]]
      }
    });
  });
});
