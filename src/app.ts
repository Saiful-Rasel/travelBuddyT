import express, { type Application, type Request, type Response } from "express"

import notFound from "./app/middleware/notFound"
import router from "./app/routes"
import globalErrorHandler from "./app/middleware/globalErrorHandler"

import cookieParser from "cookie-parser";



const app:Application = express()


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.get('/', (req:Request, res:Response) => {
  res.send(' Travel Buddy Started Successfully')
})
app.use("/api",router)

app.use(globalErrorHandler)
app.use(notFound)



export default app;
