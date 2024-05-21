const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/budget', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// User model
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const User = mongoose.model('User', UserSchema);

// Transaction model
const TransactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, default: Date.now },
});
const Transaction = mongoose.model('Transaction', TransactionSchema);

// User routes
app.post('/api/users/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
});

app.post('/api/users/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, 'secretkey');
    res.json({ token });
});

// Transaction routes
app.post('/api/transactions', async (req, res) => {
    const { userId, type, amount, category } = req.body;
    const newTransaction = new Transaction({ userId, type, amount, category });
    await newTransaction.save();
    res.status(201).json(newTransaction);
});

app.get('/api/transactions', async (req, res) => {
    const transactions = await Transaction.find();
    res.json(transactions);
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Inline React App
const fs = require('fs');
const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Personal Budget Tracker</title>
    <script src="https://unpkg.com/react/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <script src="https://unpkg.com/react-router-dom/umd/react-router-dom.min.js"></script>
</head>
<body>
    <div id="root"></div>
    <script>
        const { useState, useEffect } = React;
        const { BrowserRouter, Route, Link, Switch } = ReactRouterDOM;

        function NavBar() {
            return (
                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                    <Link to="/dashboard">Dashboard</Link>
                </nav>
            );
        }

        function Register() {
            const [username, setUsername] = useState('');
            const [password, setPassword] = useState('');

            const handleSubmit = async (e) => {
                e.preventDefault();
                await axios.post('/api/users/register', { username, password });
            };

            return (
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
                    <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                    <button type="submit">Register</button>
                </form>
            );
        }

        function Login() {
            const [username, setUsername] = useState('');
            const [password, setPassword] = useState('');

            const handleSubmit = async (e) => {
                e.preventDefault();
                const { data } = await axios.post('/api/users/login', { username, password });
                localStorage.setItem('token', data.token);
            };

            return (
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
                    <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                    <button type="submit">Login</button>
                </form>
            );
        }

        function Dashboard() {
            const [transactions, setTransactions] = useState([]);

            useEffect(() => {
                const fetchTransactions = async () => {
                    const { data } = await axios.get('/api/transactions');
                    setTransactions(data);
                };
                fetchTransactions();
            }, []);

            return (
                <div>
                    <h1>Dashboard</h1>
                    {transactions.map(transaction => (
                        <div key={transaction._id}>
                            <span>{transaction.category}: </span>
                            <span>{transaction.amount} </span>
                            <span>{transaction.type} </span>
                            <span>{new Date(transaction.date).toLocaleDateString()} </span>
                        </div>
                    ))}
                </div>
            );
        }

        function App() {
            return (
                <BrowserRouter>
                    <NavBar />
                    <Switch>
                        <Route path="/register" component={Register} />
                        <Route path="/login" component={Login} />
                        <Route path="/dashboard" component={Dashboard} />
                    </Switch>
                </BrowserRouter>
            );
        }

        ReactDOM.render(<App />, document.getElementById('root'));
    </script>
</body>
</html>
`;
fs.writeFileSync(path.join(__dirname, 'public', 'index.html'), html);
