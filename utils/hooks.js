import React, { useState, useEffect } from 'react'
import { storage, db } from '@/utils/config'
import { collection, query, where, getDocs, orderBy, limit, doc, getDoc, onSnapshot } from 'firebase/firestore'

export function useDocuments ({ userDoc, docs, queryConstraints = [], ...props }, dependencies = []) {
  const [documents, setDocuments] = useState([])
  const [documentsLoaded, setDocumentsLoaded] = useState(false)
  const retrieveDocuments = async () => {
    const q = query(collection(db, docs), ...queryConstraints)
    const querySnapshot = await getDocs(q)
    const snaps = []
    querySnapshot.forEach(doc => {
      snaps.push({ id: doc.id, ...doc.data() })
    })
    setDocuments(snaps)
    setDocumentsLoaded(true)
  }

  useEffect(() => {
    if (!documentsLoaded && dependencies.every(Boolean)) retrieveDocuments()
  }, [documentsLoaded, dependencies])

  const refresh = () => {
    setDocumentsLoaded(false)
  }
  return [documents, documentsLoaded, refresh, setDocuments]
}

export function useDocument ({ collection, docID }, dependencies = []) {
  const [document, setDocument] = useState({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!loaded && docID && dependencies.every(Boolean)) {
      const ref = doc(db, collection, docID)
      onSnapshot(ref, doc => {
        if (doc.exists) {
          const data = doc.data()
          setDocument(data)
        }
        setLoaded(true)
      })
    }
  }, [loaded, docID, dependencies])

  const refresh = () => setLoaded(false)

  return [document, loaded, refresh]
}
