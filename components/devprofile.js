import { useForm } from 'react-hook-form'
import { Button, Dropdown } from 'semantic-ui-react'
import React, { useState, useEffect } from 'react'
import sleep from '@/utils/misc'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage, db, functions } from '@/utils/config'
import { doc, setDoc } from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
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

const verifyCalendlyUrl = httpsCallable(functions, 'verifyCalendlyUrl')

// const biosByRole = {
//   fullstack: 'I am experienced developing web applications, from front to back to all things like cloud, deployments, testing, etc., and working with remote teams.  I have a strong mathematics background, and I am seeking a mentor to become a software architect.'
// }

const requiredFieldsByModule = {
  isAvailabilityComplete: ['calendlyURL', 'title', 'jobSearch', 'salaryMin'],
  isAboutMeComplete: ['displayName', 'englishLevel', 'bio', 'experienceYears', 'visibility', 'hasAcceptedTerms'],
  isExperienceComplete: [], // empty means that if it passes onSubmit then it is alright (we use 'required' inside components)
  isProjectsComplete: [], // empty means that if it passes onSubmit then it is alright (we use 'required' inside components)
  isEducationComplete: []// empty means that if it passes onSubmit then it is alright (we use 'required' inside components)
}

function EditDevProfile ({ userDoc, ...props }) {
  const [saving, setSaving] = useState(false)
  const [photoURL, setPhotoURL] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStack, setSelectedStack] = useState([])
  const [dropdownOptions, setDropdownOptions] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [jobs, setJobs] = useState([])
  const [projects, setProjects] = useState([])
  const [degrees, setDegrees] = useState([])

  useEffect(() => {
    setPhotoURL(userDoc.photoURL)
    setDegrees(userDoc.degrees ?? [])
    setProjects(userDoc.projects ?? [])
    setJobs(userDoc.jobs ?? [])
    setSelectedStack(userDoc.stack ?? [])
    setDropdownOptions(userDoc.stack?.map(name => ({ key: name, value: name, text: name })) ?? [])
  }, [])

  const onSubmit = async data => {
    if (data.visibility === 'public' && !photoURL) {
      toast.error('please upload a photo if your profile is public')
      return
    }
    if (isEditing === 'experience' && jobs.length < 1) {
      toast.error('add at least 1 job')
      return
    }
    if (isEditing === 'experience' && jobs.some(job => job.activities.length < 1 || job.activities.some(a => !a))) {
      toast.error('add at least 1 activity to every job')
      return
    }
    if (isEditing === 'projects' && projects.length < 1) {
      toast.error('add at least 1 project')
      return
    }
    if (isEditing === 'availability') {
      setSaving(true)
      const url = data.calendlyURL
      const { data: { error } } = await verifyCalendlyUrl({ url })
      if (error) {
        toast.error('Please enter a valid and recent calendly URL')
        setSaving(false)
        return
      }
    }
    for (const [key, fields] of Object.entries(requiredFieldsByModule)) {
      if (key.toLowerCase().includes(isEditing)) data[key] = fields.every(f => data[f])
    }
    const isProfileComplete = !!(
      (data.isProjectsComplete || userDoc.isProjectsComplete) &&
      (data.isExperienceComplete || userDoc.isExperienceComplete) &&
      (data.isAvailabilityComplete || userDoc.isAvailabilityComplete) &&
      (data.isEducationComplete || userDoc.isEducationComplete) &&
      (data.isAboutMeComplete || userDoc.isAboutMeComplete)
    )

    setSaving(true)
    await sleep(2000)
    const uref = doc(db, 'users', userDoc.uid)
    await setDoc(uref, {
      ...data,
      photoURL,
      jobs,
      projects,
      degrees,
      isProfileComplete
    }, { merge: true })

    const pref = doc(db, 'profiles', userDoc.uid)
    await setDoc(pref, {
      ...data,
      email: userDoc.email,
      photoURL,
      jobs,
      projects,
      degrees,
      isProfileComplete
    }, { merge: true })
    toast.success('profile saved successfully.')
    setSaving(false)
    setIsEditing(false)
  }

  const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: { ...userDoc } })

  const handleUploadPhoto = e => {
    const file = e.target.files[0]
    const fileRef = ref(storage, `images/${file.name}`)
    if (!file.name.match(/.(jpg|jpeg|png|gif)$/i)) {
      toast.error('Please upload jpg, jpeg, png or gif file type.')
      return
    }
    if (file.size > 1000000) {
      toast.error('Please upload a < 1 MB image.')
      return
    }
    uploadBytes(fileRef, file).then(_ => {
      getDownloadURL(fileRef).then(url => setPhotoURL(url))
    })
  }

  // console.log(watch(['displayName', 'title', 'bio', 'githubURI', 'linkedInURI', 'websiteURL', 'photoURL', 'visibility', 'jobSearch', 'hasAcceptedTerms']))
  // console.log(watch(['calendlyURL']))

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

          <div className='px-4 py-3 mb-8 text-right sm:px-6'>
            <Button onClick={() => setIsEditing(false)} fluid className='text-md'>
              cancel
            </Button>
          </div>
        </form>}
    </>
  )
}

export default EditDevProfile
