import { Bar, Doughnut } from 'react-chartjs-2'
import axios from 'axios'
import { useEffect, useState } from 'react'
import NavbarComponent from './component/NavbarComponent'
import DoughnutComponent from './component/DoughnutComponent'
import BarsComponent from './component/BarsComponent'
import LineComponent from './component/LineComponent'
import { Button, Card, Col, Container, Nav, Row } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

const api = axios.create({
  baseURL: 'https://34.229.70.78:5000/'
})

export default function Home() {
  var [label, setLabel] = useState([])
  var [labeldata, setLabeldata] = useState([])
  var [month, setMonth] = useState("3")
  var [chartType, setchartType] = useState("doughnut")
  var [database, setDatabase] = useState("jobsdb")
  var [datatype, setDatatype] = useState("countofDB")

  if (label.length == 0 && labeldata.length == 0){
    var dataget = []
    var labelget = []
    api.get("/api/chart").then(res=>{
      console.log(res.data)
      for (var i in res.data){
        dataget.push(Object.values(res.data[i])[0])
        labelget.push(Object.keys(res.data[i])[0])
      }
      setchartType("doughnut")
      setLabeldata(dataget)
      setLabel(labelget)
    })
  }
  

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
          setchartType("doughnut")
          setLabeldata(dataget)
          setLabel(labelget)
        })
        break
      case "datetimeDay":
        var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        var months = ['January','February','March','April','May','June','July','August','Septemrer','October','Novemrer','Decemrer'];
        api.get(`/api/chart/datetime/day/${database}/${month}/2021`).then(res=>{
          for (var i in res.data){
            var getmonth = months[Number(month)-1]
            console.log(getmonth)
            var getweekday = (new Date(getmonth + " " + res.data[i][0] + " " + "2021")).getDay()
            dataget.push(res.data[i][1])
            labelget.push("(" + days[getweekday] + ")" + res.data[i][0])
          }
          setchartType("line")
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
          setchartType("bars")
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
          setchartType("bars")
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
          setchartType("bars")
          setLabeldata(dataget)
          setLabel(labelget)
        })
        break
    }
  }, [datatype,database])

  return (
    <div>
      <NavbarComponent istable={false}/>

      <Container className="mt-4">
        <Row >
          <Col md={4}>
            <Card  >
              <div className="m-3">
              <h4>Selected</h4>
              <div className="column mb-3">
                <Button className="mr-1 p-2 border border-secondary rounded" variant="outline-secondary">{chartType}</Button>
                <Button className="mr-1 p-2 border border-secondary rounded" variant="outline-secondary">{database}</Button>
                <Button className="mr-1 p-2 border border-secondary rounded" variant="outline-secondary">{datatype}</Button>
              </div>
              <h5>Graph Type</h5>
                <div>
                  <Button className="mr-3 mb-3" onClick={()=>{setchartType("doughnut")}} variant="outline-primary">Doughnut</Button>
                  <Button className="mr-3 mb-3" onClick={()=>{setchartType("bars")}} variant="outline-secondary">Bars</Button>
                  <Button className="mr-3 mb-3" onClick={()=>{setchartType("line")}} variant="outline-success">Line</Button>
                </div>
              <h5>Find Job Website</h5>
                <div>
                  <Button className="mr-3 mb-3" onClick={()=>{setDatabase("all")}} variant="outline-primary">ALL</Button>
                  <Button className="mr-3 mb-3" onClick={()=>{setDatabase("jobsdb")}} variant="outline-primary">jobsdb</Button>
                  <Button className="mr-3 mb-3" onClick={()=>{setDatabase("ctgoodjobs")}} variant="outline-secondary">ctgoodjobs</Button>
                  <Button className="mr-3 mb-3" onClick={()=>{setDatabase("parttimehk")}} variant="outline-success">parttime</Button>
                </div>
              <h5>Display Category</h5>
                <div>
                  <Button className="mr-3 mb-3" onClick={()=>{setDatatype("countOfDB")}} variant="outline-secondary">countOfDB</Button>
                  <Button className="mr-3 mb-3" onClick={()=>{setDatatype("datetimeDay")}} variant="outline-success">datetimeDay</Button>
                  <Button className="mr-3 mb-3" onClick={()=>{setDatatype("worktype")}} variant="outline-success">workType</Button>
                  <Button className="mr-3 mb-3" onClick={()=>{setDatatype("category")}} variant="outline-success">category</Button>
                  <Button className="mr-3 mb-3" onClick={()=>{setDatatype("location")}} variant="outline-success">location</Button>
                </div>
                </div>
            </Card>
          </Col>
          <Col md={8}>
            <Card className="mx-auto">
              <div className="m-3">
                      {{
                  'doughnut':<DoughnutComponent labeldata={labeldata} label={label}/>,
                  
                  'bars':<BarsComponent labeldata={labeldata} label={label}/>,
                
                  'line':<LineComponent labeldata={labeldata} label={label}/>,
                }[chartType]}
                </div>
            </Card>
          </Col>
        </Row>
      </Container>

    </div>
  )
}
