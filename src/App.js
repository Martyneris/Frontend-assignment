import React, { Component } from 'react';
import './App.css';
const axios = require ('axios'); // install with "npm i axios"


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      payments: [],
      gingerMerchantItems : [],
      value: 'creditcard',
      optionValueItemsServer: [],
      optionValueItemsClient: [],
      allItems : [],
      id: '',
      method: '',
      amount: '',
      currency: '',
      status: '',
      merchant: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.getPromise = this.getPromise.bind(this);
    this.getBiggestPayments = this.getBiggestPayments.bind(this);
    this.getData = this.getData.bind(this);
    this.showAllItems = this.showAllItems.bind(this);
  };

  // retrieving information and storing it into state for later use of client side sorting/filtering
  componentDidMount=()=>{
    axios.get('db.json').then(
      response => this.setState({ data : response.data }),
      error => console.log(error)
    )
  };

  // creating a get function with callback inside, which will later sort out 20 biggest payments from response data
  getData =() =>{
    axios.get('db.json').then(
      response => this.getBiggestPayments(response.data.payments),
      error=> (console.log(error))
    )
  };
 // callback function
  getBiggestPayments = (data) => {
    let biggest20payments = [];

    function compareNumbers(a, b) {
      return b.amount - a.amount;
    };

    for (let i = 0; i < 20; i++) {
      let sortedPayments = data.sort(compareNumbers)
      biggest20payments.push(sortedPayments[i])
    };
    
    this.setState({ payments: biggest20payments })
    this.setState({ gingerMerchantItems : [] })
    this.setState({ optionValueItemsServer : [] })
    this.setState({ optionValueItemsClient : [] })
    this.setState({ allItems : []})
  };

  // promise function for retrieving all "Ginger" merchant items
  getPromise = () => {
    let promise = new Promise(function(resolve, reject) {
    resolve(axios.get('db.json')); 
    });
    promise.then(
      result => this.setState({ gingerMerchantItems : result.data.payments.filter(obj => {return obj.merchant === "Ginger"})}),
      error => alert(error)
    ).then(
      this.setState({ payments : []}),
      this.setState({ optionValueItemsServer : [] }),
      this.setState({ optionValueItemsClient : [] }),
      this.setState({ allItems : []})
    )
  };

  // retrieving and filtering data according to chosen option value. Data is received with get promise from server side
  getOptionValueItemsServerSide = () => {
    let promise = new Promise(function(resolve, reject) {
    resolve(axios.get('db.json')); 
    });
    promise.then(
      result => this.setState({ optionValueItemsServer : result.data.payments.filter(obj => {return obj.method === this.state.value})}),
      error => alert(error)
    ).then(
      this.setState({ payments : []}),
      this.setState({ gingerMerchantItems : [] }),
      this.setState({ allItems : []}),
      this.setState({ optionValueItemsClient : [] })
    )
  };

  getOptionValueItemsClientSide = () => {
    this.setState({ optionValueItemsClient : this.state.data.payments.filter(obj => {return obj.method === this.state.value})});

    this.setState({ payments : []});
    this.setState({ gingerMerchantItems : [] });
    this.setState({ optionValueItemsServer : [] });
    this.setState({ allItems : []})
  };

  showAllItems = () => {
    axios.get('db.json').then(
      response => this.setState({ allItems : response.data.payments }),
      error=> (console.log(error))
    )
    this.setState({ payments: [] });
    this.setState({ gingerMerchantItems : [] });
    this.setState({ optionValueItemsServer : [] });
    this.setState({ optionValueItemsClient : [] });
  };

  // callback for posting new item to DB
  addNewDBItem = (formData) =>{
    axios.post(/* appropriate url needed here*/ {
          id: formData.id,
          method: formData.method,
          amount: formData.amount,
          currency: formData.currency,
          status: formData.status,
          merchant: formData.merchant
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        })
        .then(
          alert('item successfully added to DB')
        )
  }

  // creating new form for submitting new item to DB
  createDBItem = () => {
    const formData = new FormData();    // creating new formdata object
    formData.append('id', this.state.data.payments.length + 1); // adding form values
    formData.append('method', this.state.method);
    formData.append('amount', this.props.amount);
    formData.append('currency', this.state.currency);  
    formData.append('status', this.state.status);  
    formData.append('merchant', this.state.merchant);
    // passing new formData to callback post function
    this.addNewDBItem(formData);
    // nulling state form values after posting
    this.setState({ id: '', method: '', amount: '',currency: '',status: '',merchant: '' })
};

