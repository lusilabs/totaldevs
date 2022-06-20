import Footer from '@/components/footer.js'
import Link from 'next/link'
import { useMediaQuery } from '@/utils/hooks'


export default function Terms() {
  const smallScreen = useMediaQuery()
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

      <div className={`${smallScreen ? 'text-center' : ''} m-4`}>
        <h1>Payment Terms</h1>
        <p>Last updated: June 7, 2022</p>
        <p>These Payment Terms describes Our policies and procedures on the collection and use and disclosure of Your credit card information when You use the Service.</p>

        <h1>Upfront payment</h1>
        <h2>Procedure</h2>
        Once you accept and submit your card information via our secure payment system we will immediately charge 20% of the final monthly salary agreed upon in the matching procedure.
        This payment initiates a 7 day trial in which both sides will start working with each other.

        <h1>7 day Trial period</h1>
        <h2> Handling the first week</h2>

        <p>
          The first week should be a period where you and the developer get to know each other and assess if they wish to move forward.
          If you cancel during this period you will NOT be subsequently charged for any service whatsoever.
        </p>

        <h2>Monthly payments</h2>
        However, after the 7 day trial have gone through, you will enter the monthly payment period where your card will be charged AT THE END of this monthly period.

        <h1>Definition of professional criteria for out-of-office or contract termination</h1>

        <ul>
          <li>- medical inability as accredited by paperwork</li>
          <li>- fortuitous event</li>
          <li>- force majeure</li>
        </ul>

        <h1>FAQ</h1>
        <h3>What happens if the developer does not show up or terminates?</h3>
        <p>The developer has agreed to the professional criteria outlined above. If it is still the case that the developer does not show up they will be banned from totaldevs and you will NOT be charged further.
        </p>

        <h3>Can I choose to end the contract?</h3>
        <p>You are free to choose to end the relationship with totaldevs or with the developer at any moment. You will be charged the remaining billing period. </p>
        <h1>Contact Us</h1>
        <p>If you have any questions about these Payment Terms, You can contact us at: <a href='mailto: support@totaldevs.com'>support@totaldevs.com</a> </p>

      </div>
    </>
  )
}
