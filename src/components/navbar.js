import React from "react";
import Axios from 'axios'

// import component react-bootstrap
import { Nav, Navbar} from "react-bootstrap"

class Navigation extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          products: []
        }
    }

    componentDidMount() {
      Axios.get('http://localhost:2000/products')
          .then((res) => {
              console.log(res.data)
              this.setState({products: res.data})
          })
          .catch((err) => console.log(err))
    }
    render() {
        return (
          <Navbar
            style={{ backgroundColor: "#0C405E", height: "60px" }}
            expand="lg"
            fixed='top'
          >
              <Navbar.brand>
                  <strong>Admin</strong>
              </Navbar.brand>
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                  total: {this.state.products.length}
                </Nav>
              </Navbar.Collapse>
          </Navbar>
        )
        }
}
export default Navigation