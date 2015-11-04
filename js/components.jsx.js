(function (React, ReactRouter, Reflux, TodoActions, todoListStore) {
  'use strict';

  var TodoHeader = React.createClass({
    addItem: function (e) {
      if (e.which === 13) {
        var text = e.target.value;

        if (text) {
          TodoActions.addItem(text);
          e.target.value = '';
        }
      }
    },

    render: function () {
      return (
        <header>
          <h2 className='text-center'>ToDos</h2>
          <input className='form-control' autoFocus placeholder='What do you want to do?' onKeyUp={this.addItem}/>
        </header>
      );
    }
  });

  var TodoFooter = React.createClass({
    propTypes: {
      list: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
    },

    itemLeft: function () {
      return this.props.list.filter(function (item) {
        return !item.isCompleted;
      }).length
    },

    clearCompleted: function () {
      TodoActions.clearCompleted();
    },

    render: function () {
      var itemLeft       = this.itemLeft(),
          itemCompleted  = this.props.list.length - itemLeft,
          label          = itemLeft === 1 ? 'item left' : 'items left',
          clearCompleted = itemCompleted > 0 ? <button className='btn btn-danger btn-xs' onClick={this.clearCompleted}>Clear completed ({itemCompleted})</button> : '';

      return (
        <footer>
          <div className='row row-fluid'>
            <div className='col-sm-3'>
              {itemLeft} {label}
            </div>
            <div className='col-sm-6 text-center'>
              <ul className="nav nav-pills">
                <li>
                  <ReactRouter.Link activeClassName="text-success" to="All">All</ReactRouter.Link>
                </li>
                <li>
                  <ReactRouter.Link activeClassName="text-success" to="Active">Active</ReactRouter.Link>
                </li>
                <li>
                  <ReactRouter.Link activeClassName="text-success" to="Completed">Completed</ReactRouter.Link>
                </li>
              </ul>
            </div>
            <div className='col-sm-3'>
              {clearCompleted}
            </div>
          </div>
        </footer>
      );
    }
  });

  var TodoItem = React.createClass({
    propTypes: {
      todoItem: React.PropTypes.object
    },

    handleToggle: function () {
      TodoActions.toggleItem(this.props.todoItem.id);
    },

    removeItem: function () {
      TodoActions.removeItem(this.props.todoItem.id);
    },

    render: function () {
      var todoItem  = this.props.todoItem,
          textClass = todoItem.isCompleted ? 'text-line-through' : 'text-info';

      return (
        <tr>
          <td><input type='checkbox' checked={todoItem.isCompleted} onChange={this.handleToggle}/></td>
          <td><strong className={textClass}>{todoItem.text}</strong></td>
          <td><i className='glyphicon glyphicon-remove text-danger' onClick={this.removeItem}></i></td>
        </tr>
      );
    }
  });

  var TodoMain = React.createClass({
    mixins: [ReactRouter.State],
    propTypes: {
      list: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
    },

    toggleAll: function (e) {
      TodoActions.toggleAllItem(e.target.checked)
    },

    render: function () {
      var filteredList;
      switch (this.getPath()) {
        case '/completed':
          filteredList = this.props.list.filter(function (item) { return item.isCompleted; });
          break;
        case '/active':
          filteredList = this.props.list.filter(function (item) { return !item.isCompleted; });
          break;
        default:
          filteredList = this.props.list;
      }

      return (
        <div>
          <table className='table table-striped'>
            <thead>
              <tr>
                <th><input type='checkbox' onChange={this.toggleAll} /></th>
                <th><strong>Todo Item</strong></th>
                <th><strong>Remove</strong></th>
              </tr>
            </thead>
            <tbody>
              {
                filteredList.map(function (item) {
                  return <TodoItem todoItem={item} />
                })
              }
            </tbody>
          </table>
        </div>
      );
    }
  });

  var TodoApp = React.createClass({
    mixins: [Reflux.connect(todoListStore, 'list')],

    render: function () {
      return (
        <div className="row row-fluid">
          <div className='col-sm-6 col-sm-offset-3'>
            <TodoHeader />
            <ReactRouter.RouteHandler list={this.state.list} />
            <TodoFooter list={this.state.list} />
          </div>
        </div>
      );
    }
  });

  var routes = (
    <ReactRouter.Route handler={TodoApp}>
      <ReactRouter.Route name='All' path='/' handler={TodoMain} />
      <ReactRouter.Route name='Completed' path='/completed' handler={TodoMain} />
      <ReactRouter.Route name='Active' path='/active' handler={TodoMain} />
    </ReactRouter.Route>
  );

  ReactRouter.run(routes, function (Handler) {
    React.render(<Handler/>, document.getElementById('todoapp'));
  });

})(window.React, window.ReactRouter, window.Reflux, window.TodoActions, window.todoListStore);
