const tasks = [
  {
    completed: false,
    deadline: 1591329600000,
    description: 'Catch up on lectures!',
    id: '5feb18c0-78a8-49b6-8584-75b8c1b40abc',
    module: 'CS2030',
    title: 'Watch lecture'
  },
  {
    completed: false,
    description: '',
    id: 'a1050220-fa88-4dc2-aa9d-9521ae95de47',
    module: 'CS2030',
    title: 'Do lab'
  },
  {
    completed: true,
    description: '',
    id: 'd2b10492-853d-4290-baf8-cb47cd4ec04e',
    module: '',
    title: 'Read a book everyday'
  },
  {
    completed: true,
    description: '',
    id: '73c8ac1a-1d06-46ee-a39e-e656e1e41db0',
    module: 'CS2040S',
    title: 'Do problem set'
  }
];

export const groupTasks = [
  {
    completed: { testuid: false },
    description: 'Finish by Sunday!',
    downloadURLs: {
      testuid: { fileName: 'Homework.pdf', downloadURL: 'website.com' }
    },
    gid: '72b6b3bb-cb74-4d08-ae67-dfc1b51baaf9',
    id: '076e610e-aade-4d2b-897f-81a29f00c76b',
    module: 'CS1231',
    title: 'Homework 1',
    uploadRequired: true
  },
  {
    completed: {},
    deadline: 1593403200000,
    description: '',
    gid: 'ce5c9b1b-e4d2-4dd2-bae4-7c559e8235ea',
    id: '0b80e917-78a4-4f87-a379-cdc1733923d6',
    module: 'CS2040S',
    title: 'Do problem set'
  },
  {
    completed: { testuid: false },
    deadline: 1593489600000,
    description: 'Finish readings',
    downloadURLs: {},
    gid: '3e28d54d-ebc1-4469-be21-e59ce210f245',
    id: 'c1511c73-07b9-44cd-a4bd-01758515acb5',
    module: 'GEQ1000',
    title: 'Physics readings',
    uploadRequired: true
  }
];

export const singleGroup = [
  {
    completed: { testuid: false },
    description: 'Finish by Sunday!',
    downloadURLs: {
      testuid: { fileName: 'Homework.pdf', downloadURL: 'website.com' }
    },
    gid: '72b6b3bb-cb74-4d08-ae67-dfc1b51baaf9',
    id: '076e610e-aade-4d2b-897f-81a29f00c76b',
    module: 'CS1231',
    title: 'Homework 1',
    uploadRequired: true
  },
  {
    completed: {},
    deadline: 1593403200000,
    description: '',
    gid: '72b6b3bb-cb74-4d08-ae67-dfc1b51baaf9',
    id: '0b80e917-78a4-4f87-a379-cdc1733923d6',
    module: 'CS1231',
    title: 'Watch lectures'
  },
  {
    completed: { testuid: false },
    deadline: 1593489600000,
    description: 'Finish readings',
    downloadURLs: {},
    gid: '72b6b3bb-cb74-4d08-ae67-dfc1b51baaf9',
    id: 'c1511c73-07b9-44cd-a4bd-01758515acb5',
    module: 'CS1231',
    title: 'Tutorial',
    uploadRequired: true
  }
];

export default tasks;
