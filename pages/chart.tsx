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
  baseURL: 'https://174.129.155.233:5000/'
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
            var getweekday = (new Date(getmonth + " " + res.data[i]["day"] + " " + "2021")).getDay()
            dataget.push(res.data[i]["count"])
            labelget.push("(" + days[getweekday] + ")" + res.data[i]["day"])
          }
          setLabeldata(dataget)
          setLabel(labelget)
        })
        break
    }
  }, [datatype,database])

  return (
    <div>
      <Button onClick={()=>{setchartType("doughnut")}} variant="outline-primary">Doughnut</Button>
      <Button onClick={()=>{setchartType("bars")}} variant="outline-secondary">Bars</Button>
      <Button onClick={()=>{setchartType("line")}} variant="outline-success">Line</Button>
      <Button onClick={()=>{setDatabase("jobsdb")}} variant="outline-primary">jobsdb</Button>
      <Button onClick={()=>{setDatabase("ctgoodjobs")}} variant="outline-secondary">ctgoodjobs</Button>
      <Button onClick={()=>{setDatabase("parttimehk")}} variant="outline-success">parttime</Button>
      <Button onClick={()=>{setDatatype("countOfDB")}} variant="outline-secondary">countOfDB</Button>
      <Button onClick={()=>{setDatatype("datetimeDay")}} variant="outline-success">datetimeDay</Button>
      {{
        'doughnut':<DoughnutComponent labeldata={labeldata} label={label}/>,
        
        'bars':<BarsComponent labeldata={labeldata} label={label}/>,
      
        'line':<LineComponent labeldata={labeldata} label={label}/>,
      }[chartType]}
    </div>
  )
}
