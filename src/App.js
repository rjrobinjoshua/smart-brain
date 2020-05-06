import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import Clarifai  from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';

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
      imageUrl:'',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user:  {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (currentUser) => {
    this.setState({
      user: currentUser
    })
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width =  Number(image.width);
    const height = Number(image.height);
    
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow : height - (clarifaiFace.bottom_row * height)
    }
  
  }

  dsiplayFaceBox = (box) => {
    this.setState({ box: box })
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value});
  }
  

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input});

    app.models.predict(
      Clarifai.FACE_DETECT_MODEL, this.state.input)
        .then( response => {
          if(response){
              this.updateProfile();
          }
          this.dsiplayFaceBox(this.calculateFaceLocation(response));
        })
        .catch(err => console.log(err));
  }

  updateProfile = () => {
    fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'content-type': 'application/json' },
            body: JSON.stringify({
                id: this.state.user.id
            })
          })
          .then( res => res.json())
          .then(updatedUser => {
            this.setState({ user: updatedUser});
          })
  }

  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState({ isSignedIn: false});
    }
    else if (route === 'home') {
      this.setState({ isSignedIn: true});
    }
    this.setState({ route: route});
  }


  render() {
    const { isSignedIn, imageUrl, route, box, user } = this.state;
    return(
      <div className="App">
        <Particles className='particles'
            params={particleOptions}
          />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        { route === 'home'
          ? <div> 
              <Logo />
              <Rank user={user} />
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/> 
              <FaceRecognition imageUrl={imageUrl} box={box}/>
            </div>
          : (
              (route === 'signin' || route === 'signout')
              ? <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
              : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
            )
        }
      </div>

    )
  }

  
}

export default App;
