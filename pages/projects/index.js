import { ProjectsToCheck } from "@/components/matches/projects";

const Projects = ({userDoc}) => {
    return <div>
        <ProjectsToCheck userDoc={userDoc} />
    </div>
}

export default Projects;