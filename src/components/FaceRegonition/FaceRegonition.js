import React from 'react';


const FaceRegonition = ({ imageUrl }) => {
    return(
            <div className='center ma'>   
                <div className='absolute mt2'>
                    <img alt='userImage' src={imageUrl} width='500px' height='auto'></img>
                </div>
            </div>
    );
}

export default FaceRegonition;