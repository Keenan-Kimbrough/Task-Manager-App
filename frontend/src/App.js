
import './App.css';
import React, {Component} from 'react'
import CustomModal from './components/Modal'
import axios from 'axios';
import { toHaveAccessibleDescription } from '@testing-library/jest-dom/dist/matchers';


const tasks = [
 {
  id: 1,
  title: "weekly reports",
  description: " sending the weekly report for overdue invoices.",
  completed: false
 }

]
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      modal:true,
        viewCompleted:true,
        taskList:tasks,
        activeItem: {
          title: "",
          description: "",
          completed: false
        },
        todoList:[]
    }
  }

  componentDidMount(){
    this.refreshList();

  }
  refreshList = () => {
    axios
    .get("http://localhost:8000/api/tasks/")
    .then((response) => {this.setState({todoList: response.data})}).catch((error) => {
      console.log(error)
    })
  
  }
  
  toggle = () => {
    this.setState({ modal:!this.state.modal});

  }
  handleSubmit = item => {
    this.toggle()
   
    if (item.id){
      axios.put(`http://localhost:8000/api/tasks/${parseInt(item.id)}/`, item)
      .then(res => this.refreshList())
    }
    axios.post("http://localhost:8000/api/tasks/", item).then(
      res => this.refreshList()
    )
  }

  handleDelete = item => {
    console.log(`${item.id}`)
    axios.delete(`http://localhost:8000/api/tasks/${item.id}/`)
      .then(res => this.refreshList())
  }
  createItem = () => {
    const item = {title: "", modal: !this.state.modal};
    this.setState({activeItem: item, modal:!this.state.modal})
  }

  editItem = item => {

    this.setState({ activeItem: item, modal: !this.state.modal});
  }

  displayCompleted = status =>{
    if(status){
      return this.setState({viewCompleted: true})
    }
    return this.setState({viewCompleted:false});

  }

  renderTablist = () => {
    return (
     <div className="my-5 tab-list">
      <span
      onClick={() => this.displayCompleted(true)}
      className ={this.state.viewCompleted ? "active" : ""}
      >
        Completed
      </span>
      <span 
      onClick={() => this.displayCompleted(false)}
      className={this.state.viewCompleted ? "" : "active"}
      >
        Incompleted
      </span>
     </div>
    )
  }
 // rendering items in list
  //completed or incompleted

  renderItems = () => {
    const {viewCompleted} = this.state;
    const newItems = this.state.todoList.filter(
      item => item.completed == viewCompleted
    );
  return newItems.map((item) => (
      <li key={item.id}
      className="list-group-items d-flex justify-content-between align-items-center">
        <span className={`todo-title mr-2 ${this.state.viewCompleted ? "completed-todo" : ""}`}>
          {item.title}

        </span>
        <span>
          <button className="btn btn-info mr-2" onClick={this.editItem}> Edit</button>
          <button className= "btn btn-danger mr-2" onClick={() => this.handleDelete(item)}>Delete</button>
        </span>
      </li>
    )
  );

  }


render() {
  return (
    <main className ="content p-3 mb-2 bg-info">
      <h1 className="text-black text-uppercase text-center my-4"> Task Manager</h1>
      <div className="row">
        <div className="col-md-6 col-sma-10 mx-auto p-0">
          <div className="card p-3">
            <div>
              <button className="btn btn-warning"> Add Task</button>
            
            </div>
            {this.renderTablist()}
            <ul className ="list-group list-group-flush">
              {this.renderItems()}
            </ul>
          </div>
        </div>
      </div>
    
      <footer className="my-3 mb-2 bg-info text-white text-center"> Copyright 2021 &copy; All rights Rights Reserved</footer>
    {this.state.modal ? (<CustomModal activeItem={this.state.activeItem} toggle={this.toggle}
    onSave={this.handleSubmit}/>): null}
    </main>
  )
}

}

export default App;
