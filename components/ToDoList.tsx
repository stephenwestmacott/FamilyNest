import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

interface TodoItem {
  id: number;
  text: string;
  checked: boolean;
}

interface State {
  todoItems: TodoItem[];
  newTodo: string;
  editingText: string;
  editItemId: number | null;
}

export class ToDoList extends Component<{}, State> {
  state: State = {
    todoItems: [],
    newTodo: "",
    editingText: "",
    editItemId: null,
  };

  addTodo = () => {
    if (this.state.newTodo.trim() === "") {
      return;
    }

    const newTodoItems = [
      ...this.state.todoItems,
      { id: Date.now(), text: this.state.newTodo.trim(), checked: false },
    ];
    this.setState({ todoItems: newTodoItems, newTodo: "" });
  };

  toggleTodo = (id: number) => {
    const newTodoItems = this.state.todoItems.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    this.setState({ todoItems: newTodoItems });
  };

  clearChecked = () => {
    Alert.alert("Clear Checked Items", "Are you sure?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          const newTodoItems = this.state.todoItems.filter(
            (item) => !item.checked
          );
          this.setState({ todoItems: newTodoItems });
        },
      },
    ]);
  };

  startEditing = (id: number, text: string) => {
    this.setState({ editItemId: id, editingText: text });
  };

  saveEditedTodo = () => {
    if (this.state.editingText.trim() === "") {
      return;
    }

    const newTodoItems = this.state.todoItems.map((item) =>
      item.id === this.state.editItemId
        ? { ...item, text: this.state.editingText.trim() }
        : item
    );
    this.setState({
      todoItems: newTodoItems,
      editItemId: null,
      editingText: "",
    });
  };

  renderTodoItem = ({ item }: { item: TodoItem }) => (
    <>
      {this.state.editItemId === item.id ? (
        <TextInput
          style={styles.editInput}
          value={this.state.editingText}
          onChangeText={(text) => this.setState({ editingText: text })}
          autoFocus
          onBlur={this.saveEditedTodo}
          onSubmitEditing={this.saveEditedTodo}
        />
      ) : (
        <BouncyCheckbox
          isChecked={item.checked}
          text={item.text}
          onPress={() => this.toggleTodo(item.id)}
          iconStyle={{ borderColor: "#ccc" }}
          onLongPress={() => this.startEditing(item.id, item.text)}
          style={styles.todoItem}
        />
      )}
    </>
  );

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={this.state.newTodo}
          onChangeText={(text) => this.setState({ newTodo: text })}
          placeholder="Enter new todo"
          onSubmitEditing={this.addTodo}
        />
        <FlatList
          data={this.state.todoItems}
          renderItem={this.renderTodoItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />
        <TouchableOpacity
          onPress={this.clearChecked}
          style={styles.clearButton}
        >
          <Text style={styles.clearButtonText}>Clear Checked Items</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    width: "100%",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  editInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    height: 57,
  },
  clearButton: {
    backgroundColor: "#FAA0A0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "black",
    borderWidth: 1,
    elevation: 2,
  },
  clearButtonText: {
    color: "black",
    fontSize: 16,
  },
});

export default ToDoList;
