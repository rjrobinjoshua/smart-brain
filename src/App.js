import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import Clarifai  from 'clarifai';
import FaceRegonition from './components/FaceRegonition/FaceRegonition';

const particleOptions = {
  particles: {
    number : {
      value: 50,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const app = new Clarifai.App({
  apiKey: 'bd170755251e41b8b203d1e15a989e67'
 });

class App extends Component {


  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl:''
    }
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value});
  }
  

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input});

    app.models.predict(
      Clarifai.FACE_DETECT_MODEL, this.state.input).then(
      function(response) {
        console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
      },
      function(err) {
        console.log(err);
      }
    );
  }


  render() {
    return(
      <div className="App">
        <Particles className='particles'
            params={particleOptions}
          />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/> 
        <FaceRegonition imageUrl={this.state.imageUrl}/>
      </div>

    )
  }

  
}

export default App;
