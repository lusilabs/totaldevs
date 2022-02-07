import { useForm } from 'react-hook-form'
import { Button, Dropdown } from 'semantic-ui-react'
import React, { useState, useEffect } from 'react'
import sleep from '@/utils/misc'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage, db } from '@/utils/config'
import { doc, setDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import DevProfileDisplay from '@/components/devprofiledisplay'
import AboutMe from '@/components/aboutme'
import ProfileExperience from '@/components/profileexperience'
import ProfileEducation from '@/components/profileeducation'
import ProfileProjects from '@/components/profileprojects'
import ProfileAvailability from '@/components/profileavailability'

const biosByRole = {
  fullstack: 'I am experienced developing web applications, from front to back to all things like cloud, deployments, testing, etc., and working with remote teams.  I have a strong mathematics background, and I am seeking a mentor to become a software architect.'

}

const requiredFieldsByModule = {
  isAvailabilityComplete: ['impossible'],
  isAboutMeComplete: ['displayName', 'title', 'salaryMin', 'photoURL', 'englishLevel', 'bio', 'experienceYears', 'visibility', 'hasAcceptedTerms', 'jobSearch'],
  isExperienceComplete: ['impossible'],
  isProjectsComplete: ['impossible'],
  isEducationComplete: ['impossible']
}

function EditDevProfile ({ userDoc, ...props }) {
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [photoURL, setPhotoURL] = useState(null)
  const [jobs, setJobs] = useState([])
  const [projects, setProjects] = useState([])
  const [degrees, setDegrees] = useState([])

  useEffect(() => {
    setPhotoURL(userDoc.photoURL)
    setDegrees(userDoc.degrees ?? [])
    setProjects(userDoc.projects ?? [])
    setJobs(userDoc.jobs ?? [])
  }, [])

  const onSubmit = async data => {
    if (data.visibility === 'public' && !photoURL) {
      toast.error('please upload a photo if your profile is public')
      return
    }
    setSaving(true)
    await sleep(2000)
    for (const [key, fields] of Object.entries(requiredFieldsByModule)) {
      data[key] = fields.every(f => data[f])
    }
    const profileComplete = data.isProjectsComplete && data.isExperienceComplete && data.isAvailabilityComplete && data.isEducationComplete && data.isAboutMeComplete
    const uref = doc(db, 'users', userDoc.uid)
    await setDoc(uref, {
      ...data,
      photoURL,
      jobs,
      projects,
      degrees,
      profileComplete
    }, { merge: true })

    const pref = doc(db, 'profiles', userDoc.uid)
    await setDoc(pref, {
      ...data,
      email: userDoc.email,
      photoURL,
      jobs,
      projects,
      degrees,
      profileComplete
    }, { merge: true })
    toast.success('profile saved successfully.')
    setSaving(false)
    setIsEditing(false)
  }

  const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: { ...userDoc } })

  const handleUploadPhoto = e => {
    const file = e.target.files[0]
    const fileRef = ref(storage, `images/${file.name}`)
    if (!file.name.match(/.(jpg|jpeg|png|gif)$/i) || file.size > 1000000) {
      toast.error('Please upload a < 1 MB image.')
      return
    }
    uploadBytes(fileRef, file).then(_ => {
      getDownloadURL(fileRef).then(url => setPhotoURL(url))
    })
  }

  // console.log(watch(['displayName', 'title', 'bio', 'githubURI', 'linkedInURI', 'websiteURL', 'photoURL', 'visibility', 'jobSearch', 'hasAcceptedTerms']))

  return (
    <>
      {!isEditing && <DevProfileDisplay userDoc={userDoc} {...props} setIsEditing={setIsEditing} />}
      {isEditing &&
        <form onSubmit={handleSubmit(onSubmit)}>
          {isEditing === 'availability' && <ProfileAvailability register={register} errors={errors} />}
          {isEditing === 'about' && <AboutMe register={register} errors={errors} photoURL={photoURL} handleUploadPhoto={handleUploadPhoto} />}
          {isEditing === 'experience' && <ProfileExperience register={register} errors={errors} jobs={jobs} setJobs={setJobs} />}
          {isEditing === 'projects' && <ProfileProjects register={register} errors={errors} projects={projects} setProjects={setProjects} />}
          {isEditing === 'education' && <ProfileEducation register={register} errors={errors} degrees={degrees} setDegrees={setDegrees} />}
          <div className='px-4 py-3 text-right sm:px-6'>
            <Button disabled={saving} loading={saving} type='submit' color='green' fluid className='text-md'>
              {saving && <span>saving</span>}
              {!saving && <span>save</span>}
            </Button>
          </div>

          <div className='px-4 py-3 text-right sm:px-6 mb-8'>
            <Button onClick={() => setIsEditing(false)} fluid className='text-md'>
              cancel
            </Button>
          </div>
        </form>}
    </>
  )
}

export default EditDevProfile
