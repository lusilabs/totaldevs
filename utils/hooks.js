import React, { useState, useEffect } from 'react'
import { storage, db } from '@/utils/config'
import { collection, query, where, getDocs, orderBy, limit, doc, getDoc, onSnapshot } from 'firebase/firestore'
import { Button, Dropdown } from 'semantic-ui-react'

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
      })
      setLoaded(true)
    }
  }, [loaded, docID, dependencies])

  const refresh = () => setLoaded(false)

  return [document, loaded, refresh]
}

const mergeSearchResults = (prev, names) => {
  const prevNames = prev.map(({ value }) => value)
  const dedupedNames = new Set([...prevNames, ...names])
  const deduped = [...dedupedNames].map(name => ({ key: name, value: name, text: name }))
  return deduped
}

export function useStackOverflowSearch (arr, setter) {
  const [dropdownOptions, setDropdownOptions] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchChange = async (e, { searchQuery: query }) => setSearchQuery(query)
  const handleChange = (e, { value }) => setter(value)

  const fetchAndSetDropdownOptions = async url => {
    const response = await fetch(url)
    const { items } = await response.json()
    if (items && items.length > 0) setDropdownOptions(prev => mergeSearchResults(prev, items.map(({ name }) => name)))
  }

  useEffect(() => {
    const searchURL = `https://api.stackexchange.com/2.3/tags?pagesize=25&order=desc&sort=popular&inname=${searchQuery}&site=stackoverflow`
    const timer = setTimeout(() => {
      if (query !== '') fetchAndSetDropdownOptions(searchURL)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const Component = () => <Dropdown
    options={dropdownOptions}
    onChange={handleChange}
    onSearchChange={handleSearchChange}
    searchQuery={searchQuery}
    value={arr}
    fluid
    multiple
    selection
    search
                          />

  return Component
}
