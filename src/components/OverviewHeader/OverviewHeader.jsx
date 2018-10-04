import React from 'react'
import { Tabs, Tab } from 'carbon-components-react'

function OverviewHeader ({ tabSelected, handleTabChange }) {
  return (
    <div className='OverviewHeader'>
      <div className='OverviewHeader__title'>
        <h1>Overview</h1>
      </div>
      <div className='OverviewHeader__tabs-container'>
        <div className='OverviewHeader__tabs'>
          <Tabs selected={tabSelected} onSelectionChange={(event) => handleTabChange(event)}>
            <Tab className='OverviewHeader__tab' label='Devices' />
            <Tab className='OverviewHeader__tab' label='Policies' />
          </Tabs>
        </div>
      </div>
      <div className='OverviewHeader__title' />
    </div>
  )
}

export default OverviewHeader
