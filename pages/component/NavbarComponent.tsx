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

const NavbarComponent = () => {
    const [inputWord,
        setInputWord] = useState("")

    return ( <> <Navbar bg="dark" variant="dark">
        <Navbar.Brand href={`/jobtable/ALL?page=1&per-page=20`}>FindJobs</Navbar.Brand>
        <Nav className="mr-auto">
            <Nav.Link eventKey="jobsdb" href={`/jobtable/jobsdb?page=1&per-page=20`}>Jobsdb</Nav.Link>
            <Nav.Link
                eventKey="parttimehk"
                href={`/jobtable/parttimehk?page=1&per-page=20`}>ParttimeHk</Nav.Link>
            <Nav.Link
                eventKey="ctgoodjobs"
                href={`/jobtable/ctgoodjobs?page=1&per-page=20`}>Ctgoodjobs</Nav.Link>
        </Nav>
        <Form inline>
            
                <FormControl
                    type="text"
                    placeholder="Search for jobs"
                    aria-describedby="basic-addon1"
                    onChange={(e) => {
                    setInputWord(e.target.value)
                }}
                    onKeyPress={() => console.log("press")}
                    className="mr-sm-2">
                    </FormControl>
           

            <InputGroup.Append>
                <Button
                    href={`/jobtable/ALL?page=1&per-page=20${inputWord != ""
                    ? "&search-word=" + inputWord
                    : ""}`}>Search</Button>
            </InputGroup.Append>
        </Form>
    </Navbar> </>
    )
}

export default NavbarComponent