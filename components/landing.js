import Nav from '@/components/nav.js'
import Footer from '@/components/footer.js'
import '@fortawesome/fontawesome-free/css/all.css'
import { Label } from 'semantic-ui-react'
import Link from 'next/link'

function Landing ({ handleWorkWithUs, profiles, ...props }) {
  return (
    <>
      <Nav />
      <main>
        <div
          className='relative pt-16 pb-32 flex content-center items-center justify-center'
          style={{
            minHeight: '75vh'
          }}
        >
          <div
            className='absolute top-0 w-full h-full bg-center bg-cover'
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80')"
            }}
          >
            <span id='blackOverlay' className='w-full h-full absolute opacity-75 bg-black' />
          </div>
          <div className='container relative'>
            <div className='items-center flex flex-wrap'>
              <div className='w-full lg:w-6/12 px-4 m-auto text-center'>
                <h1 className='text-white font-semibold text-5xl'>
                  hire with total confidence
                </h1>
                <p className='mt-4 text-lg text-gray-300'>
                  from an exclusive community of professional developers, with guaranteed results.
                </p>
                <button
                  className='bg-blue-800 text-white hover:bg-gray-700 text-xl font-bold px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 mt-12'
                  type='button'
                  style={{ transition: 'all .50s ease' }}
                  onClick={handleWorkWithUs}
                >
                  work with us &nbsp;
                  <i className='fas fa-arrow-alt-circle-right' />
                </button>
              </div>

            </div>
          </div>
          <div
            className='top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden'
            style={{ height: '70px' }}
          >
            <svg
              className='absolute bottom-0 overflow-hidden'
              xmlns='http://www.w3.org/2000/svg'
              preserveAspectRatio='none'
              version='1.1'
              viewBox='0 0 2560 100'
              x='0'
              y='0'
            >
              <polygon
                className='text-gray-300 fill-current'
                points='2560 0 2560 100 0 100'
              />
            </svg>
          </div>
        </div>

        <section className='pb-20 bg-gray-300 -mt-24'>
          <div className='container mx-auto px-4'>
            <div className='flex flex-wrap'>
              <div className='lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center'>
                <div className='relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg'>
                  <div className='px-4 py-5 flex-auto'>
                    <div className='text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-red-400'>
                      <i className='fas fa-piggy-bank' />
                    </div>
                    <h6 className='text-xl font-semibold'>affordable services.</h6>
                    <p className='mt-2 mb-4 text-gray-600'>
                      save up to 50% on quality developers from Latin America.
                    </p>
                  </div>
                </div>
              </div>

              <div className='w-full md:w-4/12 px-4 text-center'>
                <div className='relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg'>
                  <div className='px-4 py-5 flex-auto'>
                    <div className='text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-400'>
                      <i className='fas fa-fingerprint' />
                    </div>
                    <h6 className='text-xl font-semibold'>
                      hassle free.
                    </h6>
                    <p className='mt-2 mb-4 text-gray-600'>
                      go from search to start quickly within our secure platform.
                    </p>
                  </div>
                </div>
              </div>

              <div className='pt-6 w-full md:w-4/12 px-4 text-center'>
                <div className='relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg'>
                  <div className='px-4 py-5 flex-auto'>
                    <div className='text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-green-400'>
                      <i className='fas fa-check' />
                    </div>
                    <h6 className='text-xl font-semibold'>
                      guaranteed results.
                    </h6>
                    <p className='mt-2 mb-4 text-gray-600'>
                      talent selected from an exclusive community of professional developers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='flex flex-wrap items-center mt-20'>
              <div className='w-full md:w-5/12 px-4 mr-auto ml-auto'>
                <div className='flex flex-row items-center justify-center'>
                  <h3 className='text-3xl font-semibold'>
                    why work with us?
                  </h3>
                </div>
                <p className='text-lg font-light leading-relaxed mt-4 mb-4 text-gray-700'>
                  get quality software built at a fraction of the cost by developers from Latin America.
                </p>
                <p className='text-lg font-light leading-relaxed mt-0 mb-4 text-gray-700'>
                  our talent is selected from an exclusive community that has gone through an extensive screening process plus mentorship to deliver results.
                </p>
              </div>

              <div className='w-full md:w-4/12 px-4 mr-auto ml-auto mt-8'>
                <div className='relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-pink-600'>
                  <img
                    alt='...'
                    src='https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80'
                    className='w-full align-middle rounded-t-lg'
                  />
                  <blockquote className='relative p-8 mb-4'>
                    <svg
                      preserveAspectRatio='none'
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 583 95'
                      className='absolute left-0 w-full block'
                      style={{
                        height: '95px',
                        top: '-94px'
                      }}
                    >
                      <polygon
                        points='-30,95 583,95 583,65'
                        className='text-pink-600 fill-current'
                      />
                    </svg>
                    <h4 className='text-xl font-bold text-white'>
                      proven quality.
                    </h4>
                    <p className='text-md font-light mt-2 text-white'>
                      total devs are great team players and know how to work remotely.
                    </p>
                  </blockquote>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section className='relative py-20'>
          <div
            className='bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20'
            style={{ height: '80px' }}
          >
            <svg
              className='absolute bottom-0 overflow-hidden'
              xmlns='http://www.w3.org/2000/svg'
              preserveAspectRatio='none'
              version='1.1'
              viewBox='0 0 2560 100'
              x='0'
              y='0'
            >
              <polygon
                className='text-white fill-current'
                points='2560 0 2560 100 0 100'
              />
            </svg>
          </div>

          <div className='container mx-auto px-4'>
            <div className='items-center flex flex-wrap'>
              <div className='w-full md:w-4/12 ml-auto mr-auto px-4'>
                <img
                  alt='...'
                  className='max-w-full rounded-lg shadow-lg'
                  src='https://images.unsplash.com/photo-1555212697-194d092e3b8f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80'
                />
              </div>
              <div className='w-full md:w-5/12 ml-auto mr-auto px-4'>
                <div className='md:pr-12'>
                  <div className='flex flex-row items-center justify-center p-4'>
                    <div className='text-pink-600 p-2 text-center inline-flex items-center justify-center w-16 h-12 mt-8 shadow-lg rounded-full bg-pink-300'>
                      <i className='fas fa-rocket text-xl' />
                    </div>
                    <h3 className='text-3xl font-semibold m-8'>
                      start in 3 quick and easy steps
                    </h3>
                  </div>
                  <ul className='list-none mt-6'>
                    <li className='py-2'>
                      <div className='flex items-center'>
                        <h4 className='text-gray-800 text-xl'>1.&nbsp; create your free job posting</h4>
                      </div>
                    </li>
                    <li className='py-2'>
                      <div className='flex items-center'>
                        <h4 className='text-gray-800 text-xl'>2.&nbsp; totaldevs will find a match and begin onboarding</h4>
                      </div>
                    </li>
                    <li className='py-2'>
                      <div className='flex items-center'>
                        <h4 className='text-gray-800 text-xl'>3.&nbsp; accept and start</h4>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className='pt-20 pb-48'>
          <div className='container mx-auto px-4'>
            <div className='flex flex-wrap justify-center text-center mb-24'>
              <div className='w-full lg:w-6/12 px-4'>
                <h2 className='text-4xl font-semibold'>
                  available devs
                </h2>
                <p className='text-lg leading-relaxed m-4 text-gray-600'>
                  select any of the following top talent right now.
                </p>
              </div>
            </div>
            <div className='flex flex-wrap justify-center'>
              {profiles.length > 0 && profiles.map((p, ix) => <Profile key={ix} {...p} />)}
              {profiles.length === 0 && <h3 className='text-gray text-xl'>(no devs available atm)</h3>}
            </div>
          </div>
        </section>

        <section className='pb-20 relative block bg-gray-900'>
          <div
            className='bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20'
            style={{ height: '80px' }}
          >
            <svg
              className='absolute bottom-0 overflow-hidden'
              xmlns='http://www.w3.org/2000/svg'
              preserveAspectRatio='none'
              version='1.1'
              viewBox='0 0 2560 100'
              x='0'
              y='0'
            >
              <polygon
                className='text-gray-900 fill-current'
                points='2560 0 2560 100 0 100'
              />
            </svg>
          </div>

          <div className='container mx-auto px-4 lg:pt-24 lg:pb-64'>
            <div className='flex flex-wrap text-center justify-center'>
              <div className='w-full lg:w-6/12 px-4'>
                <h2 className='pt-8 text-4xl font-semibold text-white'>
                  need something built?
                </h2>
              </div>
            </div>
            <div className='flex flex-wrap mt-12 justify-center'>
              <div className='w-full lg:w-3/12 px-4 text-center'>
                <div className='text-gray-900 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center'>
                  <i className='fas fa-medal text-xl' />
                </div>
                <h6 className='text-xl mt-5 font-semibold text-white'>
                  pay until dev starts
                </h6>
                <p className='mt-2 mb-4 text-gray-500'>
                  no upfront costs, save up to 50% vs. US or Canada devs.
                </p>
              </div>
              <div className='w-full lg:w-3/12 px-4 text-center mt-4'>
                <div className='text-gray-900 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center'>
                  <i className='fas fa-bolt text-xl' />
                </div>
                <h5 className='text-xl mt-5 font-semibold text-white'>
                  quick and easy
                </h5>
                <p className='mt-2 mb-4 text-gray-500'>
                  we provide a candidate within 5 business days.
                  close a deal within 1-3 weeks.
                </p>
              </div>
              <div className='w-full lg:w-3/12 px-4 text-center'>
                <div className='text-gray-900 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center mt-4'>
                  <i className='fas fa-lightbulb text-xl' />
                </div>
                <h5 className='text-xl mt-5 font-semibold text-white'>
                  the software is yours
                </h5>
                <p className='mt-2 mb-4 text-gray-500'>
                  with confidentiality and IP agreements, all work done by a total dev is your property only.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export function Profile (props) {
  return (
    <div className='w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4'>
      <div className='px-6'>
        <img
          alt='...'
          src={props.photoURL}
          className='shadow-lg rounded-full max-w-full mx-auto'
          style={{ maxWidth: '120px' }}
        />
        <div className='pt-6 text-center'>
          <h5 className='text-xl font-bold'>
            {props.displayName}
          </h5>
          <p className='text-lg text-gray-500 font-bold'>
            {props.title}
          </p>
          <div className='m-2 flex flex-row items-center justify-center'>
            {props.stack.map((s, ix) => <Label key={ix}>{s}</Label>)}
          </div>

          <div className='mt-4'>
            {props.githubURI && <button
              className='bg-gray-600 text-white w-8 h-8 rounded-full outline-none focus:outline-none m-1 mb-1'
              type='button'
                                >
              <a className='text-white' href={`https://github.com/${props.githubURI}`}>
                <i className='fab fa-github text-center' />
              </a>
                                </button>}

            {props.linkedInURI &&
              <button
                className='bg-blue-500 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1'
                type='button'
              >
                <a className='text-white' href={`https://linkedin.com/in/${props.linkedInURI}`}>
                  <i className='fab fa-linkedin-in ' />
                </a>
              </button>}

            {props.websiteURL && <button
              className='bg-pink-500 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1'
              type='button'
                                 >
              <a className='text-white' href={`https://${props.websiteURL}`}>
                <i className='fas fa-link' />
              </a>
                                 </button>}
          </div>

        </div>
      </div>
    </div>

  )
}

export default Landing
