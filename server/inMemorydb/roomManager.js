const rooms = new Map();

export const roomManager = {
  // Check if room exists
  exists: (roomId) => rooms.has(roomId),

  // Get room object
  getRoom: (roomId) => rooms.get(roomId),

  // Create room and add user
  addUser: (roomId, userName) => {
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        users: [],
        code: "// Start coding...",
        language: "javascript",
        input: "",
        output: "",
      });
    }
    const room = rooms.get(roomId);
    if (!room.users.includes(userName)) {
      room.users.push(userName);
    }
    return room;
  },

  // Remove user from room
  removeUser: (roomId, userName) => {
    if (!rooms.has(roomId)) return false;

    const room = rooms.get(roomId);
    room.users = room.users.filter((u) => u !== userName);

    if (room.users.length === 0) {
      rooms.delete(roomId);
      return true; // Room deleted
    }
    return false; // User removed but room still exists
  },

  // Get users in room
  getUsers: (roomId) => rooms.get(roomId)?.users || [],

  // Set code for a room
  setCode: (roomId, code) => {
    const room = rooms.get(roomId);
    if (room) room.code = code;
    return !!room;
  },

  // Get latest code for a room
  getCode: (roomId) => rooms.get(roomId)?.code || "",

  // Set language for a room
  setLanguage: (roomId, language) => {
    const room = rooms.get(roomId);
    if (room) room.language = language;
    return !!room;
  },

  // Set input
  setInput: (roomId, input) => {
    const room = rooms.get(roomId);
    if (room) room.input = input;
    return !!room;
  },

  // Set output
  setOutput: (roomId, output) => {
    const room = rooms.get(roomId);
    if (room) room.output = output;
    return !!room;
  },

  // Get output
  getOutput: (roomId) => rooms.get(roomId)?.output || "",

  // Clean up empty rooms
  cleanupEmptyRooms: () => {
    for (const [roomId, room] of rooms.entries()) {
      if (room.users.length === 0) {
        rooms.delete(roomId);
      }
    }
  },

  // Get room count
  roomCount: () => rooms.size,
};
