import Footer from '@/components/footer.js'
import Link from 'next/link'

export default function About () {
  return (
    <>
      <div className='flex-shrink-0 bg-black'>
        <Link href='/'>
          <img
            className='h-12 w-12'
            src='/logo-small.png'
            alt='logo'
          />
        </Link>
      </div>
      <div className='text-center m-4 mb-12'>
        <h1>mission</h1>
        <p>
          to become the foremost exclusive community for professional latin american developers.
        </p>
        <h1>what we do</h1>
        <p>
          totaldevs was born out of a genuine desire to help Latin American talent grow and thrive in the remote world. We help you by finding the right company and provide mentorship to make you land your dream job. You will thrive within totaldevs and achieve your financial and career goals.
        </p>
        <h1>principles and axioms</h1>
        <ul>
          <li>honesty</li>
          <li>commitment</li>
          <li>team player</li>
        </ul>
      <div style={{visibility: 'hidden'}}>    
        <h1>oath</h1>
        <p>
          "Hear my words and bear witness to my vow, Night gathers, and now my watch begins. It shall not end until the internet crashes. I shall have no life, hold no lands, feed no trolls. I shall wear no crowns and win no glory. I shall live and die at my computer. I am the sword in the darkness. I am the watcher on the logs. I am the fire that burns against the bugs, the light that brings the fix, the alerts that wake the sleepers, the shield that guards the realms of tech. I pledge my life and honor to totaldevs, for this night and all the nights to come."
        </p>
      </div>
      </div>
      <Footer />
    </>
  )
}
