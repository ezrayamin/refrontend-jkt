import React from 'react'
import Axios from 'axios'
import {
Button,
Table,
InputGroup,
FormControl,
Form,
FormGroup,
Modal
} from 'react-bootstrap'

class Products extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            products: [],
            newQty: null,
            newName: '',
            newPrice: null,
            newCate: '',
            editIndex: null,
            // addIndex: null,
            confDelete: [false, ""],
            stockModal: [false, ""]
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

    handleAdd = () => {
        let name = this.refs.addName.value
        let stock = parseInt(this.refs.addStock.value)
        let category = this.refs.addCate.value
        let price = parseInt(this.refs.addPrice.value)
        let date = this.refs.addDate.value
        let tanggal = Date.now().toString()
        console.log(name, stock, category, price, tanggal, date)

        if (!name || !stock || !category || !price || stock === 0 || price === 0) return this.setState({stockModal: [true, "Input all forms, stock&price could not be 0"]})
        
        Axios.post('http://localhost:2000/products', {
            date: date,
            name: name,
            serial: tanggal.slice(6),
            stock: stock,
            category: category,
            price: price,
            status: "available"
        })
            .then((res) => {
                console.log(res.data)
                Axios.get('http://localhost:2000/products')
                    .then((res) => console.log(res.data))
                    .catch((err) => console.log(err))
                this.setState({wrongAdd: [false, ""]})
                this.refs.addName.value = ""
                this.refs.addStock.value = ""
                this.refs.addPrice.value = ""
                
            })
            .catch((err) => console.log(err))
    }

    handleDelete = (index) => {
        Axios.patch(`http://localhost:2000/products?id=${index+1}`, {status: "non-available"})
            .then((res) => {
                console.log(index+1)
                console.log(res.data)

                Axios.get('http://localhost:2000/products')
                    .then((res) => console.log(res.data))
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    }

    handleSave = (index) => {
        const {newName, newCate, newPrice, newQty} = this.state
        let name = this.refs.newName.value
        // let stock = parseInt(this.refs.newQty.value)
        let category = this.refs.newCate.value
        let price = parseInt(this.refs.newPrice.value)
        let baru = {
            name: name,
            category: category,
            price: price,
        }
        let temp = this.state.products[index]
        console.log(temp)
        let ganti = Object.assign(temp, baru)
        console.log(ganti)
        
        this.state.products.splice(index, 1, ganti)
    }

    handleMinus = () => {
        this.setState({ newQty: this.state.newQty - 1 })
    }

    handlePlus = () => {
        this.setState({newQty: this.state.newQty + 1 })
    }
    
    // changeQty = (e) => {
    //     this.setState({ newQty: e.target.value })
    // }
       

    renderTHead = () => {
        return (
            <thead style={{ textAlign: "center" }}>
                <tr>
                    <th>Num</th>
                    <th>Tanggal</th>
                    <th>Nama Produk</th>
                    <th>SN</th>
                    <th>Stock</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Action</th>
                </tr>
            </thead>
        )
    }

    renderTBody=() => {
        const {newName, newPrice, newQty, newCate, editIndex, products} = this.state
        return (
            <tbody>

                {/* DIFILTER TUNJUKIN YANG AVAILABLE AJA */}
                {products.map((item, index) => {
                    if (editIndex === index) {
                        return (
                            <tr key={index}>
                                <td>{index+1}</td>
                                <td></td>
                                <td>
                                    <Form.Control style={{ width: '100px' }}/>
                                </td>
                                <td></td>
                                <td style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Button onClick={this.handleMinus} disabled={newQty <= 0 ? true : false}>
                                            <b>-</b>
                                        </Button>
                                        {newQty}
                                        <Button onClick={this.handlePlus}>
                                            <b>+</b>
                                        </Button>
                                </td>
                                <td>
                                    <Form.Control size="sm" as="select" ref="newCate">
                                        <option>electronic</option>
                                        <option>handphone</option>
                                        <option>furniture</option>
                                        <option>beauty</option>
                                        <option>fashion</option>
                                        <option>food and drink</option>
                                    </Form.Control>
                                </td>
                                <td><Form.Control style={{ width: '100px' }}/></td>
                                <td>
                                    <Button onClick={() => this.handleSave(index)}>Save</Button>
                                    <Button onClick={() => this.setState({ editIndex: null })}>Cancel</Button>
                                </td>
                            </tr>
                        )
                    }
                    return (
                        <tr key={index}>
                            <td>{index+1}</td>
                            <td>{item.date}</td>
                            <td>{item.name}</td>
                            <td>{item.serial}</td>
                            <td>{item.stock}</td>
                            <td>{item.category}</td>
                            <td>{item.price}</td>
                            <td>
                                <Button onClick={() => this.setState({ editIndex: index, newQty: item.stock, newName: item.name,  newPrice: item.price  })}>Edit</Button>
                                <Button onClick={() => this.handleDelete(index)}>Delete</Button>
                            </td>
                        </tr>
                    )
                })}
                <tr key={products.length}>
                    <td>#</td>
                    <td>
                    <FormGroup controlId="date" bsSize="large">
                        <FormControl
                            type="date"
                            style={{width:'100%'}}
                            ref="addDate"
                        />
                        </FormGroup>
                    </td>
                    <td>
                        <InputGroup>
                            <FormControl
                                placeholder="Name"
                                aria-label="Name"
                                aria-describedby="basic-addon1"
                                style={{ height: "45px", width: "250px" }}
                                ref="addName"
                            />
                        </InputGroup>
                    </td>
                    <td>serial</td>
                    <td>
                    <InputGroup>
                        <FormControl
                            placeholder="Stock"
                            aria-label="Stock"
                            aria-describedby="basic-addon1"
                            style={{ height: "45px", width: "250px" }}
                            ref="addStock"
                        />
                    </InputGroup>
                    </td>
                    <td>
                    <InputGroup>
                    <Form.Control size="sm" as="select" ref="addCate">
                        <option>electronic</option>
                        <option>handphone</option>
                        <option>furniture</option>
                        <option>beauty</option>
                        <option>fashion</option>
                        <option>food and drink</option>
                    </Form.Control>   
                    </InputGroup>
                    </td>
                    <td>
                    <InputGroup>
                            <FormControl
                                placeholder="Price"
                                aria-label="Price"
                                aria-describedby="basic-addon1"
                                style={{ height: "45px", width: "250px" }}
                                ref="addPrice"
                            />
                    </InputGroup>
                    </td>
                    <td>
                        <Button onClick={this.handleAdd}>Add</Button>
                    </td>
                </tr>
            </tbody>
        )
    }
    render() {
        const {confDelete, stockModal} = this.state
        return (
            <div>
                <div>
                    <h1>Product Table</h1>
                    <Table>
                    {this.renderTHead()}
                    {this.renderTBody()}
                    </Table>
                </div>
                {/* <Modal show={confDelete[0]} onHide={() => this.setState({ confDelete: [false, ""] })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Error!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure?</Modal.Body>
                    <Modal.Footer>
                        <Button style={{backgroundColor: 'red'}}>
                            Delete
                        </Button>
                        <Button variant="secondary" onClick={() => this.setState({ confDelete: [false, ""]  })}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal> */}
                <Modal show={stockModal[0]} onHide={() => this.setState({ stockModal: [false, ""] })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Warning</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{stockModal[1]}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ stockModal: [false, ""]  })}>
                            Okay
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}
export default Products