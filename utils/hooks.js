import React, { useState, useEffect } from 'react'
import { storage, db } from '@/utils/config'
import { collection, query, where, getDocs, orderBy, limit, doc, getDoc } from 'firebase/firestore'

export function useDocuments ({ userDoc, docs, queryConstraints = [], ...props }) {
  const [documents, setDocuments] = useState([])
  const retrieveDocuments = async () => {
    const q = query(collection(db, docs), ...queryConstraints)
    const querySnapshot = await getDocs(q)
    const snaps = []
    querySnapshot.forEach(doc => {
      snaps.push({ id: doc.id, ...doc.data() })
    })
    console.log(snaps)
    setDocuments(snaps)
  }

  useEffect(() => {
    retrieveDocuments()
  }, [userDoc])
  return documents
}