import { Bar, Doughnut } from 'react-chartjs-2'
import axios from 'axios'
import { useEffect, useState } from 'react'
import NavbarComponent from './component/NavbarComponent'
import DoughnutComponent from './component/DoughnutComponent'
import BarsComponent from './component/BarsComponent'
import LineComponent from './component/LineComponent'
import { Button, Card, Col, Container, Nav, Row, Spinner } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

const api = axios.create({
  baseURL: 'http://54.226.165.254:5000/'
})

export default function Home() {
  var [label, setLabel] = useState([])
  var [labeldata, setLabeldata] = useState([])
  var [month, setMonth] = useState("3")
  var [chartType, setchartType] = useState("doughnut")
  var [database, setDatabase] = useState("all")
  var [datatype, setDatatype] = useState("countOfDB")
  var [loading, setLoading] = useState(true)

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
      setLoading(false)
    })
  }
  

  useEffect(() => {
    var dataget = []
    var labelget = []
    setLoading(true)
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
          setLoading(false)
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
          setLoading(false)
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
          setLoading(false)
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
          setLoading(false)
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
          setLoading(false)
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
              <h5>Graph Type</h5>
                <div>
                  <Button className="mr-3 mb-3" onClick={()=>{setchartType("doughnut")}} variant={ chartType == "doughnut"? "danger": "outline-danger"}>Doughnut</Button>
                  <Button className="mr-3 mb-3" onClick={()=>{setchartType("bars")}} variant={ chartType == "bars"? "primary": "outline-primary"}>Bars</Button>
                  <Button className="mr-3 mb-3" onClick={()=>{setchartType("line")}} variant={ chartType == "line"? "success": "outline-success"}>Line</Button>
                </div>
              <h5>Find Job Website</h5>
                <div>
                  <Button className="mr-3 mb-3" onClick={()=>{setDatabase("all")}} variant={ database == "all"? "secondary": "outline-secondary"}>ALL</Button>
                  <Button className="mr-3 mb-3" onClick={()=>{setDatabase("jobsdb")}} variant={ database == "jobsdb"? "primary": "outline-primary"}>jobsdb</Button>
                  <Button className="mr-3 mb-3" onClick={()=>{setDatabase("ctgoodjobs")}} variant={ database == "ctgoodjobs"? "warning": "outline-warning"}>ctgoodjobs</Button>
                  <Button className="mr-3 mb-3" onClick={()=>{setDatabase("parttimehk")}} variant={ database == "parttimehk"? "info": "outline-info"}>parttime</Button>
                </div>
              <h5>DataType</h5>
                <div>
                  <Button className="mr-3 mb-3" onClick={()=>{setDatatype("countOfDB")}} variant={ datatype == "countOfDB"? "primary": "outline-primary"}>count of Database</Button>
                  <Button className="mr-3 mb-3" onClick={()=>{setDatatype("datetimeDay")}} variant={ datatype == "datetimeDay"? "secondary": "outline-secondary"}>Count of Job Post per day</Button>
                  <Button className="mr-3 mb-3" onClick={()=>{setDatatype("worktype")}} variant={ datatype == "worktype"? "success": "outline-success"}>workType</Button>
                  <Button className="mr-3 mb-3" onClick={()=>{setDatatype("category")}} variant={ datatype == "category"? "danger": "outline-danger"}>category</Button>
                  <Button className="mr-3 mb-3" onClick={()=>{setDatatype("location")}} variant={ datatype == "location"? "info": "outline-info"}>location</Button>
                </div>
                </div>
            </Card>
          </Col>
          <Col md={8}>
            <Card className="mx-auto">
              {loading ? 
                <Spinner className="mx-auto my-5" animation="border" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
                :
                <div className="m-3">
                      {{
                  'doughnut':<DoughnutComponent labeldata={labeldata} label={label}/>,
                  
                  'bars':<BarsComponent labeldata={labeldata} label={label}/>,
                
                  'line':<LineComponent labeldata={labeldata} label={label}/>,
                }[chartType]}
                </div>
                }
              
            </Card>
          </Col>
        </Row>
      </Container>

    </div>
  )
}
