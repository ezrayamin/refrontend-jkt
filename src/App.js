import React from 'react'
import Axios from 'axios'
import {
    Route, Switch
} from 'react-router-dom'
// import Navigation from './components/navbar'
import Products from './page/products'

class App extends React.Component {
   render() {
       return (
           <div>
               {/* <Navigation/> */}
               <Switch>
                   <Route path ='/' component={Products} exact/>
                </Switch>
           </div>
           
       )
   } 
}

export default App