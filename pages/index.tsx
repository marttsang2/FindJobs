import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button } from 'react-bootstrap'

const table = () => {
    const router = useRouter()
    useEffect(() => {
        const {pathname} = router
        if(pathname == '/' ){
            router.push("/jobtable/all?page=1&per-page=20")
        }
      });
    return (
        <div>
            <Button href="/jobtable/all?page=1&per-page=20">
                Go Table
            </Button>
        </div>
    )
}

export default table
