let users = [];

const registerUser = (req, res) => {
    try {
        const { username, password } = req.body;
        if(!username || !password) {
            return res.status(400).send('Username and password are required');
        }
        const userExists = users.find(user => user.username === username);
        if(userExists) {
            return res.status(400).send(`User with username ${username} already exists`);
        }
        users.push({ username, password });
        res.send('User registered');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

const loginUser = (req, res) => {
    try {
        const { username, password } = req.body;
        if(!username || !password) {
            return res.status(400).send('Username and password are required');
        }
        let user = null;
        for(let i = 0; i < users.length; i++) {
            if(users[i].username === username) {
                user = users[i];
                break;
            }
        }
        if(!user) {
            return res.status(400).send(`User with username ${username} does not exist`);
        }
        if(user.password !== password) {
            return res.status(401).send('Invalid credentials');
        } else {
            return res.status(200).send('Login successful');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
    res.send('User logged in');
}

module.exports = { registerUser, loginUser };
