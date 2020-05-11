import React from 'react';
import './FaceRecognition.css'


const FaceRecognition = ({ image, boxes }) => {

    const faceBoxes = constructBoxes(boxes); 

    return(
            <div id='imageContainer' className='center ma mt2'>   
                 
                {image.url && <img id='inputImage' alt='userImage' src={image.url} width='500px' height='auto'></img>}
                <div className='absolute' style ={{'width':'500px', 'height': image.height}}> 
                    {faceBoxes}
                </div>    
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


