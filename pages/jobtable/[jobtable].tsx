import { CircularProgress, makeStyles } from '@material-ui/core';
import axios from 'axios';
import React, {useEffect, useState} from 'react'
import { Button, ButtonGroup, FormControl, InputGroup, Row } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import Navbar from '../component/NavbarComponent'
import { BiSkipPrevious, BiSkipNext, BiCaretLeft, BiCaretRight} from 'react-icons/bi'
import { useRouter } from 'next/router'

const api = axios.create({baseURL: 'http://54.87.15.189:5000/'})


const table = () => {
    const [table,
        setTable] = useState([])
    const [pending, setPending] = useState(false)
    const [latest, setLatest] = useState("")
    const [searchCount, setSearchCount] = useState(-1)
    const router = useRouter()
    const web = router.query.jobtable || router.asPath.match(new RegExp(`[&?]${"jobtable"}=(.*)(&|$)`))
    const page = Number(router.query.page) || router.asPath.match(new RegExp(`[&?]${"page"}=(.*)(&|$)`))
    const searchWord = router.query["search-word"] || router.asPath.match(new RegExp(`[&?]${"search-word"}=(.*)(&|$)`))

    useEffect(() => {
        setPending(true)
        var count = 0
        const getPage = async()=>{
            if(searchWord == null){
                await api
                    .post(`/filterweb/page=${page}`,{web: web})
                    .then(res => {
                    setTable(res.data.data)
                    })
            }
            else{
                await api
                    .post(`/filterwords/page=${page}`,{words: searchWord})
                    .then(res => {
                    setTable(res.data.data)
                    })
            }
        }
        const getCount = async() => {
            if(searchWord == null){
                await api.post(`/filterwords/count/${web}`,{words: searchWord})
                .then(res => {
                    for (var i = 0; i<res.data.data.length; i++){
                        count += Number(res.data.data[i]["COUNT(*)"])
                    }
                    setSearchCount(count)
                    setPending(false)
                })
            }
            else {
                await api.post(`/filterwords/count`,{words: searchWord})
                .then(res => {
                    for (var i = 0; i<res.data.data.length; i++){
                        count += Number(res.data.data[i]["COUNT(*)"])
                    }
                    setSearchCount(count)
                    setPending(false)
                })
            }
        }
        const getLatestRecord = async() => {
            await api
                    .get("/latest")
                    .then(res => {
                        setLatest(res.data.data)
                        setPending(false)
                    })    
        }
        if(web !== "")getPage()
        getCount()
        getLatestRecord()
         
    }, [page, web, searchWord])

   
    //DataTable
    const LinkofJob = row => <a href={row.Link}>{row.Title}</a>
    const HandleEmployerWords = row => <p>{row.Employer}</p>
    const HandleWorkTypeWords = row => <p>{row.WorkType}</p>
    const HandleLocationWords = row => <p>{row.Location}</p>
    const HandleDateWords = row => <p>{row.PostedDate}</p>
    const customStyles = {
        rows: {
            style: {
                minHeight: '42px', // override the row height
            }
        },
        headCells: {
            style: {
                paddingLeft: '8px', // override the cell padding for head cells
                paddingRight: '8px'
            }
        },
        cells: {
            style: {
                paddingLeft: '8px', // override the cell padding for data cells
                paddingRight: '8px'
            }
        }
    };
    const columns = [
        {
            name: 'Title',
            selector: 'Title',
            sortable: true,
            cell: row => <LinkofJob {...row}/>
        }, {
            name: 'Category',
            selector: 'Category',
            sortable: true
        }, {
            name: 'Employer',
            selector: 'Employer',
            sortable: true,
            cell: row => <HandleEmployerWords {...row}/>
        }, {
            name: 'Location',
            selector: 'Location',
            sortable: true,
            cell: row => <HandleLocationWords {...row}/>
        }, {
            name: 'Salary',
            selector: 'Salary',
            sortable: true
        }, {
            name: 'WorkType',
            selector: 'WorkType',
            sortable: true,
            cell: row => <HandleWorkTypeWords {...row}/>
        }, {
            name: 'PostedDate',
            selector: 'PostedDate',
            sortable: true,
            cell: row => <HandleDateWords {...row}/>
        }, {
            name: 'Experience',
            selector: 'Experience',
            sortable: true
        }
    ];

    const useStyles = makeStyles(theme => ({
        root: {
            marginLeft: '50%',
          width: '100%',
          '& > * + *': {
            marginTop: theme.spacing(2),
          },
        },
      }));
      
      const LinearIndeterminate = () => {
        const classes = useStyles();
      
        return (
          <div className={classes.root}>
            <CircularProgress />
          </div>
        );
      };
    return (
        <div>
            <Navbar />
            <DataTable
                responsive
                highlightOnHover
                columns={columns}
                data={table}
                subHeader
                subHeaderComponent={
                <Row>
                {searchCount!=-1 && !pending ? <p>Showing {Number(page)+20*(Number(page)-1)}-{page!=Math.ceil(searchCount/20) ? Number(page)*20 : searchCount} of {searchCount}-- </p> : null}
                <p>LatestUpdate: {latest || ""}</p>
            </Row>
            }
                customStyles={customStyles}
                progressPending={pending}
                progressComponent={<LinearIndeterminate />}
                />
            {
                pending ||
                <Row xs={3}>
                     <ButtonGroup className="mr-2 mx-auto" aria-label="First group">
                        <Button variant="secondary" disabled={page == 1} href={`/jobtable/${web}?page=${1}&per-page=20`}><BiSkipPrevious/></Button>
                        <Button variant="secondary" disabled={page == 1} href={`/jobtable/${web}?page=${Number(page)-1}&per-page=20`}><BiCaretLeft/></Button>
                        <Button variant="secondary">{page}</Button>
                        <Button variant="secondary" disabled={page == Math.ceil(searchCount/20)} href={`/jobtable/${web}?page=${Number(page)+1}&per-page=20`}><BiCaretRight/></Button>
                        <Button variant="secondary" disabled={page == Math.ceil(searchCount/20)} href={`/jobtable/${web}?page=${Math.ceil(searchCount/20)}&per-page=20`}> <BiSkipNext/></Button>
                    </ButtonGroup>
                </Row>
            }
            
        </div>
    )
}

export default table
