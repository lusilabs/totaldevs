import { useState } from 'react'
import { Button } from 'semantic-ui-react'
import { toast } from 'react-toastify'
import { doc, setDoc, where } from 'firebase/firestore'
import { Table } from '@/components/base/table'
import { Label, Select } from '@/components/forms'
import ProgressBar from '@/components/misc/progressbar'
import { useDocuments } from '@/utils/hooks'
import { db } from '@/utils/config'

import { getMessaging, getToken } from "firebase/messaging";
import { useEffect } from 'react/cjs/react.development'


const DetailedView = ({entity, detailProps}) => {
    return <div>
        {
            detailProps.map((propName) => <div>
                <Label htmlFor={propName} title={propName}/>
                    {entity[propName]}
                </div>)
        }
    </div>
}

const RecommendRole = ({userDoc, selectedDev, selectedJob}) => {
    if (!selectedDev || !selectedJob) {
        return null;
    }
    const createAssignment = () => {
        const assignment = doc(db, "assignments", `${selectedDev.id}:${selectedJob.id}`)
        setDoc(assignment, {
            dev: selectedDev.id,
            job: selectedJob.id,
            company: selectedJob.uid,
            explorer: userDoc.uid,
            status: 'requesting_dev_status',
        }, {merge: true})
        toast.success(`${selectedDev.displayName} has been notified.`)
    }
    return  <Button type="button" color='green' className='text-md'
        onClick={createAssignment}>
            Ping Developer for Role
        </Button>
}

export const JobsToMatch = ({userDoc}) => {
    const [jobs, ] = useDocuments({docs: "jobs"})
    const [devs, ] = useDocuments({docs: "users", queryConstraints: [where('role', '==', 'dev')]})
    const [companies, ] = useDocuments({docs: "users", queryConstraints: [where('role', '==', 'company')]})
    const [selectedJob, setSelectedJob] = useState(null)
    const [selectedDev, setSelectedDev] = useState(null)
    const [start, setStart] = useState("Dev")
    const [next, setNext] = useState("Position")

    const messaging = getMessaging();
    useEffect( () => {
        getToken(messaging, { vapidKey: 'BG_67u9DP6hm1El1fX73jbf3yTwK92Rp0dwnFyP6IM6WEcuUBIJp7WpLsH7gnn39gDy28Bf8Nps-U5ycerlsykU' }).then((currentToken) => {
            if (currentToken) {
                // Send the token to your server and update the UI if necessary
                // ...
                console.log(currentToken)
            } else {
                // Show permission request UI
                console.log('No registration token available. Request permission to generate one.');
                // ...
            }
            }).catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
            // ...
            });
    }, [])
    

    const companyNameMap = Object.fromEntries(companies.map((company) => [company.id, company.providerData[0].displayName]))
    const getterMapping = {
        company: (row) => companyNameMap[row.uid],
        stack: (row) => row.stack?.join(", "),
        compatibility: (row) => {
            const availableStack = start == 'Dev' ? selectedDev?.stack: row.stack;
            const targetStack = start == 'Dev' ? row.stack : selectedJob?.stack
            
            if (availableStack && targetStack){
                return (targetStack?.reduce((accumulated, tech) => accumulated + availableStack.indexOf(tech) !== -1, 0) 
                    / targetStack.length) * 100
            }
            else {
                return ''
            }
        }
    }
    const renderMapping = {
        compatibility: (value) => {
            return value !== '' && <ProgressBar percentage={value} />
        }
    }
    const tableMapping = {
        Dev: {
            tableProps: {
                columns: ["displayName", "email", "stack", "jobSearch",],
                data: devs,
                onSelect: setSelectedDev,
                type: "Dev"
            },
            entity: selectedDev,
            detailProps: ["displayName", "email", "stack", "jobSearch",]
        },
        Position: {
            tableProps: {
                columns: ["company", "position", "salary", "title", "stack",],
                data: jobs,
                onSelect: setSelectedJob,
                type: "Position"
            },
            entity: selectedJob,
            detailProps: ["description", "position", "salary", "title", "stack",],
        }
    }
    const startTable = tableMapping[start]
    const nextTable = tableMapping[next]
    return (<div className='px-4 py-5 bg-white sm:p-6'>
        <div>
            <Label htmlFor={"startWith"} title={"Start by Dev or Position?"}/>
            <Select value={start} options={["Dev", "Position"]} onChange={({target: {value}}) => {
                    setNext(start)
                    setStart(value)
                    setSelectedJob(null)
                    setSelectedDev(null)
                }} />
            {
                startTable.entity && <Button type="button" color='blue' className='text-md'
                    onClick={() => {
                        startTable.tableProps.onSelect(null)
                        nextTable.tableProps.onSelect(null)
                        }}
                    >
                        Want to select other {startTable.tableProps.type}?
                </Button>
            }
            { 
                selectedJob && selectedDev && <RecommendRole {...{userDoc, selectedJob, selectedDev}}/>
            }
        </div>
        {
            !startTable.entity && 
                <Table {...{...startTable.tableProps, getterMapping, renderMapping}} /> 
        }
        {
            startTable.entity && 
            <>
                <Table {...{...startTable.tableProps, getterMapping, renderMapping}} data={[startTable.entity]} onSelect={null} />
                {
                    <div className='grid grid-cols-6 gap-6'>
                        <div className={`col-span-6 sm:col-span-${nextTable.entity ? '3' : '6'}`}>
                            <Table {...{...nextTable.tableProps, getterMapping, renderMapping}} 
                            columns={["compatibility", ...nextTable.tableProps.columns]} orderBy={"-compatibility"}/>
                        </div>
                        {
                            nextTable.entity && <div className='col-span-6 sm:col-span-3 '>
                                <DetailedView {...{...nextTable}} />
                            </div>
                        }
                    </div>
                }
            </>
        }
    </div>)
}