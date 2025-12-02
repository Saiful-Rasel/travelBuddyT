import express, { type Application, type Request, type Response } from "express"
import { globalErrorHandler } from "./app/middleware/globalErrorHandler"
import notFound from "./app/middleware/notFound"





const app:Application = express()


app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/', (req:Request, res:Response) => {
  res.send(' Travel Buddy Started Successfully')
})
// app.use("api/v1",router)

app.use(globalErrorHandler)
app.use(notFound)



export default app;
