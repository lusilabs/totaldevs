import { useDocument } from '@/utils/hooks'
import { SuspensePlaceholders } from '@/components/suspense'

const TotalResume = ({ profileID, handleCreateJobPosting }) => {
  const [profileDoc, profileLoaded, _pr, _sp] = useDocument({ collection: 'profiles', docID: profileID }, [profileID])
  return (
    <>
      {!profileLoaded && <SuspensePlaceholders />}
      {profileLoaded && profileDoc.isProfileComplete &&
        <div className='flex justify-center w-full max-w-fit'>
          <div className='flex-auto max-w-3xl m-6'>
            <AboutMeSection profileDoc={profileDoc} />
            <hr />
            <ExperienceSection profileDoc={profileDoc} />
            <hr />
            <ProjectsSection profileDoc={profileDoc} />
            <hr />
            {profileDoc.degrees?.length > 1 && <EducationSection profileDoc={profileDoc} />}
            {handleCreateJobPosting && <button
              className='bg-blue-700 text-white hover:bg-blue-500 text-xl font-bold px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 mt-12'
              type='button'
              style={{ transition: 'all .50s ease' }}
              onClick={handleCreateJobPosting}
            >
              hire {profileDoc.displayName} &nbsp;
              <i className='fas fa-arrow-alt-circle-right' />
            </button>}
          </div>
        </div>}
      {profileLoaded && !profileDoc.isProfileComplete && <h1> profile under construction... </h1>}
    </>
  )
}

const AboutMeSection = ({ profileDoc }) => {
  return (
    <section className='flex flex-col items-center mt-4 mb-4'>
      <h1>{profileDoc.displayName}</h1>
      <p>{profileDoc.bio}</p>
    </section>
  )
}

const ExperienceSection = ({ profileDoc }) => {
  return (
    <section className='mt-4 mb-4'>
      <h3>Experience</h3>

      {profileDoc.jobs?.map((j, jix) => (
        <div key={jix}>
          <div className='flex justify-between'>
            <p><strong>{j.role} </strong>
              at&nbsp;
              <a href={j.companyURL}>{j.companyName}</a>
            </p>
            {j.fromYear} / {j.toYear}
          </div>
          <ul className='mt-4 ml-4 list-disc'>
            {j.activities?.map((a, aix) => <li key={jix + aix}>{a}</li>)}
          </ul>
          <p className='m-4'><i>{j.stack?.join(' ')}</i> </p>
        </div>
      ))}

    </section>
  )
}

const ProjectsSection = ({ profileDoc }) => {
  return (
    <section className='mt-4 mb-4'>
      <h3>Projects</h3>

      {profileDoc.projects?.map((p, pix) => (
        <div key={pix}>
          <div className='flex justify-between'>
            <p><strong>{p.role} </strong>
              &nbsp;
              &nbsp;
              <a href={p.projectURL}>{p.projectName}</a>
            </p>
            <a href={p.projectRepoURL}>repo</a>
          </div>
          {p.description}
          <p className='m-4'><i>{p.stack?.join(' ')}</i> </p>
        </div>
      ))}

    </section>
  )
}

const EducationSection = ({ profileDoc }) => {
  return (
    <section className='mt-4 mb-4'>
      <h3>Education</h3>

      {profileDoc.degrees?.map((d, dix) => (
        <div key={dix}>
          <div className='flex justify-between'>
            <p><strong>{d.degreeName} </strong>
              &nbsp;
              &nbsp;
              <a href={d.universityURL}>{d.universityName}</a>
            </p>
            {d.endYear}
          </div>
        </div>
      ))}

    </section>
  )
}
export default TotalResume
