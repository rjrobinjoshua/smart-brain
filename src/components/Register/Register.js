import React, { useState, useRef } from 'react';
import { useForm } from "react-hook-form";
import * as yup from "yup";


const smartBrainApiUrl = process.env.REACT_APP_SMART_BRAIN_API_URL;

const registerSchema = yup.object().shape({
    name: yup.string().required("Name is Required"),
    email: yup.string().email("Email must be a valid email").required("Email is required"),
    password: yup.string().required("No password provided")
});

const Register = (props) => {

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const registerCard = useRef(null);

    const { register, handleSubmit, errors, setError, clearError, formState } = useForm({
        validationSchema: registerSchema,
        mode: "onBlur"
    });

    const { isSubmitting } = formState;

    const onEmailChange = (event) => {
        clearRegisterErr();
        setEmail( event.target.value);
    }

    const onPasswordChange = (event) => {
        clearRegisterErr();
        setPassword(event.target.value);
    }

    const onNameChange = (event) => {
        clearRegisterErr();
        setName(event.target.value);
    } 

    const onSubmitRegister = async ()=>{
        await fetch(smartBrainApiUrl+'/register', { 
            method: 'post',
            headers: {'content-type': 'application/json' },
            body: JSON.stringify({
                email: email,
                password: password,
                name: name
            })
        })
        .then(res => res.json())
        .then(user => {
            if(user.id){
                user.password=password;
                props.loadUser(user);
                props.onRouteChange('home');
            }else {
                setError("register","notMatch","Unable to register");
                shakeRegisterCard();
            }
        })
        .catch(err => {
            setError("register","notMatch","Network error, Please try again later");
            shakeRegisterCard();
        });
    }

    const shakeRegisterCard = () => {

        if(registerCard.current !== null) {
            registerCard.current.classList.add('error-shake');
            setTimeout(() => {
                registerCard.current.classList.remove('error-shake');
            }, 300);
        }
    }

    function clearRegisterErr(){
        if (errors.register)
            clearError("register");
    }


    return(
            <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center" ref= {registerCard}>
                <main className="pa4 black-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f2 fw6 ph0 mh0">Register</legend>
                            <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                            <input onChange={onNameChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                type="text" name="name"  id="name" ref={register} />
                            {errors.name && <p className="error">{errors.name.message}</p>}
                            </div>
                            <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                            <input onChange={ onEmailChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                type="email" name="email"  id="email-address" ref={register} />
                            {errors.email && <p className="error">{errors.email.message}</p>}
                            </div>
                            <div className="mv3">
                            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                            <input onChange={onPasswordChange} className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                type="password" name="password"  id="password" ref={register} />
                            {errors.password && <p className="error">{errors.password.message}</p>} 
                            </div>
                        </fieldset>
                        <div className="">
                            <input
                                onClick={handleSubmit(onSubmitRegister)}
                                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                                type="submit" value="Register" disabled={isSubmitting}
                            />
                        {errors.register && <p className="error">{errors.register.message}</p>}     
                        </div>
                    </div>
                </main>
            </article>
        );
}

export default Register;