import uuid from 'uuid';

const users = [];
users['aleh'] = {
    id: '911d7404-f927-46b8-bde9-759be745061d',
    username: 'aleh',
    password: 'aleh',
    createdAt: new Date() 
};
users['admin'] = {
    id: '911d7404-f927-46b8-bde9-759be745061b',
    username: 'admin',
    password: 'admin',
    createdAt: new Date() 
};

const getUsers = async () => {  
    return Object.values(users)
};

const createUser = async (user) => {
    let newUser = {
      id: uuid.v4(),
      username: user.username,
      password: user.password,
      createdAt: new Date()
    };

    users[newUser.username] = newUser;

    return newUser
};

const deleteUser = async (username) => {
    if (!users[username]) {
        return false;
    }

    delete users[username];

    return true;
};

const initializeDatabase = async () => {
    // Nothing to do here
}

export default {
    getUsers,
    createUser,
    deleteUser,
    initializeDatabase,
};