const dis = 3;
const length = 2;

export default [
  {
    name: "Level 1",
    obstacles: [
      // top, left
      { id: 1, x: dis, y: dis },
      
      { id: 2, x: dis + 1, y: dis },
      { id: 3, x: dis + 2, y: dis },

      { id: 4, x: dis, y: dis + 1 },
      { id: 5, x: dis, y: dis + 2 },

      // bottom, left
      { id: 1, x: dis, y: -dis },
      
      { id: 2, x: dis + 1, y: -dis },
      { id: 3, x: dis + 2, y: -dis },

      { id: 4, x: dis, y: -dis - 1 },
      { id: 5, x: dis, y: -dis - 2 },
      
      // top, right
      { id: 1, x: -dis, y: dis },
      
      { id: 2, x: -dis - 1, y: dis },
      { id: 3, x: -dis - 2, y: dis },

      { id: 4, x: -dis, y: dis + 1 },
      { id: 5, x: -dis, y: dis + 2 },
      
      // bottom, right
      { id: 1, x: -dis, y: -dis },
      
      { id: 2, x: -dis - 1, y: -dis },
      { id: 3, x: -dis - 2, y: -dis },

      { id: 4, x: -dis, y: -dis - 1 },
      { id: 5, x: -dis, y: -dis - 2 },

      
      // // top, left
      // { x: dis, y: dis, width: 1, height: dis },
      // { x: dis + 1, y: dis, width: dis -1, height: 1 },

      // // bottom, left
      // { x: dis, y: 2 * -dis + 1, width: 1, height: dis },
      // { x: dis + 1, y: -dis, width: dis -1, height: 1 },

      // // top, right
      // { x: -dis, y: dis, width: 1, height: dis },
      // { x: 2 * -dis + 1, y: dis, width: dis -1, height: 1 },
      
      // // bottom, right
      // { x: -dis, y: 2 * -dis + 1, width: 1, height: dis },
      // //{ x: dis + 1, y: dis, width: dis -1, height: 1 },
    ]
  }
];