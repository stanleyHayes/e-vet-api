const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');


dotenv.config();
//routes
const userRoutes = require("./routes/users.js");
const authRoutes = require("./routes/authentication.js");

//declarations
const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;

const app = express();

//connect to mongodb
mongoose.connect(
    process.env.MONGODB_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(value => {
    console.log(`Connected to MongoDB using database ${value.connection.db.databaseName}`);
}).catch(error => {
    console.log(`Error: ${error.message}`);
});
app.use(helmet());
app.use(cors());
app.use(express.json());
if(NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Connected to server in ${NODE_ENV} mode on port ${PORT}`);
});