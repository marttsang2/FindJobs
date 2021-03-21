import React, {useState} from 'react'
import {
    Navbar,
    Nav,
    Form,
    FormControl,
    Button,
    InputGroup
} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link'
import router, {useRouter} from 'next/router';

const NavbarComponent = ({istable}) => {
    const [inputWord,
        setInputWord] = useState("")
    const router = useRouter()

    return ( <> 
    
    <Navbar bg="dark" variant="dark"  expand="sm" > 
        <Navbar.Brand href={`/jobtable/all?page=1&per-page=20`}>FindJobs</Navbar.Brand>
        {istable ?
        <>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
                <Nav.Link eventKey="jobsdb" href={`/jobtable/jobsdb?page=1&per-page=20`}>Jobsdb</Nav.Link>
            <Nav.Link
                eventKey="parttimehk"
                href={`/jobtable/parttimehk?page=1&per-page=20`}>ParttimeHk</Nav.Link>
            <Nav.Link
                eventKey="ctgoodjobs"
                href={`/jobtable/ctgoodjobs?page=1&per-page=20`}>Ctgoodjobs</Nav.Link>
            
    
            <Nav.Link
                eventKey="chart"
                href={`/chart`}>Chart</Nav.Link>

        </Nav>
        <InputGroup.Append>
            <FormControl
                type="text"
                placeholder="Search for jobs"
                aria-describedby="basic-addon1"
                onChange={(e) => {
                setInputWord(e.target.value)
            }}
                onKeyPress={(e) => e.key == "Enter"
                ? router.push(`/jobtable/ALL?page=1&per-page=20${inputWord != ""
                    ? "&search-word=" + inputWord
                    : ""}`)
                : null}
                className="mr-sm-2"></FormControl>
            <Button
                href={`/jobtable/ALL?page=1&per-page=20${inputWord != ""
                ? "&search-word=" + inputWord
                : ""}`}>Search</Button>
        </InputGroup.Append>

        </Navbar.Collapse>
        </>
        :null}
    </Navbar> </>
    )
}

export default NavbarComponent