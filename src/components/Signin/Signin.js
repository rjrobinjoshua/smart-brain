import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const signinSchema = yup.object().shape({
    email: yup.string().email("Email must be a valid email").required("Email is required"),
    password: yup.string()
    .required("No password provided")
});

const smartBrainApiUrl = process.env.REACT_APP_SMART_BRAIN_API_URL;

const Signin = (props) => {

    const [signInEmail, setSignInEmail] = useState('');
    const [signInPassword, setSignInPassword] = useState('');

    const logInCard = useRef(null);

    const { register, handleSubmit, errors, setError, clearError, formState } = useForm({
        validationSchema: signinSchema,
        mode: "onBlur"
    });
    const { isSubmitting } = formState;

    const onEmailChange =(event) => {
        clearSigninErr();
        setSignInEmail(event.target.value);
    }

    const onPasswordChange =(event) => {
        clearSigninErr();
        setSignInPassword(event.target.value);
    }

    const onSubmitSignIn = async ()=>{
        
        await fetch(smartBrainApiUrl+'/signin', { 
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
                data.password=signInPassword;
                props.loadUser(data);
                props.onRouteChange('home');
            }else{
                setError("signin","notMatch","Invalid credentials");
                shakeLoginCard();
            }
        }).catch(err => {
            setError("signin","notMatch","Network error, Please try again later");
            shakeLoginCard();
        });
    }

    const onSubmitKeyPress = (event) => {
        var key=event.keyCode || event.which;
        if (key === 13){
            onSubmitSignIn();
  }
    }

    const shakeLoginCard = () => {
        if(logInCard.current !== null) {
            logInCard.current.classList.add('error-shake');
            setTimeout(() => {
                logInCard.current.classList.remove('error-shake');
            }, 300);
        }
    }

    function clearSigninErr(){
        if (errors.signin)
            clearError("signin");
    }

    const { onRouteChange } = props;
    return(
        <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center" ref= {logInCard}>
            <main className="pa4 black-80">
                <div className="measure">
                    <fieldset id="sign_in" className="ba b--transparent ph0 mh0">
                        <legend className="f2 fw6 ph0 mh0">Sign In</legend> 
                        <div className="mt3">
                        <label className="db fw6 lh-copy f6" htmlFor ="email-address">Email</label>
                        <input onChange={onEmailChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                            type="email" name="email"  id="email-address" ref={register} />
                        {errors.email && <p className="error">{errors.email.message}</p>}
                        </div>
                        <div className="mv3">
                        <label className="db fw6 lh-copy f6" htmlFor ="password">Password</label>
                        <input onChange={onPasswordChange} onKeyPress={event => handleSubmit(onSubmitKeyPress(event))} className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                            type="password" name="password"  id="password" ref={register} />
                        {errors.password && <p className="error">{errors.password.message}</p>}    
                        </div>
                    </fieldset>
                    <div className="">
                        <input
                            onClick={handleSubmit(onSubmitSignIn)}
                            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                            type="submit" value="Sign in"  disabled={isSubmitting}
                        />
                    {errors.signin && <p className="error">{errors.signin.message}</p>}      
                    </div>
                    <div className="lh-copy mt3">
                        <p onClick={() => onRouteChange('register')} className="f6 b link dim black db pointer">Register</p>
                    </div>
                </div>
            </main>
        </article>
    );
}

export default Signin;