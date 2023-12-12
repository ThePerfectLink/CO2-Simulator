import './App.css';
import { Columns } from './components/Columns.js';
import React, {useState, useRef, useEffect} from 'react';


/**
 * Main component of app, contains function for controlling animation
 * @param {Object} props contains data and highest concentration
 * @returns all elements in the webpage
 */
function App(props) {
  const [dimensions, setDimensions] = React.useState({ 
    height: window.height,
    width: window.width
  });
  const navBar = useRef(null);
  const [frame, setFrame] = useState(0);
  const [key, setKey] = useState(0);
  const [fpsState, setFpsState] = useState(30);
  const playing = useRef(null);
  const animation = useRef(null);
  const latestFPS = useRef(fpsState);
  const latestKey = useRef(key);
  var start, now, elapsed, fpsInterval;
  

  var conf = {
    data: props.props.arr,
    highest: props.props.highest,
    current: key,
    width: window.innerWidth*1,
    height: window.innerHeight*.4,
  }

  useEffect(() => {
    latestFPS.current = fpsState;
    latestKey.current = key;
  })
  /**
   * Detects DOM changes and sets new detected dimensions
   */
  useEffect(() => {
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
  /**
   * Sets integer as navBar value
   * @param {Number} frame takes an integer as a frame index
   */
  const updateFrame = (frame) => {
    const inputElement = navBar.current;
    inputElement.value = frame;
    setFrame(frame)
  }
  /**
   * Steps one frame forward
   */
  const aheadOne = () => {
    playing.current = false;
    cancelAnimationFrame(animation.current)
    if(key < conf.data.length - 1) {
      increaseKey();
      updateFrame(key);
    } else {
      beginning();
    }
  };

  /**
   * Steps one frame back
   */
  const backOne = () => {
    playing.current = false;
    cancelAnimationFrame(animation.current)
    if(key > 0) {
      setKey(prevKey => prevKey - 1);
      updateFrame(key);
    }
    console.log(dimensions)
  };

  /**
   * Returns to first frame
   */
  const beginning = () => {
    playing.current = false;
    cancelAnimationFrame(animation.current)
    setKey(0);
    updateFrame(0);
  };

  /**
   * Goes to final frame
   */
  const end = () => {
    playing.current = false;
    cancelAnimationFrame(animation.current)
    setKey(conf.data.length-1);
    updateFrame(conf.data.length-1);
  };

  /**
   * Progresses through all frames and repeats upon hitting the end.
   * Frames progress at fastest possible animation rate.
   */
  const play = () => {
    cancelAnimationFrame(animation.current)
    if(!playing.current) {
      playing.current = true;
      start = Date.now()
      animate();
    } else {
      playing.current = false;
    }
  };

  const increaseKey = () => {
    const inputElement = navBar.current;
    inputElement.value = frame;
    setKey(prevKey => prevKey + 1);
  }

  const increaseFPS = () => {
    setFpsState(prevFPS => prevFPS + 5);
  }

  const lowerFPS = () => {
    setFpsState(prevFPS => prevFPS - 5);
  }

  /**
   * Main animation loop. This takes the current frame and adds one. From there 
   * it updates the DOM and calls the next animation loop.
   * @param {Number} currentKey 
   */
  const animate = () => {
    fpsInterval = 1000/latestFPS.current;
    animation.current = requestAnimationFrame(() => {
      animate();
      now = Date.now()
      elapsed = now-start
      if(latestKey.current < conf.data.length - 2) {
        if (elapsed > fpsInterval) {
          increaseKey()
          updateFrame(latestKey.current+1);
          start = now - (elapsed % fpsInterval);
        }
      } else {
        if (elapsed > fpsInterval) {
          setKey(0);
          updateFrame(0);
          start = now - (elapsed % fpsInterval);
        }
      }
    });
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
            <div id="speed">
              <button onClick={() => {
                if(fpsState < 30) {
                  increaseFPS()
                }  
              }}> ^ </button>
              <button onClick={() => {
                if(fpsState > 5) {
                  lowerFPS()
                }  
              }}> v </button>
              <p> {(fpsState/15).toFixed(2)}X </p>
            </div>
          </div> 
        </div>
      </header>
    </div>
  );
}

export default App;
