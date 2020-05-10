import React from 'react';
import './FaceRecognition.css'


const FaceRecognition = ({ imageUrl, boxes }) => {

    const faceBoxes = constructBoxes(boxes); 

    return(
            <div id='imageContainer' className='center ma'>   
                <div className='absolute mt2'>
                    {imageUrl && <img id='inputImage' alt='userImage' src={imageUrl} width='500px' height='auto'></img>}
                    {adjustHeight()}
                    {faceBoxes}
                </div>    
            </div>
    );
    
}

// manually need to adjust the container height as the img position is absolute and reuired for clarifai boundary boxes
const adjustHeight = () => {
    const image = document.getElementById('inputImage');
    if(image) {
        const height = Number(image.height);
        const imageContainer = document.getElementById('imageContainer');
        imageContainer.style.height= height +'px';
    }
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


