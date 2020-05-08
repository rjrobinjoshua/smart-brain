import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";


const Signin = (props) => {

    const smartBrainApiUrl = process.env.REACT_APP_SMART_BRAIN_API_URL;

    const signinSchema = yup.object().shape({
        email: yup.string().email().required("Required"),
        password: yup.string()
        .required("No password provided.")
    });

    const { register, handleSubmit, errors } = useForm({
        validationSchema: signinSchema,
        mode: "onBlur"
    });
    const [signInEmail, setSignInEmail] = useState('');
    const [signInPassword, setSignInPassword] = useState('');

    const onEmailChange =(event) => {
        setSignInEmail(event.target.value);
    }

    const onPasswordChange =(event) => {
        setSignInPassword(event.target.value);
    }

    const onSubmitSignIn = ()=>{
        fetch(smartBrainApiUrl+'/signin', { 
            method: 'post',
            headers: {'content-type': 'application/json' },
            body: JSON.stringify({
                email: signInEmail,
                password: signInPassword
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.id){
                props.loadUser(data);
                props.onRouteChange('home');
            }
        })
    }

    const { onRouteChange } = props;
    return(
        <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
            <main className="pa4 black-80">
                <div className="measure">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="f2 fw6 ph0 mh0">Sign In</legend>
                        <div className="mt3">
                        <label className="db fw6 lh-copy f6" htmlFor ="email-address">Email</label>
                        <input onChange={onEmailChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                            type="email" name="email"  id="email-address" ref={register} />
                        {errors.email && <p>{errors.email.message}</p>}
                        </div>
                        <div className="mv3">
                        <label className="db fw6 lh-copy f6" htmlFor ="password">Password</label>
                        <input onChange={onPasswordChange} className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                            type="password" name="password"  id="password" ref={register} />
                        {errors.password && <p>{errors.password.message}</p>}    
                        </div>
                    </fieldset>
                    <div className="">
                        <input
                            onClick={handleSubmit(onSubmitSignIn)}
                            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                            type="submit" value="Sign in" 
                        />
                    </div>
                    <div className="lh-copy mt3">
                        <p onClick={() => onRouteChange('register')} className="f6 link dim black db pointer">Register</p>
                    </div>
                </div>
            </main>
        </article>
    );
}

export default Signin;