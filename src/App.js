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
import header from 'basic-auth-header';

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
  },
  error: ''
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

  displayFaceBox = (boxes) => {
    this.setState({ boxes: boxes })
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value});
  }
  

  onButtonSubmit = async () => {
    this.setState({ 
      imageUrl: this.state.input,
      boxes: [],
      error: ''
    });

    const { user } = this.state;

    await fetch(smartBrainApiUrl+'/image', {
      method: 'post',
      headers: this.createHeader(user),
      body: JSON.stringify({
          url: this.state.input
      })
    })
    .then(this.handleErrors)
    .then( res => res.json())
    .then(json => {
      if(json){
        this.updateProfile();
      }
      this.displayFaceBox(this.calculateFaceLocation(json));
    })
    .catch(err => {
      console.log(err);
      this.setState({error: err.message});
    });
  }

  updateProfile = () => {
    const { user } = this.state;
    fetch(smartBrainApiUrl +'/user/entries', {
            method: 'put',
            headers: this.createHeader(user),
            body: JSON.stringify({
                id: this.state.user.id
            })
          })
          .then(this.handleErrors)
          .then( res => res.json())
          .then(updatedUser => {
            this.setState({
              user: {
                ...this.state.user,
                entries : updatedUser.entries
              } 
            });
          })
          .catch(err => {
            console.log(err);
            this.setState({error: err.message});
          });
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



  createHeader(user) {
    return {
      'content-type': 'application/json',
      'Authorization': header(user.email, user.password)
    };
  }

  handleErrors(response) {
      if (!response.ok) {
          throw Error(response.statusText);
      }
      return response;
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
    const { isSignedIn, imageUrl, route, boxes, user, error } = this.state;
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
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} error={error}/> 
              <FaceRecognition imageUrl={imageUrl} boxes={boxes} />
            </div>
          : (
              (route === 'signin' || route === 'signout')
              ? <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
              : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
            )
        }
        <div>
          <footer>
            <p>Copyright &copy; Robin Joshua {new Date().getFullYear()}</p>
          </footer>
        </div>
      </div>

    )
  }

  
}

export default App;
