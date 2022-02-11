import { Label } from '@/components/forms/label'

const Assignments = ({assignments}) => {
    if (!assignments.length) {
        return null
    }
    return <div>
        <Label htmlFor={"pending_candidates"} title={"pending candidates"}/>
        <div className='flex text-sm text-gray-600'>
            {
                assignments.map(
                    (assignment) => (<div key={assignment.dev}>Dev: {assignment.dev}</div>)
                )
            }
        </div>
    </div>
}

export default Assignments