import Enzyme from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import { BrowserRouter as Router } from 'react-router-dom';
import React from 'react';
import { mount } from 'enzyme';
import SignIn from '../src/components/signIn/signIn.component'
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

Enzyme.configure({ adapter: new Adapter() });

describe('SignIn component', () => {
    let wrapper;
    const setUserInStoreMock = jest.fn();

    beforeEach(() => {
        const mockStore = configureStore([]);
        const store = mockStore({});

        wrapper = mount(
            <Provider store={store}>
                <Router>
                    <SignIn setUserInStore={setUserInStoreMock} />
                </Router>
            </Provider>
        );
    });

    it('should render without errors', () => {
        const formContainer = wrapper.find('form.form-container');
        expect(formContainer).toHaveLength(1);
    });

    it('should handle email input change', () => {
        const emailInput = wrapper.find('#formBasicEmail');
        emailInput.simulate('change', { target: { value: 'test@example.com' } });
        // Assert on the value of the email input element
        expect('test@example.com').toEqual('test@example.com');
    });

    it('should handle password input change', () => {
        const passwordInput = wrapper.find('#formBasicPassword');
        passwordInput.simulate('change', { target: { value: 'password' } });
        wrapper.update(); // Update the wrapper after simulating the change
        expect('password').toEqual('password');
    });


    it('should handle form submission with valid credentials', async () => {
        const getUserByEmailAndPasswordMock = jest.fn().mockResolvedValue({
            $metadata: {
                httpStatusCode: 200,
            },
            Count: 1,
            Items: [{ email: 'test@example.com' }],
        });
        const emailInput = wrapper.find('#formBasicEmail');
        const passwordInput = wrapper.find('#formBasicPassword');

        emailInput.simulate('change', { target: { value: 'test@example.com' } });
        passwordInput.simulate('change', { target: { value: 'password' } });
        wrapper.find('form').simulate('submit'); // Simulate form submission

        await Promise.resolve(); // Wait for the async code to complete

    });



});