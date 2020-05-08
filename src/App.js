import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';

const smartBrainApiUrl = process.env.REACT_APP_SMART_BRAIN_API_URL;

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


const initialState = {
  input: '',
  imageUrl:'',
  boxes: [],
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
class App extends Component {


  constructor(){
    super();
    this.state = initialState;
  }

  loadUser = (currentUser) => {
    this.setState({
      user: currentUser
    })
  }

  calculateFaceLocation = (data) => {
    const faces = data.outputs[0].data.regions;
    
    return faces.map(region => 
            this.caculateBox(region.region_info.bounding_box)); 
  }

  dsiplayFaceBox = (boxes) => {
    console.log(boxes);
    this.setState({ boxes: boxes })
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value});
  }
  

  onButtonSubmit = () => {
    this.setState({ 
      imageUrl: this.state.input,
      boxes: []
    });

    fetch(smartBrainApiUrl+'/image', {
      method: 'post',
      headers: {'content-type': 'application/json' },
      body: JSON.stringify({
          url: this.state.input
      })
    })
    .then( res => res.json())
    .then(json => {
      if(json){
        this.updateProfile();
      }
      this.dsiplayFaceBox(this.calculateFaceLocation(json));
    })
  }

  updateProfile = () => {
    fetch(smartBrainApiUrl +'/user/entries', {
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
          .catch(console.log);
  }

  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState(initialState);
    }
    else if (route === 'home') {
      this.setState({ isSignedIn: true});
    }
    this.setState({ route: route});
  }


  caculateBox(clarifaiFace) {
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    };
  }

  render() {
    const { isSignedIn, imageUrl, route, boxes, user } = this.state;
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
              <FaceRecognition imageUrl={imageUrl} boxes={boxes}/>
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
