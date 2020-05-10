import React from 'react';
import './ImageLinkForm.css';
import { useForm } from "react-hook-form";
import * as yup from "yup";

const imageSchema = yup.object().shape({
    url: yup.string().required("Image url/link is required")
});



const ImageLinkForm = ({ onInputChange, onButtonSubmit, error }) => {

    const { register, handleSubmit, errors, formState } = useForm({
        validationSchema: imageSchema,
        mode: "onBlur"
    });

    const { isSubmitting } = formState;


    return(
            <div>
                <p className='f3'>
                    {'This magic brain will detect faces in your pictures. Give it a try'}
                </p>
                {error && <p className="error f4">{error}</p>} 
                {errors.url && <p className="error f4">{errors.url.message}</p>} 
                <div className='center'>
                    <div className='form center pa4 br3 shadow-5'>
                        <input className='f4 pa2 w-70 center' type='text' 
                        onChange={onInputChange} name="url" ref={register} />
                        <button className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple' 
                        onClick={handleSubmit(onButtonSubmit)} disabled={isSubmitting} >Detect</button>
                    </div>
                </div>   
            </div>
    );
}

export default ImageLinkForm;