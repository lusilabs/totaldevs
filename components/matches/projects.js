import { useState } from 'react'
import { useDocuments } from '@/utils/hooks'
import { storage, db } from '@/utils/config'
import { where } from 'firebase/firestore'
import { doc, setDoc, addDoc, collection, getDoc } from 'firebase/firestore'

const AssignmentCard = ({explorer, job, dev, status, onClick, selected}) => {
    return (<div onClick={onClick}>
        {selected && ">>>>"} {dev} {explorer} {job} {status}
    </div>)
}

const ConfirmAvailability = ({userDoc, selectedAssignment, refreshAssignments}) => {
    if (!selectedAssignment) {
        return null;
    }
    const updateAssignment = (status) => () => {
        const assignment = doc(db, "assignments", `${selectedAssignment.dev}:${selectedAssignment.job}`)
        setDoc(assignment, {
            status
        }, {merge: true})
        refreshAssignments()
    }
    return <div>
        <button type="button" 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
                onClick={updateAssignment("dev_interested")}>
                    Available, can schedule meeting with client
        </button>
        <button type="button" 
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" 
                onClick={updateAssignment("dev_unavailable")}>
                    Not available at the moment
        </button>
    </div>
}

export const ProjectsToCheck = ( {userDoc} ) => {
    const [assigments, , refreshAssignments] = useDocuments({docs: "assignments", queryConstraints: [where('dev', '==', userDoc.uid)]})
    const [selectedAssignment, setSelectedAssignment] = useState(null)

    return (<div>
        <div>
            <span>Projects</span>
            {
                assigments.map((assignment) => 
                    <AssignmentCard key={assignment.id} 
                        selected={selectedAssignment?.id === assignment.id} 
                        onClick={() => setSelectedAssignment(
                            selectedAssignment?.id !== assignment.id ? assignment : null)}
                        {...assignment}/>
                )
            }
        </div>
        {selectedAssignment &&
            <ConfirmAvailability {...{userDoc, selectedAssignment, refreshAssignments  }}/>
        }
    </div>)
}