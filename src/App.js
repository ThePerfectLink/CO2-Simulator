//import logo from './logo.svg';
import './App.css';
import { Columns } from './components/Columns.js';
import React, {useState, useRef} from 'react';

function App(props) {
  const [dimensions, setDimensions] = React.useState({ 
    height: window.height,
    width: window.width
  })

  
  React.useEffect(() => {
    function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      })
    
  }
    window.addEventListener('resize', handleResize)
    return _ => {
      window.removeEventListener('resize', handleResize)
    
    }
  })

  const navBar = useRef(null);
  const [frame, setFrame] = useState(0);
  const [key, setKey] = useState(0);
  const playing = useRef(null);
  const animation = useRef(null);

  var conf = {
    data: props.props.arr,
    highest: props.props.highest,
    current: key,
    width: window.innerWidth*1,
    height: window.innerHeight*.4,
  }
  
  const updateFrame = (frame) => {
    const inputElement = navBar.current;
    inputElement.value = frame;
    setFrame(frame)
  }

  const aheadOne = () => {
    playing.current = false;
    cancelAnimationFrame(animation.current)
    if(key < 347) {
      setKey(prevKey => prevKey + 1);
      updateFrame(key);
    } else {
      beginning();
    }
  };
  const backOne = () => {
    playing.current = false;
    cancelAnimationFrame(animation.current)
    if(key > 0) {
      setKey(prevKey => prevKey - 1);
      updateFrame(key);
    }
    console.log(dimensions)
  };
  const beginning = () => {
    playing.current = false;
    cancelAnimationFrame(animation.current)
    setKey(0);
    updateFrame(0);
  };
  const end = () => {
    playing.current = false;
    cancelAnimationFrame(animation.current)
    setKey(347);
    updateFrame(347);
  };
  const play = () => {
    cancelAnimationFrame(animation.current)
    if(!playing.current) {
      playing.current = true;
      animate(key);
    } else {
      playing.current = false;
    }
  };
  const animate = (currentKey) => {
    if(currentKey < 347) {
      animation.current = requestAnimationFrame(() => {
        setKey(prevKey => prevKey + 1);
        updateFrame(currentKey+1);
        animate(currentKey+1);
      });
    } else {
      animation.current = requestAnimationFrame(() => {
        setKey(0);
        updateFrame(0);
        animate(0);
      });
    }
  }


  return (
    <div className="App">
      <header className="App-header">
        <Columns
          props = {conf}
        />
        <div id="extras">
          <div id="controls">
            <label> time: {conf.data[frame][0].id}</label>
            <input id="nav" type="range" min="0" max="347" defaultValue="0" ref={navBar} onChange={ (value) => {
                playing.current = false;
                updateFrame(parseInt(value.target.value))
                cancelAnimationFrame(animation.current)
                setKey(parseInt(value.target.value));
            }}/>
            <button onClick={
              beginning
            }> {"∣≪"} </button>
            <button onClick={
              backOne
            }> {"≺"} </button>
            <button onClick={
              play
            }> {"▶∣∣"} </button>
            <button onClick={
              aheadOne
            }> {"≻"} </button>
            <button onClick={
              end
            }> {"≫∣"} </button>
          </div> 
        </div>
      </header>
    </div>
  );
}

export default App;
