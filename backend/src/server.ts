import express from "express";
import bodyParser from "body-parser";
import test from "./routes/test.router";
import authRoutes from './routes/auth'
import endpointRoute from './routes/endpoint'
import submissionROutes from './routes/submissions'
import cors from 'cors'
import { protect } from "./middleware/protectMiddleware";

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors())
app.use("/api/",test);
app.use("/api/auth", authRoutes); // Use the auth routes
app.use('/api/endpoints' , endpointRoute )
app.use('/' , submissionROutes)



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
