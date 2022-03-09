import { useDocument } from '@/utils/hooks'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { SuspensePlaceholders } from '@/components/suspense'

const TotalResume = ({ profileID }) => {
  const [profileDoc, profileLoaded, _pr] = useDocument({ collection: 'profiles', docID: profileID }, [profileID])
  return (
    <>
      {!profileLoaded && <SuspensePlaceholders />}
      {profileLoaded && profileDoc.isProfileComplete &&
        <div className='m-6 max-w-xl'>
          <AboutMeSection profileDoc={profileDoc} />
          <hr />
          <ExperienceSection profileDoc={profileDoc} />
          <hr />
          <ProjectsSection profileDoc={profileDoc} />
          <hr />
          {profileDoc.degrees?.length > 1 && <EducationSection profileDoc={profileDoc} />}
        </div>}
      {profileLoaded && !profileDoc.isProfileComplete && <h1> Under construction... </h1>}
    </>
  )
}

const AboutMeSection = ({ profileDoc }) => {
  return (
    <section className='mt-4 mb-4 flex flex-col items-center'>
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
