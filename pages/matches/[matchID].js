import { useForm } from 'react-hook-form'
import { Button, Dropdown } from 'semantic-ui-react'
import { useState, useEffect } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage, db } from '@/utils/config'
import { useDocuments } from '@/utils/hooks'
import { doc, setDoc, addDoc, collection, getDoc, where } from 'firebase/firestore'
import { toast } from 'react-toastify'
import sleep from '@/utils/misc'
import { useRouter } from 'next/router'



export default function MatchView ({ userDoc, ...props }) {
  const router = useRouter()
//   const [saving, setSaving] = useState(false)
//   const [pdfURL, setPdfURL] = useState('')
//   const [pdfName, setPdfName] = useState('')
//   const [searchQuery, setSearchQuery] = useState('')
//   const [stack, setStack] = useState([])
//   const [dropdownOptions, setDropdownOptions] = useState([])
//   const [jobDoc, setJobDoc] = useState({})
//   const [photoURL, setPhotoURL] = useState(null)
//   const [isEditing, setIsEditing] = useState(false)

  const { matchID } = router.query
  console.log({matchID})
  return (<h2>exito</h2>)
}