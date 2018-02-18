import React from 'react'

const Header = ({isOpen, onClick}) => {
  const buttonClassName = isOpen ? 'Header__left-nav-toggle Header__left-nav-toggle--active' : 'Header__left-nav-toggle'
  return (
    <header className='Header'>
      <div className='Header__left-nav-toggle-container'>
        <button type='button' className={buttonClassName} onClick={onClick}>
          <span className='Header__left-nav-icon' />
        </button>
      </div>
      <a className='Header__title' href='/'>
        <h3>OpenTRV</h3>
      </a>
    </header>
  )
}

export default Header