// handler function for option value tracking
handleChange = (e) => {
  this.setState({ [e.target.name]: e.target.value })
};

  render() {

    const payments = this.state.payments.map((payment, i) => {
      return (
        <tr key={i}>
          <td>{payment.id}</td>
          <td>{payment.method}</td>
          <td>{payment.amount}</td>
          <td>{payment.created}</td>
          <td>{payment.status}</td>
          <td>{payment.merchant}</td>
        </tr>
      )
    });

    const gingerItems = this.state.gingerMerchantItems.map((item,i)=>{
      return(
        <tr key={i}>
          <td>{item.id}</td>
          <td>{item.method}</td>
          <td>{item.amount}</td>
          <td>{item.created}</td>
          <td>{item.status}</td>
          <td>{item.merchant}</td>
        </tr>
      )
    });

    const optionValueItemsServer = this.state.optionValueItemsServer.map((item,i)=>{
      return(
        <tr key={i}>
          <td>{item.id}</td>
          <td>{item.method}</td>
          <td>{item.amount}</td>
          <td>{item.created}</td>
          <td>{item.status}</td>
          <td>{item.merchant}</td>
        </tr>
      )
    });

    const optionValueItemsClient = this.state.optionValueItemsClient.map((item,i)=>{
      return(
        <tr key={i}>
          <td>{item.id}</td>
          <td>{item.method}</td>
          <td>{item.amount}</td>
          <td>{item.created}</td>
          <td>{item.status}</td>
          <td>{item.merchant}</td>
        </tr>
      )
    });

    const allItems = this.state.allItems.map((item,i)=>{
      return(
        <tr key={i}>
          <td>{item.id}</td>
          <td>{item.method}</td>
          <td>{item.amount}</td>
          <td>{item.created}</td>
          <td>{item.status}</td>
          <td>{item.merchant}</td>
        </tr>
      )
    })

    return (
      <div class="container">
        <div class="col-md-2 col-xs-12">
          <button class="btn btn-md btn-primary col-xs-12 menu-button callback-btn" onClick={this.getData}>Callback
        </button>
          <button class="btn btn-md btn-primary col-xs-12 menu-button promise-btn" onClick={this.getPromise}>Promise
        </button>
          <div class="row">
            <div class="col-xs-12">
              <br />
              <select class="col-xs-12 menu-button method-select" name={'value'} value={this.state.value} onChange={this.handleChange}>
                <option value="creditcard">Credit card</option>
                <option value="ideal">iDeal</option>
                <option value="bank-transfer">Bank transfer</option>
              </select>
              <button class="btn btn-md btn-primary col-xs-12 filter-btn menu-button" onClick={this.getOptionValueItemsServerSide}>Filter Payment-Method (server)
                </button>
              <button class="btn btn-md btn-primary col-xs-12 filter-client-btn" onClick={this.getOptionValueItemsClientSide}>Filter Method (client)
                </button>
            </div>
          </div>
          <br />
          <button class="btn btn-md btn-primary col-xs-12 menu-button add-btn"
            data-toggle="modal" data-target="#newPaymentModal">Add payment
        </button>
          <button class="btn btn-md btn-primary col-xs-12 menu-button show-all" onClick={this.showAllItems}>Show all
        </button>
        </div>
        <div class="col-md-10 col-xs-12">
          <table class="table table-bordered table-striped">

            <thead>
              <tr>
                <th>#</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Date created</th>
                <th>Status</th>
                <th>Merchant</th>
              </tr>
            </thead>
            <tbody>
              {payments}
              {gingerItems}
              {optionValueItemsServer}
              {optionValueItemsClient}
              {allItems}
            </tbody>
          </table>
        </div>
        <div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="modalTitle" id="newPaymentModal"
          bootstrap-modal>
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                  aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="modalTitle">Add new payment</h4>
              </div>
              <div class="modal-body">
                <form novalidate name="newPaymentForm">
                  <div class="form-group">
                    <label for="paymentMethod">Method</label>
                    <select class="form-control" id="paymentMethod" name="method" onChange={this.handleChange}
                      required>
                      <option value="creditcard">Credit card</option>
                      <option value="ideal">iDeal</option>
                      <option value="bank-transfer">Bank transfer</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="paymentAmount">Amount (in cents)</label>
                    <input type="number" class="form-control" id="paymentAmount" name="amount"
                      required />
                  </div>
                  <div class="form-group">
                    <label for="paymentCurrency">Currency</label>
                    <select class="form-control" id="paymentCurrency" name="currency" onChange={this.handleChange}
                      required>
                      <option value="GBP">GBP</option>
                      <option value="AUD">AUD</option>
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="paymentStatus">Status</label>
                    <select class="form-control" id="paymentStatus" name="status" onChange={this.handleChange}
                      required>
                      <option value="denied">Denied</option>
                      <option value="accepted">Accepted</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="paymentMerchant">Merchant</label>
                    <input type="text" class="form-control" id="paymentMerchant" name="merchant"
                      required />
                  </div>
                  <input type="submit" class="btn btn-md btn-primary"
                    value="Save" /*onClick={this.createDBItem} */ />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
