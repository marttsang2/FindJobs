import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button } from 'react-bootstrap'

const table = () => {
    const router = useRouter()
    return (
        <div>
            <Button href="/jobtable/ALL?page=1&per-page=20">
                Go Table
            </Button>
        </div>
    )
}

export default table

