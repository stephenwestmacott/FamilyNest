import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
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
}

export class ToDoList extends Component<{}, State> {
  state: State = {
    todoItems: [],
    newTodo: "",
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
    const newTodoItems = this.state.todoItems.filter((item) => !item.checked);
    this.setState({ todoItems: newTodoItems });
  };

  renderTodoItem = ({ item }: { item: TodoItem }) => (
    <View style={styles.todoItem}>
      <BouncyCheckbox
        isChecked={item.checked}
        text={item.text}
        onPress={() => this.toggleTodo(item.id)}
        iconStyle={{ borderColor: "#ccc" }}
        textStyle={{
          textDecorationLine: item.checked ? "line-through" : "none",
        }}
      />
    </View>
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
          <Text style={styles.clearButtonText}>Clear Checked</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 0,
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
  clearButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ToDoList;
