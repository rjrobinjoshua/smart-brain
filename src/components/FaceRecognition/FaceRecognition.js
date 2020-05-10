import React from 'react';
import './FaceRecognition.css'


const FaceRecognition = ({ imageUrl, boxes }) => {

    const faceBoxes = constructBoxes(boxes); 

    return(
            <div className='center ma'>   
                    <img id='inputImage' alt='userImage' src={imageUrl} width='500px' height='auto'></img>
                    {faceBoxes}
            </div>
    );
}

function constructBoxes(boxes) {
    const faceBoxes = [];
    for (const box of boxes) {
        faceBoxes.push(<div key={faceBoxes.length} className='bounding-box' style={{ top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol }}>
        </div>);
    }
    return faceBoxes;
}

export default FaceRecognition;


