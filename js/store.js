(function (Reflux, TodoActions, window) {
  'use strict';

  function getItemById(list, id) {
    return list.filter(function (item) {
      return (item.id === id)
    })[0];
  }

  window.todoListStore = Reflux.createStore({
    listenables: [TodoActions],

    onToggleItem: function (itemId) {
      var item = getItemById(this.list, itemId);

      if (item) {
        item.isCompleted = !item.isCompleted;
        this.updateList(this.list);
      }
    },

    onToggleAllItem: function (state) {
      this.list.forEach(function (item) {
        item.isCompleted = state;
      });

      this.updateList(this.list);
    },

    onAddItem: function (text) {
      var newItemId = this.list.length > 0 ? this.list[this.list.length - 1].id + 1 : 1,
          newItem   = {
            id: newItemId,
            text: text,
            isCompleted: false
          };

      this.list.push(newItem);
      this.updateList(this.list);
    },

    onRemoveItem: function (itemId) {
      var list = this.list.filter(function (item) {
        return item.id !== itemId;
      });

      this.list = list;
      this.updateList(list);
    },

    onClearCompleted: function () {
      var list = this.list.filter(function (item) {
        return !item.isCompleted;
      });

      this.list = list;
      this.updateList(list);
    },

    updateList: function (list) {
      this.list = list;
      this.trigger(list);
    },

    getInitialState: function () {
      this.list = [
        {id: 0, text: 'learn ruby', isCompleted: true},
        {id: 1, text: 'learn flux', isCompleted: false}
      ];

      return this.list;
    }
  });

})(window.Reflux, window.TodoActions, window);
