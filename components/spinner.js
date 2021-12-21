import { Dimmer, Segment, Loader } from 'semantic-ui-react'

export default function Spinner () {
  return (
    <Dimmer active inverted>
      <Loader size='large' />
    </Dimmer>
  )
}
