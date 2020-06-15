import tasksReducer from '../../reducers/tasks';
import tasks from '../fixtures/tasks';

describe('reducer', () => {
  it('should initialise default state', () => {
    const state = tasksReducer(undefined, { type: '@@INIT' });

    expect(state).toEqual([]);
  });

  it('should add task', () => {
    const task = {
      completed: false,
      deadline: 191283791823791,
      description: 'Finish ASAP',
      id: 'testid',
      module: 'IS1103',
      title: 'Write report'
    };
    const state = tasksReducer(tasks, { type: 'ADD_TASK', task });

    expect(state).toEqual([...tasks, task]);
  });

  it('should remove personal task', () => {
    const state = tasksReducer(tasks, {
      type: 'REMOVE_PERSONAL_TASK',
      id: tasks[2].id
    });

    expect(state).toEqual([tasks[0], tasks[1], tasks[3]]);
  });

  it('should not remove personal task if id not found', () => {
    const state = tasksReducer(tasks, {
      type: 'REMOVE_PERSONAL_TASK',
      id: 'testid'
    });

    expect(state).toEqual(tasks);
  });

  it('should edit personal task', () => {
    const id = '5feb18c0-78a8-49b6-8584-75b8c1b40abc';
    const updates = {
      completed: false,
      description: 'Finish ASAP',
      id: '5feb18c0-78a8-49b6-8584-75b8c1b40abc',
      module: 'CS2030',
      title: 'Fix up midterms'
    };
    const state = tasksReducer(tasks, {
      type: 'EDIT_PERSONAL_TASK',
      id,
      updates
    });

    expect(state).toEqual([updates, tasks[1], tasks[2], tasks[3]]);
  });

  it('should not edit personal task if id not found', () => {
    const id = 'testid';
    const updates = {
      completed: false,
      description: 'Finish ASAP',
      id: 'testid',
      module: 'CS2030',
      title: 'Fix up midterms'
    };
    const state = tasksReducer(tasks, {
      type: 'EDIT_PERSONAL_TASK',
      id,
      updates
    });

    expect(state).toEqual(tasks);
  });

  it('should set tasks', () => {
    const initialState = [
      {
        completed: false,
        description: 'Finish ASAP',
        id: 'testid',
        module: 'CS2030',
        title: 'Fix up midterms'
      }
    ];
    const state = tasksReducer(initialState, { type: 'SET_TASKS', tasks });

    expect(state).toEqual(tasks);
  });

  it('should toggle completed state of personal task', () => {
    const id = tasks[3].id;
    const completedState = tasks[3].completed;
    const state = tasksReducer(tasks, {
      type: 'TOGGLE_COMPLETED_PERSONAL',
      id,
      completedState
    });

    expect(state).toEqual([
      tasks[0],
      tasks[1],
      tasks[2],
      {
        ...tasks[3],
        completed: !completedState
      }
    ]);
  });

  it('should not toggle completed state of personal task if id not found', () => {
    const id = 'testid';
    const completedState = tasks[3].completed;
    const state = tasksReducer(tasks, {
      type: 'TOGGLE_COMPLETED_PERSONAL',
      id,
      completedState
    });

    expect(state).toEqual(tasks);
  });

  it('should remove task data', () => {
    const state = tasksReducer(tasks, { type: 'REMOVE_TASK_DATA' });

    expect(state).toEqual([]);
  });
});
