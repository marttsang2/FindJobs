const fs = require("fs")
const express = require("express")
const app = express()
const sqlite3 = require('sqlite3').verbose()
const cors = require("cors")
const { json } = require("body-parser")
const https = require("https")

const corsOptions ={
    origin:'http://localhost:3000', 
    Credential:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
}

var httpsServer = https.createServer(options, app).listen(5000);

let db = new sqlite3.Database('../Crawling/findjobs/findjobs.db')

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


app.get('/', (req, res)=>{
    db.all('SELECT * FROM jobsdb'
    +' '
    +' LIMIT 20 OFFSET 0',(err,data)=>{
        if(err) return console.log(err.message)
        res.json({
            "message":"success",
            "data": data
        })
    })
})

app.get('/latest', (req, res)=>{
    db.all('SELECT updatetime FROM latest_update ORDER BY id DESC LIMIT 1',(err,data)=>{
        if(err) return console.log(err.message)
        res.json({
            "message":"success",
            "data": Object.values(data[0])[0]
        })
    })
})

app.get('/all', (req, res)=>{
    db.all(`SELECT * FROM ctgoodjobs  UNION SELECT * FROM jobsdb UNION SELECT * FROM parttimehk ORDER BY PostedDate DESC`,(err,data)=>{
        if(err) return console.log(err.message)
        res.json({
            "message":"success",
            "data": data
        })
    })
})

app.get('/page=:pageId', (req, res)=>{
    db.all(`SELECT * FROM ctgoodjobs UNION SELECT * FROM jobsdb UNION SELECT * FROM parttimehk
     ORDER BY Link
     LIMIT 20 OFFSET ${20*(req.params.pageId - 1)}`,(err,data)=>{
        if(err) return console.log(err.message)
        res.json({
            "message":"success",
            "data": data
        })
    })
})

app.post('/filterwords/count', (req, res)=>{
    var array = []
    for (var i=0; i<23; i++)array.push("%"+req.body.words+"%")
    var filter = db.prepare(`
    
      SELECT COUNT(*) FROM jobsdb WHERE Employer LIKE (?) OR
     Title LIKE (?) OR Category LIKE (?) OR PostedDate LIKE (?) OR Experience LIKE (?)
     OR Salary LIKE (?) OR Location LIKE (?) OR WorkType LIKE (?) UNION

     SELECT COUNT(*) FROM parttimehk WHERE Employer LIKE (?) OR
     Title LIKE (?) OR Category LIKE (?) OR PostedDate LIKE (?) OR Experience LIKE (?)
     OR Salary LIKE (?) OR Location LIKE (?) OR WorkType LIKE (?) UNION

     SELECT COUNT(*) FROM ctgoodjobs WHERE Employer LIKE (?) OR
     Title LIKE (?) OR Category LIKE (?) OR PostedDate LIKE (?) OR Experience LIKE (?)
     OR Salary LIKE (?) OR Location LIKE (?) OR WorkType LIKE (?) 
     
     `)
    filter.all(array,(err,data)=>{
        if(err){
            return console.log(err.message)
        }
        res.json({"data": data})
    })
})

app.post('/filterwords/count/:table', (req, res)=>{
    if(req.params.table === "ALL"){
        db.all(`SELECT COUNT(*) FROM ctgoodjobs UNION SELECT COUNT(*) FROM jobsdb 
        UNION SELECT COUNT(*) FROM parttimehk`,(err,data)=>{
            if(err) return console.log(err.message)
            res.json({"data": data})
        })
    }
    else{
        db.all(`SELECT COUNT(*) FROM ${req.params.table} `,(err,data)=>{
            if(err) return console.log(err.message)
            res.json({"data": data})
        })
    }
})

app.post('/filterwords/page=:pageId', (req, res)=>{
    var array = []
    for (var i=0; i<23; i++)array.push("%"+req.body.words+"%")
    var filter = db.prepare(`
    
    SELECT * FROM jobsdb WHERE Employer LIKE (?) OR
     Title LIKE (?) OR Category LIKE (?) OR PostedDate LIKE (?) OR Experience LIKE (?)
     OR Salary LIKE (?) OR Location LIKE (?) OR WorkType LIKE (?) UNION

     SELECT * FROM parttimehk WHERE Employer LIKE (?) OR
     Title LIKE (?) OR Category LIKE (?) OR PostedDate LIKE (?) OR Experience LIKE (?)
     OR Salary LIKE (?) OR Location LIKE (?) OR WorkType LIKE (?) UNION

     SELECT * FROM ctgoodjobs WHERE Employer LIKE (?) OR
     Title LIKE (?) OR Category LIKE (?) OR PostedDate LIKE (?) OR Experience LIKE (?)
     OR Salary LIKE (?) OR Location LIKE (?) OR WorkType LIKE (?) 
     
       ORDER BY PostedDate DESC 
     
     LIMIT 20 OFFSET ${20*(req.params.pageId - 1)}`)

    filter.all(array,(err,data)=>{
        if(err){
            return console.log(err.message)
        }
        res.json({"data": data})
    })
})


