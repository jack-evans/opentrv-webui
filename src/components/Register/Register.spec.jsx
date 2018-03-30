import React from 'react'
import Register from './Register'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('Register.jsx', () => {
  it('renders without crashing', () => {
    expect(shallow(<Register />)).toMatchSnapshot()
  })

  describe('when the user edits the name field', () => {
    let wrapper
    const name = 'John Doe'

    beforeEach(() => {
      wrapper = mount(<Register />)
      wrapper.find('input').at(0).simulate('change', { target: { value: name, name: 'name' } })
    })

    afterEach(() => {
      wrapper.unmount()
    })

    it('changes the name property in the user state', () => {
      expect(wrapper.state().user.name).toEqual(name)
    })
  })

  describe('when the user edits the email field', () => {
    let wrapper
    const email = 'john.doe@example.com'

    beforeEach(() => {
      wrapper = mount(<Register />)
      wrapper.find('input').at(1).simulate('change', { target: { value: email, name: 'email' } })
    })

    afterEach(() => {
      wrapper.unmount()
    })

    it('changes the email property in the user state', () => {
      expect(wrapper.state().user.email).toEqual(email)
    })
  })

  describe('when the user edits the Line 1 address input', () => {
    let wrapper
    const firstLine = '123 example street'

    beforeEach(() => {
      wrapper = mount(<Register />)
      wrapper.find('input').at(2).simulate('change', { target: { value: firstLine, name: 'address->firstLine' } })
    })

    afterEach(() => {
      wrapper.unmount()
    })

    it('changes the address.firstLine property in the user state', () => {
      expect(wrapper.state().user.address.firstLine).toEqual(firstLine)
    })
  })

  describe('when the user edits the Line 2 address input', () => {
    let wrapper
    const secondLine = 'example town'

    beforeEach(() => {
      wrapper = mount(<Register />)
      wrapper.find('input').at(3).simulate('change', { target: { value: secondLine, name: 'address->secondLine' } })
    })

    afterEach(() => {
      wrapper.unmount()
    })

    it('changes the address.secondLine property in the user state', () => {
      expect(wrapper.state().user.address.secondLine).toEqual(secondLine)
    })
  })

  describe('when the user edits the city address input', () => {
    let wrapper
    const city = 'example city'

    beforeEach(() => {
      wrapper = mount(<Register />)
      wrapper.find('input').at(4).simulate('change', { target: { value: city, name: 'address->city' } })
    })

    afterEach(() => {
      wrapper.unmount()
    })

    it('changes the address.city property in the user state', () => {
      expect(wrapper.state().user.address.city).toEqual(city)
    })
  })

  describe('when the user edits the county address input', () => {
    let wrapper
    const county = 'county'

    beforeEach(() => {
      wrapper = mount(<Register />)
      wrapper.find('input').at(5).simulate('change', { target: { value: county, name: 'address->county' } })
    })

    afterEach(() => {
      wrapper.unmount()
    })

    it('changes the address.county property in the user state', () => {
      expect(wrapper.state().user.address.county).toEqual(county)
    })
  })

  describe('when the user edits the country address input', () => {
    let wrapper
    const country = 'uk'

    beforeEach(() => {
      wrapper = mount(<Register />)
      wrapper.find('input').at(6).simulate('change', { target: { value: country, name: 'address->country' } })
    })

    afterEach(() => {
      wrapper.unmount()
    })

    it('changes the address.firstLine property in the user state', () => {
      expect(wrapper.state().user.address.country).toEqual(country)
    })
  })

  describe('when the user edits the postcode address input', () => {
    let wrapper
    const postcode = 'ab12cd'

    beforeEach(() => {
      wrapper = mount(<Register />)
      wrapper.find('input').at(7).simulate('change', { target: { value: postcode, name: 'address->postcode' } })
    })

    afterEach(() => {
      wrapper.unmount()
    })

    it('changes the address.postcode property in the user state', () => {
      expect(wrapper.state().user.address.postcode).toEqual(postcode)
    })
  })

  describe('when the user edits the password input', () => {
    let wrapper
    const password = 'password'

    beforeEach(() => {
      wrapper = mount(<Register />)
      wrapper.find('input').at(8).simulate('change', { target: { value: password, name: 'password' } })
    })

    afterEach(() => {
      wrapper.unmount()
    })

    it('changes the address.firstLine property in the user state', () => {
      expect(wrapper.state().user.password).toEqual(password)
    })
  })

  describe('when the user edits the confirm password input', () => {
    let wrapper
    const confirmPass = 'password'

    beforeEach(() => {
      wrapper = mount(<Register />)
      wrapper.find('input').at(9).simulate('change', { target: { value: confirmPass, name: 'password-confirm' } })
    })

    afterEach(() => {
      wrapper.unmount()
    })

    it('changes the address.firstLine property in the user state', () => {
      expect(wrapper.instance().confirmPass).toEqual(confirmPass)
    })
  })

  describe('when the user fills in all the required fields', () => {
    let wrapper
    const arrayOfInputs = [
      {
        value: 'John Doe',
        name: 'name'
      }, {
        value: 'john.doe@example.com',
        name: 'email'
      }, {
        value: '123 example street',
        name: 'address->firstLine'
      }, {
        value: 'exampleCounty',
        name: 'address->county'
      }, {
        value: 'ab12cd',
        name: 'address->postcode'
      }, {
        value: 'Passw0rd',
        name: 'password'
      }, {
        value: 'Passw0rd',
        name: 'password-confirm'
      }
    ]

    beforeEach(() => {
      wrapper = mount(<Register />)
      for (let i = 0; i < arrayOfInputs.length; i++) {
        wrapper.find('input').at(i).simulate('change', { target: { value: arrayOfInputs[i].value, name: arrayOfInputs[i].name } })
      }
    })

    afterEach(() => {
      wrapper.unmount()
    })

    it('sets the isDisabled state to false', () => {
      expect(wrapper.state().isDisabled).toEqual(false)
    })
  })
})
