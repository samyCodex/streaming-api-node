import express, {Application, Request, Response} from 'express'
import fs from 'fs'

const app: Application = express()


app.get('/video', (req: Request, res: Response) => {
    const filePath = 'large.mp4'
    const stat = fs.statSync(filePath)
    const fileSize = stat.size
    const range = req.headers.range 
    if(range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10):  fileSize - 1 
        const chunkSize = end - start + 1;
        
        const file = fs.createReadStream(filePath, {start, end})

        res.writeHead(206, {
            'content-range' : `bytes ${start} - ${end}/${fileSize}`,
            'accept-ranges' : 'bytes',
            'content-length' : chunkSize,
            'content-type' : 'video/mp4'
        })
        file.pipe(res)
    }
    else {
        res.writeHead(200, {
             'content-type' : 'video/mp4',
             'content-length' : fileSize
        })
        fs.createReadStream(filePath).pipe(res) 
        
    }
})


const port = 4000
app.listen(port, () => console.log(`Streaming server running on http://localhost:${port}`))