app.post('/filterweb/page=:pageId', (req, res)=>{
    if(req.body.web === "ALL"){
        db.all(`SELECT * FROM ctgoodjobs  UNION SELECT * FROM jobsdb UNION SELECT * FROM parttimehk ORDER BY PostedDate DESC LIMIT 20 OFFSET ${20*(req.params.pageId - 1)} 
        
        `,(err,data)=>{
            if(err) return console.log(err.message)
            res.json({"data": data})
        })
    }
    else{
        db.all(`SELECT * FROM ${req.body.web} 
        ORDER BY PostedDate DESC 
        LIMIT 20 OFFSET ${20*(req.params.pageId - 1)}`,(err,data)=>{
            if(err) return console.log(err.message)
            res.json({"data": data})
        })
    }
})

app.get('/api/chart/worktype', (req, res)=>{
    worktype = {Fulltime: "Full Time", PartTime: "Part Time",
                Contract: "Contract", Freelance: "Freelance", Internship:"Internship"}

    workTypelist = []

    var count = db.prepare(`SELECT WorkType FROM jobsdb GROUP BY WorkType`)
    count.all((err,data)=>{
        if(err) return console.log(err.message)
        res.json(data)
    })
})

app.get('/api/chart/datetime/day/:table/:month/:year', (req, res)=>{
    var year = req.params.year
    lastday = String(new Date(year, req.params.month+1, 0)).substring(8,10)
    numMonth = ("0" + req.params.month).slice(-2)
    var count = db.prepare(`
    SELECT substr(PostedDate,19,2) AS day,substr(PostedDate,16,2) AS month, PostedDate, COUNT(*) AS count FROM ${req.params.table} GROUP BY PostedDate ORDER BY PostedDate
    `)
    count.all((err,data)=>{
        if(err) return console.log(err.message)
        var daylist = []
        for (var i in data){
            currmonth = data[i]["month"]
            console.log(numMonth)
            if(currmonth == numMonth){
                daylist.push(data[i])
            }
            if(i == data.length-1) res.send(daylist)
        }
    })
})



app.get('/api/datetime', (req, res)=>{
    var name = db.prepare(`
    SELECT Link FROM jobsdb 
    UNION SELECT Link FROM ctgoodjobs 
    UNION SELECT Link FROM parttimehk 
    
    `)
    name.all((err,data)=>{
        if(err){
            return console.log(err.message)
        }
        return res.json(data)
    })
    
})

app.get('/api/chart', (req, res)=>{
    var rowcount = []
    var name = db.prepare(`SELECT name FROM sqlite_master WHERE type="table"`)
    name.all((err,data)=>{
        if(err){
            return console.log(err.message)
        }
        for (var i in data){
            db.all(`SELECT COUNT(*) AS ${data[i].name} FROM ${data[i].name};`, (err,data)=>{
                if(err) return console.log(err.message)
                if(Object.keys(data[Object.keys(data)])[0] != "sqlite_sequence" && Object.keys(data[Object.keys(data)])[0] != "latest_update"){
                    rowcount.push(data[Object.keys(data)])
                }
                
                if(rowcount.length === 3) 
                    return res.send(rowcount)
            })
            
        }
    })
    
})

app.listen(5000, ()=>{
    console.log('mysqlite listening on port 5000')
})
app.get('/api/chart/:table/category', (req, res)=>{
    category = [
        ["Accounting", "Accounting / Auditing", "會計, 核數"],
        ["Admin & HR", "Administration", "行政, 文職, 秘書"],
        ["Media & Advertising", "Media & Advertising", "廣告, 媒體, 娛樂"],
        ["Banking / Finance", "Banking / Finance", "銀行, 金融"],
        ["Insurance", "Insurance", "保險"],
        ["Information Technology (IT)", "Information Technology", "資訊科技, 電訊"],
        ["Sciences, Lab, R&D", "Sciences, Lab, R&D", "科學, 化學"],
        ["Education", "Education", "教育"],
        ["Engineering", "Engineering", "工程"],
        ["Marketing / Public Relations", "Marketing / Public Relations", "銷售, 市場營銷"],
        ["Design", "Design", "藝術 / 時裝 / 設計"],
        ["Property / Real Estate", "Property", "保安服務"],
    ]
    inputIndex = 0
    switch(req.params.table){
        case "jobsdb":
            inputIndex = 0
            break
        case "ctgoodjobs":
            inputIndex = 1
            break
        case "parttimehk":
            inputIndex = 2
            break
        default:
            inputIndex = 0
            break
    }
    
    categoryElement = []
    Allcategory = []
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    
    for (type in category){
        console.log(type)
        if(req.params.table == "ALL"){
           inputsql = `
                SELECT COUNT(*) AS count, Link FROM jobsdb WHERE Category LIKE "${category[type][0]}"
                 UNION SELECT COUNT(*) AS count, Link FROM ctgoodjobs WHERE Category LIKE "${category[type][1]}"
                 UNION SELECT COUNT(*) AS count, Link FROM parttimehk WHERE Category LIKE "${category[type][2]}"
                `
        }
        else{
            
            inputsql =`
            SELECT COUNT(*) AS count, Link FROM ${req.params.table} WHERE Category LIKE "${category[type][inputIndex]}" ORDER BY Category
            `
        }
        var count = db.prepare(inputsql)
    count.all((err,data)=>{
        if(err) return console.log(err.message)
            categoryElement.push(data[0]["count"])
                Allcategory.push(categoryElement.reduce(reducer)) 
                categoryElement = []
                if(Allcategory.length == category.length) res.send(Allcategory)

    })
    }
})