const express = require('express')
const {connectMongoDb} = require('./connect')
const paymentRouter = require('./routes/payment')
const app = express();
const userRouter = require('./routes/user')
const productRouter = require('./routes/product')
const cors = require("cors")
const port = 5000;
//require("dotenv").config();
const cookieParser = require("cookie-parser");

//connection
connectMongoDb("mongodb://127.0.0.1:27017/jwtauth-project").then(()=>{
  console.log('mongodb connected');  
})

// ✅ Setup CORS
const allowedOrigins = process.env.FRONTEND_URL.split(",");
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(cookieParser())
app.use('/api/users',userRouter)
app.use('/api/products',productRouter)
app.use('/api/payment', paymentRouter);



app.listen(port, ()=>console.log(`Server runs at port ${port}`))