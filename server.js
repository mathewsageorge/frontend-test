// server.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');

// Connect to MongoDB Cloud
mongoose.connect('mongodb+srv://mathewsgeorge202:ansu@cluster0.ylyaonw.mongodb.net/myDatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Define mongoose schema and model for attendance data
const attendanceSchema = new mongoose.Schema({
    serialNumber: String,
    logData: String,
    time: Date
}, { collection: 'records' }); // Specify the collection name with dot notation

const Attendance = mongoose.model('Attendance', attendanceSchema);

const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

const users = {
    teacher1: { username: 'teacher1', password: 'password1', students: [{ name: 'Student 1', attendance: 'Present' }, { name: 'Student 2', attendance: 'Absent' }] }
};

app.get('/', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users[username];
    if (user && user.password === password) {
        try {
            // Fetch attendance data from MongoDB and pass it to dashboard template
            const attendanceData = await Attendance.find({});
            console.log('Attendance Data:', attendanceData); // Log attendance data
            res.render('dashboard', { username: user.username, students: user.students, attendanceData: attendanceData });
        } catch (err) {
            console.error('Error retrieving attendance data:', err);
            res.render('error', { message: 'Error retrieving attendance data' });
        }
    } else {
        res.render('error', { message: 'Invalid username or password' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
