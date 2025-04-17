const express  = require('express')
const sqlite3 = require('sqlite3').verbose()
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express();

const bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(cors())
app.use(bodyParser.json())

const db = new sqlite3.Database('./users.db',(err)=>{
    if(err){
        console.error(err.message)
    }
    console.log('Connected to the user database')
});

db.serialize(()=>{
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT
        )
    `);

    // db.run(`
    //     INSERT OR IGNORE INTO users (username, password, name)
    //     VALUES 
    //       ('heet', 'heet@123', 'Heet Dudhwala'),
    //       ('harsimran', 'simran@123', 'Harsimran Kaur'),
    //       ('himanshu', 'himan@123', 'Himanshu Chopade')
    //   `);
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    db.get(
        'SELECT * FROM users WHERE username = ?',
        [username],
        async (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!row) return res.status(401).json({ error: 'Invalid credentials' });
            
            const match = await bcrypt.compare(password, row.password);
            if (match) {
                res.json({ success: true, user: { id: row.id, name: row.name } });
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        }
    );
});

app.post('/register', async (req, res) => {
    try {
        const { username, password, name } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        db.run(
            'INSERT INTO users (username, password, name) VALUES (?, ?, ?)',
            [username, hashedPassword, name],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ success: false, error: 'Username already exists' });
                    }
                    return res.status(500).json({ success: false, error: err.message });
                }
                res.json({ 
                    success: true, 
                    userId: this.lastID,
                    message: 'User created successfully'
                });
            }
        );
    } catch (err) {
        return res.status(500).json({error : err.message})
    }
});



const port = 5000;
app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})