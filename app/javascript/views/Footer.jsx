import React from 'react'
import {Link} from 'react-router'

const Footer = () => (
  <div className= 'col-12-xs text-center link-color'>
    <h2 className='hidden'>Footer</h2>
    <span><Link to='/pages/privacy_policy'>Privacy Policy</Link></span>
    <span> <Link to='/pages/conditions_of_use'>Conditions of use</Link></span>
  </div>
)

export default Footer
