import { Bar, Doughnut } from 'react-chartjs-2'
import axios from 'axios'
import { useEffect, useState } from 'react'
import NavbarComponent from './component/NavbarComponent'
import DoughnutComponent from './component/DoughnutComponent'
import BarsComponent from './component/BarsComponent'
import LineComponent from './component/LineComponent'
import { Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

const api = axios.create({
  baseURL: 'http://34.229.70.78:5000/'
})

export default function Home() {
  var [label, setLabel] = useState([])
  var [labeldata, setLabeldata] = useState([])
  var [month, setMonth] = useState("3")
  var [chartType, setchartType] = useState("doughnut")
  var [database, setDatabase] = useState("jobsdb")
  var [datatype, setDatatype] = useState("countofDB")

  useEffect(() => {
    var dataget = []
    var labelget = []
    switch(datatype){
      case "countOfDB":
        api.get("/api/chart").then(res=>{
          console.log(res.data)
          for (var i in res.data){
            dataget.push(Object.values(res.data[i])[0])
            labelget.push(Object.keys(res.data[i])[0])
          }
          setLabeldata(dataget)
          setLabel(labelget)
        })
        break
      case "datetimeDay":
        var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        api.get(`/api/chart/datetime/day/${database}/${month}/2021`).then(res=>{
          for (var i in res.data){
            var getmonth = months[Number(month)-1]
            console.log(getmonth)
            var getweekday = (new Date(getmonth + " " + res.data[i][0] + " " + "2021")).getDay()
            dataget.push(res.data[i][1])
            labelget.push("(" + days[getweekday] + ")" + res.data[i][0])
          }
          setLabeldata(dataget)
          setLabel(labelget)
        })
        break
      case "worktype":
        api.get(`/api/chart/${database}/worktype`).then(res=>{
          console.log(res.data)
          
          for (var i in res.data){
            if(database=="all"){
              labelget = ["Full time","Part time","Contract","Temporary","Freelance"]
              dataget.push(res.data[i])
            }
            else{
              dataget.push(res.data[i][1])
              labelget.push(res.data[i][0])
            }
          }
          setLabeldata(dataget)
          setLabel(labelget)
        })
        break
        case "category":
        api.get(`/api/chart/${database}/category`).then(res=>{
          console.log(res.data)
          
          for (var i in res.data){
            if(database=="all"){
              labelget = ["Accounting","Admin & HR","Media & Advertising"
              ,"Banking / Finance","Insurance","Information Technology"
              ,"Education","Engineering","Marketing / Public Relations","Design","Property"]
                dataget.push(res.data[i])
            }
            else{
              dataget.push(res.data[i][1])
              labelget.push(res.data[i][0])
            }
          }
          setLabeldata(dataget)
          setLabel(labelget)
        })
        break
        case "location":
        api.get(`/api/chart/${database}/location`).then(res=>{
          console.log(res.data)
          
          for (var i in res.data){
            if(database=="all"){
              labelget = ["Central & Western ","Cheung Chau ","Eastern ",
              "Kowloon City ","Kwai Tsing ","Kwun Tong ","Lantau Island",
              "Northern NT ","Sai Kung ","Sham Shui Po ","Shatin ",
              "Southern ","Tai Po ","Tsuen Wan ","Tuen Mun ",
              "Wan Chai ","Wong Tai Sin ","Yau Tsim Mong ","Yuen Long "]
              dataget.push(res.data[i])
            }else{
              dataget.push(res.data[i][1])
              labelget.push(res.data[i][0])
            }
            
          }
          setLabeldata(dataget)
          setLabel(labelget)
        })
        break
    }
  }, [datatype,database])

  return (
    <div>
      <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"/> 
      <Button onClick={()=>{setchartType("doughnut")}} variant="outline-primary">Doughnut</Button>
      <Button onClick={()=>{setchartType("bars")}} variant="outline-secondary">Bars</Button>
      <Button onClick={()=>{setchartType("line")}} variant="outline-success">Line</Button>

      <Button onClick={()=>{setDatabase("all")}} variant="outline-primary">ALL</Button>
      <Button onClick={()=>{setDatabase("jobsdb")}} variant="outline-primary">jobsdb</Button>
      <Button onClick={()=>{setDatabase("ctgoodjobs")}} variant="outline-secondary">ctgoodjobs</Button>
      <Button onClick={()=>{setDatabase("parttimehk")}} variant="outline-success">parttime</Button>
      
      <Button onClick={()=>{setDatatype("countOfDB")}} variant="outline-secondary">countOfDB</Button>
      <Button onClick={()=>{setDatatype("datetimeDay")}} variant="outline-success">datetimeDay</Button>
      <Button onClick={()=>{setDatatype("worktype")}} variant="outline-success">workType</Button>
      <Button onClick={()=>{setDatatype("category")}} variant="outline-success">category</Button>
      <Button onClick={()=>{setDatatype("location")}} variant="outline-success">location</Button>
      {{
        'doughnut':<DoughnutComponent labeldata={labeldata} label={label}/>,
        
        'bars':<BarsComponent labeldata={labeldata} label={label}/>,
      
        'line':<LineComponent labeldata={labeldata} label={label}/>,
      }[chartType]}
    </div>
  )
}
